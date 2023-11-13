import React, { useEffect, useState } from 'react';
import styles from './RetoolCharts.module.scss';
import { Spinner } from 'components/Spinner';
import { Chart } from 'components/Chart';
import { scenarioReportAPI } from 'services/ScenarioReportService';
import { CSVButton } from 'components/CSVButton';
import { cashflowAPI } from 'services/CashflowService';
import { urlFormat } from 'utils/urlFormat';
import { Cashflow } from 'models/Cashflow';
import { resolvePromisesSeq } from 'utils/resolvePromisesSeq';
import { Error } from 'components/Error';
import { useSkipParam } from 'hooks/useSkipParam';
import { projectReportAPI } from 'services/ProjectReportService';
import { getDownloadData } from './utils/getDownloadData/getDownloadData';
import { useAuth } from 'hooks/useAuth';
import { useAppDispatch } from 'hooks/redux';
import { clearToken } from 'store/reducers/tokenSlice';

interface Props {
    areaId: number;
    scenarioIds?: number[];
    projectIds?: number[];
    comparisonData?: {
        id: string;
        area: { value: number, label: string };
        projects: { value: number, label: string }[];
        scenario: { value: number, label: string };
    }[];
    isProject?: boolean;
    isScenario?: boolean;

}

export const Requirements: React.FC<Props> = ({ areaId, scenarioIds = [], projectIds = [], comparisonData = [], isProject, isScenario }) => {
    const { token } = useAuth();
    const dispatch = useAppDispatch();

    const [urlParams, setUrlParams] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const obj: { area_id?: number, scenario_ids?: number[], project_ids: number[] } = { scenario_ids: [], project_ids: [] };

        if (scenarioIds.length && isScenario) {
            delete obj.area_id;
            obj.scenario_ids = scenarioIds;
        }

        if (projectIds.length && isProject) {
            delete obj.area_id;
            delete obj.scenario_ids;
            obj.project_ids = projectIds
        }

        if (areaId === 11) {
            delete obj.area_id;
        }

        setUrlParams(urlFormat(obj));
    }, [areaId, scenarioIds, projectIds, isScenario, isProject]);

    const { skipParam: skipParamScenarios, setSkipParam: setSkipParamScenarios } = useSkipParam(areaId, scenarioIds);
    const { skipParam: skipParamProjects, setSkipParam: setSkipParamProjects } = useSkipParam(areaId, projectIds);

    useEffect(() => {
        if (!scenarioIds.filter((el) => el).length && skipParamScenarios === false && cashflowData.length) {
            setSkipParamScenarios(true);
        }

        if (!projectIds.filter((el) => el).length && skipParamProjects === false && cashflowData.length) {
            setSkipParamProjects(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skipParamProjects, skipParamScenarios, scenarioIds, projectIds]);


    // useEffect(() => {
    //     if (!areaId || scenarioIds.filter((el) => el).length === 0) {
    //         setSkipParam(true);
    //     }
    // }, [areaId, scenarioIds, projectIds]);

    const { data: scenarioReportData = [], isFetching: scenarioReportLoading, error: scenarioError } = scenarioReportAPI.useGetScenarioReportQuery();
    const { data: projectReportData = [], isFetching: projectReportLoading, error: projectReportError } = projectReportAPI.useGetProjectReportQuery();

    const { data: cashflowData = [], isFetching: cashflowDataLoading, error: cashflowError } = cashflowAPI.useGetCashflowQuery({ params: urlParams }, {
        skip: isProject ? skipParamProjects : skipParamScenarios
    });

    const [comparisonReport, setComparisonReport] = useState<any>([]);

    useEffect(() => {
        if (comparisonData.length) {
            setIsLoading(true);
            setError(false);

            const filterUrl = isScenario ? comparisonData.filter((el) => el.scenario.value) : comparisonData.filter((el) => el.projects.length);
            if (!filterUrl.length) {
                setIsLoading(false);
                setComparisonReport([]);
                return;
            }

            const mapArr = filterUrl.map((scenario) => {
                const urlParameters = isScenario ? urlFormat({ scenario_ids: scenario.scenario.value }) : urlFormat({ project_ids: scenario.projects.map((el) => el.value) });

                return fetch(`https://reports.fibreplanner.io/api/v1/cashflows?${urlParameters}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.status === 401) {
                            // If a 401 Unauthorized response is received, dispatch the clearToken action
                            dispatch(clearToken());
                        }
                        return response.json();
                    })
                    .then(response => {
                        return {
                            id: scenario.id,
                            scenario: scenario.scenario,
                            project: scenario.projects[0],
                            response
                        };
                    });

            }).filter((el) => el);

            (async () => {
                try {
                    const users = (await resolvePromisesSeq(mapArr)).filter((el) => el);

                    setComparisonReport(users);
                } catch {
                    setError(true);
                } finally {
                    setIsLoading(false);
                }
            })();

        } else {
            setComparisonReport([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comparisonData]);


    const isLoadingState = scenarioReportLoading || projectReportLoading || cashflowDataLoading || isLoading;
    const isErrorState = scenarioError || projectReportError || cashflowError || error;

    if (isErrorState) {
        return <Error />
    }

    const responseData = ((isProject && projectIds.length) || (isScenario && scenarioIds.length)) ? cashflowData : [];
    const chartData: {
        id: string,
        response: Cashflow[],
        scenario: { value: number, label: string } | null,
        project: { value: number, label: string } | null,
    }[] = [
            {
                id: `${areaId}-${scenarioIds}-${projectIds.join('')}`,
                scenario: isScenario ? {
                    value: scenarioReportData.find((el) => el.id === scenarioIds[0])?.id,
                    label: scenarioReportData.find((el) => el.id === scenarioIds[0])?.label
                } : null,
                project: isProject ? {
                    value: projectReportData.find((el) => el.id === projectIds[0])?.id,
                    label: projectReportData.find((el) => el.id === projectIds[0])?.project
                } : null,
                response: responseData,
            },
            ...comparisonReport
        ];

    const data = chartData.map((el) => {
        return {
            ...el,
            revenue_total: el.response.map((el) => el.revenue_total),
            bank_balance: el.response.map((el) => el.bank_balance),
            capex_total: el.response.map((el) => el.capex_total),
            voucher: el.response.map((el) => el.this_day_voucher_revenue),
            live_uprns: el.response.map((el) => el.live_uprns),
            uprn_total: el.response.map((el) => el.uprn_total),

        }
    });

    const plotConfigrevenue_total = data.map((el) => {
        return {
            y: el.revenue_total,
            type: 'scatter',
            name: `${isScenario ? el.scenario?.label : el.project?.label} - revenue_total`,
            mode: 'lines+markers',
            hovertemplate: "revenue_total: %{y}<extra></extra>",
            line: {
                width: 1
            }
        }
    });
    const plotConfigbank_balance = data.map((el) => {
        return {
            y: el.bank_balance,
            type: 'scatter',
            name: `${isScenario ? el.scenario?.label : el.project?.label} - bank_balance`,
            mode: 'lines+markers',
            hovertemplate: "bank_balance: %{y}<extra></extra>",
            line: {
                width: 1
            }
        }
    });
    const plotConfigcapex_total = data.map((el) => {
        return {
            y: el.capex_total,
            type: 'scatter',
            name: `${isScenario ? el.scenario?.label : el.project?.label} - uprn_total`,
            mode: 'lines+markers',
            hovertemplate: "capex_total: %{y}<extra></extra>",
            line: {
                width: 1
            }
        }
    });

    const plotConfig = [...plotConfigrevenue_total, ...plotConfigbank_balance, ...plotConfigcapex_total]

    const plotConfigVoucher = data.map((el) => {
        return {
            y: el.voucher,
            type: 'scatter',
            name: `${isScenario ? el.scenario?.label : el.project?.label} - voucher`,
            mode: 'lines+markers',
            hovertemplate: "voucher: %{y}<extra></extra>",
            line: {
                width: 1
            }
        }
    });

    const plotConfiglive_uprns = data.map((el) => {
        return {
            y: el.live_uprns,
            type: 'scatter',
            name: `${isScenario ? el.scenario?.label : el.project?.label} - live_uprns`,
            mode: 'lines+markers',
            hovertemplate: "live_uprns: %{y}<extra></extra>",
            line: {
                width: 1
            }
        }
    });

    const plotConfiguprn_total = data.map((el) => {
        return {
            y: el.uprn_total,
            type: 'scatter',
            name: `${isScenario ? el.scenario?.label : el.project?.label} - uprn_total`,
            mode: 'lines+markers',
            hovertemplate: "uprn_total: %{y}<extra></extra>",
            line: {
                width: 1
            }
        }
    });

    const plotConfigUPRN = [...plotConfiglive_uprns, ...plotConfiguprn_total]

    return <>

        <div className={styles.chartBody}>
            <div style={{ minHeight: '500px' }}>
                {isLoadingState && <Spinner className={styles.customSpinner} />}
                {!isLoadingState && <>
                    <div className={styles.download}>
                        <CSVButton
                            data={chartData}
                            arrOfProps={['day', 'revenue_total', 'bank_balance', 'capex_total']}
                            filename={'cashflow.csv'} />
                    </div>
                    <Chart plotData={plotConfig}
                        x={'Day'}
                        y={'GBP'}
                        title={`Cashflow`}
                        layout={{
                            hovermode: "x unified",
                            hoverlabel: {
                                namelength: 600,
                                bgcolor: "#000",
                                bordercolor: "#000",
                                font: {
                                    color: "#fff",
                                    family: "var(--default-font, var(--sans-serif))",
                                    size: 13
                                }
                            },
                        }} />
                </>
                }
            </div>
        </div>
        <div className={styles.chartBody}>
            <div style={{ minHeight: '500px' }}>
                {isLoadingState && <Spinner className={styles.customSpinner} />}
                {!isLoadingState && <>
                    <div className={styles.download}>
                        <CSVButton data={chartData}
                            filename={'daily-voucher-revenue.csv'}
                            arrOfProps={['day', 'this_day_voucher_revenue']}
                        />
                    </div>
                    <Chart plotData={plotConfigVoucher}
                        x={'Day'}
                        y={'GBP'}
                        title={`Daily Voucher Revenue`}
                        layout={{
                            hovermode: "x unified",
                            hoverlabel: {
                                namelength: 600,
                                bgcolor: "#000",
                                bordercolor: "#000",
                                font: {
                                    color: "#fff",
                                    family: "var(--default-font, var(--sans-serif))",
                                    size: 13
                                }
                            },
                        }} />
                </>
                }
            </div>
        </div>
        <div className={styles.chartBody}>
            <div style={{ minHeight: '500px' }}>
                {isLoadingState && <Spinner className={styles.customSpinner} />}
                {!isLoadingState && <>
                    <div className={styles.download}>
                        <CSVButton
                            data={chartData}
                            filename={'RFS-live-customers.csv'}
                            arrOfProps={['day', 'live_uprns', 'uprn_total']}
                        />
                    </div>
                    <Chart plotData={plotConfigUPRN}
                        x={'Day'}
                        y={'GBP'}
                        title={`Total RFS vs Live Customers`}
                        layout={{
                            hovermode: "x unified",
                            hoverlabel: {
                                namelength: 600,
                                bgcolor: "#000",
                                bordercolor: "#000",
                                font: {
                                    color: "#fff",
                                    family: "var(--default-font, var(--sans-serif))",
                                    size: 13
                                }
                            },
                        }} />
                </>
                }
            </div>
        </div>
    </>
}