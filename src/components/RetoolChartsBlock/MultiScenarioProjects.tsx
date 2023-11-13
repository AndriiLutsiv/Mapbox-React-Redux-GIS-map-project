import React, { useEffect, useState } from 'react';
import styles from './RetoolCharts.module.scss';
import { Spinner } from 'components/Spinner';
import { Chart } from 'components/Chart';
import { scenarioReportAPI } from 'services/ScenarioReportService';
import { urlFormat } from 'utils/urlFormat';
import { ConfigProvider, Slider } from 'antd';
import { projectSummaryReportAPI } from 'services/ProjectSummaryReportService';
import { ProjectSummaryReport } from 'models/ProjectSummaryReport';
import { Tab } from 'components/Tab';
import { numberFormatter } from 'components/Table/utils/priceFormatter';
import { resolvePromisesSeq } from 'utils/resolvePromisesSeq';
import { useSkipParam } from 'hooks/useSkipParam';
import { Error } from 'components/Error';
import classNames from 'classnames';
import { feasibilityTransformerAllScenarios } from 'utils/feasibilityTransformerAllScenarios/feasibilityTransformerAllScenarios';
import { CSVButton } from 'components/CSVButton';
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
    variables: {
        averageVoucherValue: number;
        avgOpppPa: number;
        revenuePeriod: number;
        cpppAssetValue: number;
        couponRate: number;
        cppcAssetvalue: number;
    };
}

export const MultiScenarioProjects: React.FC<Props> = ({ variables, areaId, scenarioIds = [], projectIds = [], comparisonData = [] }) => {
    const { token } = useAuth();
    const dispatch = useAppDispatch();

    const [urlParams, setUrlParams] = useState<string>('');
    const [minMaxArrCPPP, setMinMaxArrCPPP] = useState<number[]>([0, 5000]);
    const [minMaxArrROI, setMinMaxArrROI] = useState<number[]>([0, 100]);
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { skipParam, setSkipParam } = useSkipParam(areaId, scenarioIds);
    const [comparisonReport, setComparisonReport] = useState<{
        id: string,
        response: ProjectSummaryReport[],
        scenario: { value: number, label: string },
    }[]>([]);

    const { data: scenarioReportData = [], isFetching: scenarioReportLoading, error: scenarioError } = scenarioReportAPI.useGetScenarioReportQuery();

    useEffect(() => {
        const obj: { area_id?: number, scenario_ids?: number[], aggregate_projects: boolean, area_name?: string } = { area_id: areaId, scenario_ids: [], aggregate_projects: false };

        if (areaId) {
            obj.area_id = areaId;
        }

        if (scenarioIds.length) {
            obj.scenario_ids = scenarioIds
        }

        obj.aggregate_projects = false;

        if (areaId === 11) {
            delete obj.area_id;
            obj.area_name = 'demo5'
        }

        setUrlParams(urlFormat(obj));
    }, [areaId, scenarioIds, projectIds, scenarioReportLoading]);

    useEffect(() => {
        if (!areaId || scenarioIds.filter((el) => el).length === 0) {
            setSkipParam(true);
        }
    }, [areaId, scenarioIds,  projectIds]);

    const { data: projectSummary = [], isFetching: projectSummaryLoading, error: projectSummaryError } = projectSummaryReportAPI.useGetProjectReportQuery({ params: urlParams }, {
        skip: skipParam
    });

    useEffect(() => {
        if (comparisonData.length || scenarioIds.length) {
            setIsLoading(true);
            setError(false);

            const mapArr = comparisonData.map((scenario) => {
                const urlParameters = urlFormat({ scenario_ids: scenario.scenario.value, aggregate_projects: false });

                return fetch(`https://reports.fibreplanner.io/api/v1/project-summary?${urlParameters}`, {
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
                            response
                        };
                    });
            });

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
    }, [comparisonData, scenarioIds]);

    const isLoadingState = projectSummaryLoading || scenarioReportLoading || isLoading;
    const isErrorState = projectSummaryError || scenarioError || error;

    if (isErrorState) {
        return <Error />
    }

    const chartData: {
        id: string,
        response: ProjectSummaryReport[],
        scenario: { value: number, label: string },
    }[] = [
            {
                id: `${areaId}-${scenarioIds}-${projectIds.join('')}`,
                scenario: {
                    value: scenarioReportData.find((el) => el.id === scenarioIds[0])?.id || -1,
                    label: scenarioReportData.find((el) => el.id === scenarioIds[0])?.label || ''
                },
                response: projectSummary
            },
            ...comparisonReport
        ];

    const FilteredData = chartData.map((el) => {
        return {
            ...el,
            response: feasibilityTransformerAllScenarios(el.response, scenarioReportData, variables).project_level
        }
    });

    const getFilteredData = (data: any, prop: string) => {
        if (data.avg_cppp >= minMaxArrCPPP[0]
            && data.roi_at_pen_rate_years >= minMaxArrROI[0]
            && data.avg_cppp <= minMaxArrCPPP[1]
            && data.roi_at_pen_rate_years <= minMaxArrROI[1]) {
            return data
        }

        return {
            [prop]: 0
        };
    }

    const data = FilteredData.map((el) => {
        return {
            ...el,
            avg_cppp: el.response.map((item: { avg_cppp: number; }) => getFilteredData(item, 'avg_cppp')).map((item: { avg_cppp: any; }) => item.avg_cppp),
            roi: el.response.map((item: any) => getFilteredData(item, 'roi_at_pen_rate_years')).map((item: { roi_at_pen_rate_years: any; }) => item.roi_at_pen_rate_years),
            uprn_count: el.response.map((item: any) => getFilteredData(item, 'uprn_count')).map((item: { uprn_count: any; }) => item.uprn_count),
            total_capex: el.response.map((item: any) => getFilteredData(item, 'total_capex1')).map((item: { total_capex1: any; }) => item.total_capex1),
            capex_spine_100_pct_leadin: el.response.map((item: any) => getFilteredData(item, 'capex_spine_100_pct_leadin')).map((item: { capex_spine_100_pct_leadin: any; }) => item.capex_spine_100_pct_leadin),
            revenue_d30_r80: el.response.map((item: any) => getFilteredData(item, 'revenue_d30_r80')).map((item: { revenue_d30_r80: any; }) => item.revenue_d30_r80),
            gross_profit_pa: el.response.map((item: any) => getFilteredData(item, 'gross_profit_pa')).map((item: { gross_profit_pa: any; }) => item.gross_profit_pa),
            gross_profit_over_year_period: el.response.map((item: any) => getFilteredData(item, 'gross_profit_over_year_period')).map((item: { gross_profit_over_year_period: any; }) => item.gross_profit_over_year_period),
            EV_per_prem_connected_and_passed: el.response.map((item: any) => getFilteredData(item, 'EV_per_prem_connected_and_passed')).map((item: { EV_per_prem_connected_and_passed: any; }) => item.EV_per_prem_connected_and_passed),
            ev_minus_coupon_plus_period_gp_net_EV: el.response.filter((data: any) => data.avg_cppp >= minMaxArrCPPP[0]
                && data.roi_at_pen_rate_years >= minMaxArrROI[0]
                && data.avg_cppp <= minMaxArrCPPP[1]
                && data.roi_at_pen_rate_years <= minMaxArrROI[1]).map((item: any) => item.project_name),
            project_name: el.response.map((item: { project_name: string; project: string }) => item.project_name?.split('_').map((item: string) => item[0]?.toUpperCase() + item?.slice(1)).join(' ')),
        }
    });

    const cvsData = FilteredData.map((el) => {
        return {
            ...el,
            response: el.response.map((item: any) => {
                return {
                    ...item,
                    ...getFilteredData(item, 'avg_cppp'),
                    ...getFilteredData(item, 'roi_at_pen_rate_years'),
                    ...getFilteredData(item, 'uprn_count'),
                    ...getFilteredData(item, 'total_capex1'),
                    ...getFilteredData(item, 'capex_spine_100_pct_leadin'),
                    ...getFilteredData(item, 'revenue_d30_r80'),
                    ...getFilteredData(item, 'gross_profit_pa'),
                    ...getFilteredData(item, 'gross_profit_over_year_period'),
                    ...getFilteredData(item, 'EV_per_prem_connected_and_passed'),
                    // ...getFilteredData(item, 'ev_minus_coupon_plus_period_gp_net_EV'),
                    project_name: item.project_name?.split('_').map((item: string) => item[0]?.toUpperCase() + item?.slice(1)).join(' ')
                }
            })
        }
    });


    // CPPP Spreads
    const cppp_spreads = data.map((el, i) => {
        return {
            x: el.project_name,
            y: el.avg_cppp,
            type: 'bar',
            name: el.scenario.label,
            hovertemplate: "<b>%{x}</b><br>avg_cppp: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.project_name,
                    order: "ascending"
                }
            ],
        }
    });

    // ROI Years
    const roiConfig = data.map((el, i) => {
        return {
            x: el.project_name,
            y: el.roi,
            type: 'bar',
            name: el.scenario.label,
            hovertemplate: "<b>%{x}</b><br>roi: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.project_name,
                    order: "ascending"
                }
            ],
        }
    });

    // UPRN Count
    const uprn_countConfig = data.map((el, i) => {
        return {
            x: el.project_name,
            y: el.uprn_count,
            type: 'bar',
            name: el.scenario.label,
            hovertemplate: "<b>%{x}</b><br>uprn_count: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.project_name,
                    order: "ascending"
                }
            ],
        }
    });

    // Capex
    const capexConfig = data.map((el, i) => {
        return {
            x: el.project_name,
            y: el.total_capex,
            type: 'bar',
            name: el.scenario.label,
            hovertemplate: "<b>%{x}</b><br>total_capex: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.project_name,
                    order: "ascending"
                }
            ],
        }
    });

    //Avg. CPPC
    const avgCPPC = data.map((el, i) => {
        return {
            x: el.project_name,
            y: el.capex_spine_100_pct_leadin,
            type: 'bar',
            name: el.scenario.label,
            hovertemplate: "<b>%{x}</b><br>capex_spine_100_pct_leadin: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.project_name,
                    order: "ascending"
                }
            ],
        }
    });

    //1Y Revenue
    const revenue1YConfig = data.map((el, i) => {
        return {
            x: el.project_name,
            y: el.revenue_d30_r80,
            type: 'bar',
            name: el.scenario.label,
            hovertemplate: "<b>%{x}</b><br>revenue_d30_r80: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.project_name,
                    order: "ascending"
                }
            ],
        }
    });

    //Gross Profit p/a 3Y
    const grossProfit3YConfig = data.map((el, i) => {
        return {
            x: el.project_name,
            y: el.gross_profit_pa,
            type: 'bar',
            name: el.scenario.label,
            hovertemplate: "<b>%{x}</b><br>gross_profit_pa: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.project_name,
                    order: "ascending"
                }
            ],
        }
    });

    // gross_profit_over_year_period DEPENTS on TOTAL CAPEX PARAMS
    const grossProfit6YConfig = data.map((el, i) => {
        return {
            x: el.project_name,
            y: el.gross_profit_over_year_period,
            type: 'bar',
            name: el.scenario.label,
            hovertemplate: "<b>%{x}</b><br>gross_profit_over_year_period: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.project_name,
                    order: "ascending"
                }
            ],
        }
    });

    //EV by UPRN Connected & Passed
    const UPRNConnectedPassedConfig = data.map((el, i) => {
        return {
            x: el.project_name,
            y: el.EV_per_prem_connected_and_passed,
            type: 'bar',
            name: el.scenario.label,
            hovertemplate: "<b>%{x}</b><br>EV_per_prem_connected_and_passed: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.project_name,
                    order: "ascending"
                }
            ],
        }
    });

    //EV minus Coupon plus 6Y Gross Profit
    const ev_minus_coupon_plus_period_gp_net_EVConfig = data.map((el, i) => {
        return {
            x: el.project_name,
            type: 'bar',
            orientation: 'h',
            name: el.scenario.label,
            hovertemplate: "<b>%{x}</b><extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.project_name,
                    order: "ascending"
                }
            ],
        }
    });

    const onChangeCPPP = (value: number[]) => {
        setMinMaxArrCPPP(value);
    };

    const onChangeROI = (value: number[]) => {
        setMinMaxArrROI(value);
    };

    // Build Stats Deltas
    const tabsConfig = [
        {
            label: 'CPPP Spreads',
            key: 'CPPP Spreads',
            children: <div style={{ position: 'relative' }}>
                <div className={styles.download}>
                    <CSVButton
                        data={cvsData}
                        filename={'cppp_spreads.csv'}
                        arrOfProps={['project', 'project_name', 'avg_cppp']}
                    />
                </div>
                <Chart plotData={cppp_spreads}
                    legend={{
                        x: 0,
                        y: 1.2,
                    }}
                />
            </div>,
        },
        {
            label: 'ROI Years',
            key: 'ROI Years',
            children: <div style={{ position: 'relative' }}>
                <div className={styles.download}>
                    <CSVButton
                        data={cvsData}
                        filename={'roi.csv'}
                        arrOfProps={['project', 'project_name', 'roi_at_pen_rate_years']}
                    />
                </div>
                <Chart plotData={roiConfig}
                    legend={{
                        x: 0,
                        y: 1.2,
                    }}
                />
            </div>,
        },
        {
            label: 'UPRN Count',
            key: 'UPRN Count',
            children: <div style={{ position: 'relative' }}>
                <div className={styles.download}>
                    <CSVButton
                        data={cvsData}
                        filename={'uprn_count.csv'}
                        arrOfProps={['project', 'project_name', 'uprn_count']}
                    />
                </div>
                <Chart plotData={uprn_countConfig}
                    legend={{
                        x: 0,
                        y: 1.2,
                    }}
                />
            </div>,
        },
        {
            label: 'Capex',
            key: 'Capex',
            children: <div style={{ position: 'relative' }}>
                <div className={styles.download}>
                    <CSVButton
                        data={cvsData}
                        filename={'capex.csv'}
                        arrOfProps={['project', 'project_name', 'total_capex1']}
                    />
                </div>
                <Chart plotData={capexConfig}
                    legend={{
                        x: 0,
                        y: 1.2,
                    }}
                />
            </div>,
        },
        {
            label: 'Avg. CPPC',
            key: 'Avg. CPPC',
            children: <div style={{ position: 'relative' }}>
                <div className={styles.download}>
                    <CSVButton
                        data={cvsData}
                        filename={'capex_spine.csv'}
                        arrOfProps={['project', 'project_name', 'capex_spine_100_pct_leadin']}
                    />
                </div>
                <Chart plotData={avgCPPC}
                    legend={{
                        x: 0,
                        y: 1.2,
                    }}
                />
            </div>,
        },
        {
            label: '1Y Revenue',
            key: '1Y Revenue',
            children: <div style={{ position: 'relative' }}>
                <div className={styles.download}>
                    <CSVButton
                        data={cvsData}
                        filename={'revenue_1Y.csv'}
                        arrOfProps={['project', 'project_name', 'revenue_d30_r80']}
                    />
                </div>
                <Chart plotData={revenue1YConfig}
                    legend={{
                        x: 0,
                        y: 1.2,
                    }}
                />
            </div>,
        },
        {
            label: 'Gross Profit p/a 3Y',
            key: 'Gross Profit p/a 3Y',
            children: <div style={{ position: 'relative' }}>
                <div className={styles.download}>
                    <CSVButton
                        data={cvsData}
                        filename={'gross_profit.csv'}
                        arrOfProps={['project', 'project_name', 'gross_profit_pa']}
                    />
                </div>
                <Chart plotData={grossProfit3YConfig}
                    legend={{
                        x: 0,
                        y: 1.2,
                    }}
                />
            </div>,
        },
        {
            label: 'Gross Profit Over 6Y Period',
            key: 'Gross Profit Over 6Y Period',
            children: <div style={{ position: 'relative' }}>
                <div className={styles.download}>
                    <CSVButton
                        data={cvsData}
                        filename={'gross_profit_over_year_period.csv'}
                        arrOfProps={['project', 'project_name', 'gross_profit_over_year_period']}
                    />
                </div>
                <Chart plotData={grossProfit6YConfig}
                    legend={{
                        x: 0,
                        y: 1.2,
                    }}
                />
            </div>,
        },
        {
            label: 'EV by UPRN Connected & Passed',
            key: 'EV by UPRN Connected & Passed',
            children: <div style={{ position: 'relative' }}>
                <div className={styles.download}>
                    <CSVButton
                        data={cvsData}
                        filename={'EV_per_prem_connected_and_passed.csv'}
                        arrOfProps={['project', 'project_name', 'EV_per_prem_connected_and_passed']}
                    />
                </div>
                <Chart plotData={UPRNConnectedPassedConfig}
                    legend={{
                        x: 0,
                        y: 1.2,
                    }}
                />
            </div>,
        },
        {
            label: 'EV minus Coupon plus 6Y Gross Profit',
            key: 'EV minus Coupon plus 6Y Gross Profit',
            children: <div style={{ position: 'relative' }}>
                {/* <div className={styles.download}>
                    <CSVButton
                        data={cvsData}
                        filename={'ev_minus_coupon_plus_period_gp_net_EV.csv'}
                        arrOfProps={['project', 'project_name', 'EV_per_prem_connected_and_passed']}
                    />
                </div> */}
                <Chart plotData={ev_minus_coupon_plus_period_gp_net_EVConfig}
                    legend={{
                        x: 0,
                        y: 1.2,
                    }}
                />
            </div>,
        }
    ]

    return <>
        <div className={styles.chartBody}>
            <div style={{ minHeight: '500px' }}>
                {isLoadingState && <Spinner className={styles.customSpinner} />}
                {!isLoadingState && <>
                    <ConfigProvider
                        theme={{
                            components: {
                                Slider: {
                                    trackBg: '#EA347E',
                                    railBg: '#292929',
                                    railHoverBg: '#292929',
                                    trackHoverBg: '#EA347E',
                                    handleActiveColor: '#EA347E',
                                    handleColor: '#EA347E'
                                }
                            }
                            ,
                            token: {
                                colorPrimary: '#EA347E',
                                borderRadius: 2,
                                colorBgContainer: '#EA347E',
                            },
                        }}
                    >
                        <div className={classNames(styles.sliderBlock, styles.variableBlock)}>
                            <p className={styles.sliderBlockTitle}>CPPP Range Filter</p>
                            <div className={styles.sliderContainer}>
                                <Slider
                                    range
                                    className={styles.slider}
                                    min={0}
                                    max={5000}
                                    defaultValue={[0, 5000]}
                                    step={100}
                                onChange={onChangeCPPP}
                                />
                                <p className={styles.sliderData}>{numberFormatter(minMaxArrCPPP[0])} - {numberFormatter(minMaxArrCPPP[1])}</p>
                            </div>

                        </div>
                        <div className={classNames(styles.sliderBlock, styles.variableBlock)}>
                            <p className={styles.sliderBlockTitle}>ROI Range Filter</p>
                            <div className={styles.sliderContainer}>
                                <Slider className={styles.slider}
                                    range min={0} max={100}
                                    defaultValue={[0, 100]}
                                onChange={onChangeROI}
                                />
                                <p className={styles.sliderData}>{numberFormatter(minMaxArrROI[0])} - {numberFormatter(minMaxArrROI[1])}</p>
                            </div>

                        </div>

                    </ConfigProvider>
                    <Tab isScrolled
                        config={tabsConfig}
                        defaultValue='CPPP Spreads'
                        smallerTabs />
                </>
                }
            </div>
        </div>
    </>
}