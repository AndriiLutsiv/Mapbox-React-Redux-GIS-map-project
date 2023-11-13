import { Tab } from 'components/Tab';
import styles from './RetoolCharts.module.scss';
import React, { useEffect, useState } from 'react';
import { scenarioReportAPI } from 'services/ScenarioReportService';
import { resolvePromisesSeq } from 'utils/resolvePromisesSeq';
import { Table } from 'components/Table';
import { Error } from 'components/Error';
import { numberFormatter, priceFormatter } from 'utils/priceFormatter';
import { cmpPlotAPI } from 'services/cmpPlotService';
import { transformArrayToObjectArray } from 'utils/transformArrayToObjectArray';
import { urlFormat } from 'utils/urlFormat';
import { Delta } from 'components/Delta/Delta';
import { useSkipParam } from 'hooks/useSkipParam';
import { Spinner } from 'components/Spinner';
import { Tooltip } from 'antd';
import { ScenarioLevelData, feasibilityTransformerAllScenarios } from 'utils/feasibilityTransformerAllScenarios/feasibilityTransformerAllScenarios';
import { TableHeader } from 'components/TableHeader';
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

type Data = {
    areasId: number,
    avg_cppp: number,
    avg_oppp_per_annum: number,
    description: string,
    id: number,
    name: string,
    omr_black_count: number,
    omr_grey_count: number,
    omr_under_review_count: number,
    omr_white_count: number,
    roi: number,
    total_capex: number,
    total_opex_per_annum: number,
    total_uprns_within_75m_of_dn: number,
    total_vouchers: number,
    uprn_count: number,
    vouchers_in_dense: number,
    vouchers_in_rural: number
}

export const ScenarioSummaryTables: React.FC<Props> = ({ variables, areaId, scenarioIds = [], projectIds = [], comparisonData = [] }) => {
    const { token } = useAuth();
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [scenarioReport, setScenarioReport] = useState<Data[]>([]);
    const [urlParams, setUrlParams] = useState<string>('');
    const { data: scenariosData = [], error: scenariosDataError, isFetching: isScenariosDataLoading } = scenarioReportAPI.useGetScenarioReportQuery();

    const { skipParam, setSkipParam } = useSkipParam(areaId, scenarioIds);
    useEffect(() => {
        const obj: { area_id?: number, scenario_ids: number[] } = { area_id: areaId, scenario_ids: [] };

        const arrOfScenarios: number[] = [];
        if (areaId) {
            obj.area_id = areaId;

        }

        if (scenarioIds.length) {
            const arr = scenariosData.filter((el) => el.id === scenarioIds[0]).map((el) => el.id);
            arrOfScenarios.push(...arr)
        }

        if (comparisonData.length) {
            delete obj.area_id;
            const arrayFromComparison = comparisonData.map((el) => el.scenario.value);
            arrOfScenarios.push(...arrayFromComparison);
        }

        if (arrOfScenarios.length) {
            obj.scenario_ids = arrOfScenarios;
        }

        if (areaId === 11) {
            delete obj.area_id;
        }
        setUrlParams(urlFormat(obj));
    }, [areaId, scenarioIds, projectIds, scenariosData, comparisonData]);

    useEffect(() => {
        if (!areaId || scenarioIds.filter((el) => el).length === 0) {
            setSkipParam(true);
        }
    }, [areaId, scenarioIds, projectIds]);

    const { data: cmpPlotData = {}, error: cmpPlotDataError, isFetching: isCmpPlotDataLoading } = cmpPlotAPI.useGetCmpPlotDataQuery({ params: urlParams }, {
        skip: skipParam
    });

    useEffect(() => {
        if (scenarioIds.length || comparisonData.length) {

            setIsLoading(true);
            setError(false);

            const dataArr = [];
            for (let i = 0; i < scenariosData.length; i++) {
                const foundedData = scenariosData.find((el) => el.id === scenarioIds[0]);
                if (foundedData) {
                    dataArr.push(foundedData);
                    break;
                }
            }

            const arr = dataArr;

            const arrComparison = scenariosData.filter((el) => {
                if (comparisonData.length) {
                    const areasArr = comparisonData.map((el) => el.scenario.value);

                    return areasArr.includes(el.id);
                }

            });

            if (comparisonData.length) {
                arr.push(...arrComparison)
            }

            const mapArr = arr.map((scenario) => {

                return fetch(`https://reports.fibreplanner.io/api/v1/project-summary?aggregate_projects=true&scenario_ids=${scenario.id}`, {
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
                            areasId: scenario.area_id,
                            scenario_name: scenario.label || '',
                            description: scenario.description,
                            ...response[0]
                        };
                    });
            });

            (async () => {
                try {
                    const users = (await resolvePromisesSeq(mapArr)).filter((el) => el);

                    setScenarioReport(users);
                } catch {
                    setError(true);
                } finally {
                    setIsLoading(false);
                }
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScenariosDataLoading, areaId, scenarioIds, comparisonData]);

    const isLoadingState = isCmpPlotDataLoading || isScenariosDataLoading || isLoading;
    const isErrorState = cmpPlotDataError || scenariosDataError || error;

    const tableData: ScenarioLevelData[] = feasibilityTransformerAllScenarios(scenarioReport, scenariosData, variables).scenario_level;

    const config: any = [
        {
            label: "Scenario Name",
            render: (data: any) => <Tooltip title={data.scenario} placement="topLeft">{data.scenario}</Tooltip>,
            // sortValue: (data: any) => data.scenario,
        },
        {
            label: "UPRN count",
            render: (data: any) => <p>
                {data.UPRNCount ? `${numberFormatter(data.UPRNCount)}` : <p className={styles.placeholder}>{`<No data>`}</p>}
                {
                    data.UPRNCount_delta && <Delta delta={data.UPRNCount_delta} units='%' />
                }
            </p>,
            // sortValue: (data: any) => data.UPRNCount,
        },
        {
            label: "Hercules CAPEX",
            render: (data: any) => <p>
                {data.herculesCAPEX ? `£${priceFormatter(data.herculesCAPEX)}` : <p className={styles.placeholder}>{`<No data>`}</p>}
                {
                    data.herculesCAPEX_delta && <Delta delta={data.herculesCAPEX_delta} units='%' />
                }
            </p>,
            // sortValue: (data: any) => data.herculesCAPEX,
        },
        {
            label: "Hercules OPEX",
            render: (data: any) => <p>
                {data.herculesOPEX ? `£${priceFormatter(data.herculesOPEX)}` : <p className={styles.placeholder}>{`<No data>`}</p>}
                {
                    data.herculesOPEX_delta && <Delta delta={data.herculesOPEX_delta} units='%' />
                }
            </p>,
            // sortValue: (data: any) => data.herculesOPEX,
        },
        {
            label: "CPPP Average",
            render: (data: any) => <p>
                {data.cpppAverage ? `£${priceFormatter(data.cpppAverage)}` : <p className={styles.placeholder}>{`<No data>`}</p>}
                {
                    data.cpppAverage_delta && <Delta delta={data.cpppAverage_delta} units='%' />
                }
            </p>,
            // sortValue: (data: any) => data.cpppAverage,
        },
        {
            label: "Possible Revenues p/a (£32 ARPU); 60% pen rate",
            render: (data: any) => <p>
                <span dangerouslySetInnerHTML={{ __html: data.possibleRevenues || '' }}></span>
                {
                    data.possibleRevenues_delta && <Delta delta={data.possibleRevenues_delta} units='x' />
                }
            </p>,
            // sortValue: (data: any) => data.possibleRevenues,
        },
        {
            label: "Number of unique projects / builds",
            render: (data: any) => data.uniqueProjects,
            // sortValue: (data: any) => data.uniqueProjects,
        },
    ];

    //Build Stats',
    const buildStatsTable = [

        {
            label: "Scenario Name",
            render: (data: any) => <Tooltip title={data.scenario_name} placement="topLeft">{data.scenario_name}</Tooltip>,
            sortValue: (data: any) => data.scenario_name,
        },
        {
            label: "Total CAPEX",
            render: (data: any) => data.total_capex1 || data.total_capex1 === 0 ? `£${priceFormatter(data.total_capex1)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.total_capex1,
        },
        {
            label: "Total build CAPEX",
            render: (data: any) => data.total_capex || data.total_capex === 0 ? `£${priceFormatter(data.total_capex)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.total_capex,
        },
        {
            label: "Total opex per annum",
            render: (data: any) => data.total_opex_per_annum || data.total_opex_per_annum === 0 ? `£${priceFormatter(data.total_opex_per_annum)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.total_opex_per_annum,
        },
        {
            label: "UPRN count",
            render: (data: any) => numberFormatter(data.uprn_count),
            sortValue: (data: any) => data.uprn_count,
        },
        {
            label: "Total vouchers",
            render: (data: any) => numberFormatter(data.total_vouchers),
            sortValue: (data: any) => data.total_vouchers,
        },
        {
            label: "Avarage cppp",
            render: (data: any) => data.average_cppp || data.average_cppp === 0 ? `£${priceFormatter(data.average_cppp)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.average_cppp,
        },
        {
            label: "Avarage pia oppp pa",
            render: (data: any) => data.average_pia_oppp_pa || data.average_pia_oppp_pa === 0 ? `£${priceFormatter(data.average_pia_oppp_pa)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.average_pia_oppp_pa,
        }
    ];

    const [buildStatsCVS, setBuildStatsCVS] = useState<any>([]);
    const [buildAreaPruneComparisonCVS, setBuildAreaPruneComparisonCVS] = useState<any>([]);
    const [pnlCVS, setPnlCVS] = useState<any>([]);
    const [valueByAssetCVS, setValueByAssetCVS] = useState<any>([]);

    useEffect(() => {
        // buildStatsTable
        const headersBbuildStatsTable = buildStatsTable.map((el) => el.label);

        const dataBuildStatsTable = tableData.map((el, i) => {
            const arr: any[] = [];
            for (let i = 0; i < buildStatsTable.length; i++) {
                arr.push(buildStatsTable[i].sortValue(el))
            }

            return arr;
        });

        const buildStatsCVSData = [
            headersBbuildStatsTable,
            ...dataBuildStatsTable
        ];

        setBuildStatsCVS(buildStatsCVSData);

        // Build Area Prune Comparison
        const headers_buildAreaPruneComparisonTable = buildAreaPruneComparisonTable.map((el) => el.label);

        const data_buildAreaPruneComparisonTable = tableData.map((el, i) => {
            const arr: any[] = [];
            for (let i = 0; i < buildAreaPruneComparisonTable.length; i++) {
                arr.push(buildAreaPruneComparisonTable[i].sortValue(el))
            }

            return arr;
        });

        const cvs_buildAreaPruneComparisonTable = [
            headers_buildAreaPruneComparisonTable,
            ...data_buildAreaPruneComparisonTable
        ];

        setBuildAreaPruneComparisonCVS(cvs_buildAreaPruneComparisonTable);

        // p&L
        const headers_pnlTable = pnlTable.map((el) => el.label);

        const data_pnlTable = tableData.map((el, i) => {
            const arr: any[] = [];
            for (let i = 0; i < pnlTable.length; i++) {
                arr.push(pnlTable[i].sortValue(el))
            }

            return arr;
        });

        const cvs_pnlTable = [
            headers_pnlTable,
            ...data_pnlTable
        ];

        setPnlCVS(cvs_pnlTable);

        //
        const headers_valueByAssetTable = valueByAssetTable.map((el) => el.label);

        const data_valueByAssetTable = tableData.map((el, i) => {
            const arr: any[] = [];
            for (let i = 0; i < valueByAssetTable.length; i++) {
                arr.push(valueByAssetTable[i].sortValue(el))
            }

            return arr;
        });

        const cvs_valueByAssetTable = [
            headers_valueByAssetTable,
            ...data_valueByAssetTable
        ];

        setValueByAssetCVS(cvs_valueByAssetTable);


    }, [isLoadingState]);

    //Build Area Prune Comparison
    const buildAreaPruneComparisonTable = [

        {
            label: "Scenario Name",
            render: (data: any) => <Tooltip title={data.scenario_name} placement="topLeft">{data.scenario_name}</Tooltip>,
            sortValue: (data: any) => data.scenario_name,
        },
        {
            label: "100% Spine Capex with Leadin",
            render: (data: any) => data.capex_spine_100_pct_leadin || data.capex_spine_100_pct_leadin === 0 ? `£${priceFormatter(data.capex_spine_100_pct_leadin)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.capex_spine_100_pct_leadin,
        },
        {
            label: "Voucher Contribution",
            render: (data: any) => data.voucher_contribution || data.voucher_contribution === 0 ? `£${priceFormatter(data.voucher_contribution)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.voucher_contribution,
        },
        {
            label: "Commercial Contribution CPPC",
            render: (data: any) => data.commercial_contribution_cppc || data.commercial_contribution_cppc === 0 ? `£${priceFormatter(data.commercial_contribution_cppc)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.commercial_contribution_cppc,
        },
        {
            label: "Avg. CPPP",
            render: (data: any) => data.avg_commercial_contribution_cppc_passed || data.avg_commercial_contribution_cppc_passed === 0 ? `£${priceFormatter(data.avg_commercial_contribution_cppc_passed)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.avg_commercial_contribution_cppc_passed,
        },
        {
            label: "Avg. CPPC",
            render: (data: any) => data.avg_commercial_contribution_cppc_connected || data.avg_commercial_contribution_cppc_connected === 0 ? `£${priceFormatter(data.avg_commercial_contribution_cppc_connected)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.avg_commercial_contribution_cppc_connected,
        },
    ]

    // P&L
    const pnlTable = [

        {
            label: "Scenario Name",
            render: (data: any) => <Tooltip title={data.scenario_name} placement="topLeft">{data.scenario_name}</Tooltip>,
            sortValue: (data: any) => data.scenario_name,
        },
        {
            label: "Prems Connected",
            render: (data: any) => data.prems_connected || data.prems_connected === 0 ? `${numberFormatter(data.prems_connected)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.prems_connected,
        },
        {
            label: "Revenue First Year",
            render: (data: any) => data.revenue_first_year || data.revenue_first_year === 0 ? `£${priceFormatter(data.revenue_first_year)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.revenue_first_year,
        },
        {
            label: "Total PIA OPPP p/a",
            render: (data: any) => data.total_pia_oppp_pa || data.total_pia_oppp_pa === 0 ? `£${priceFormatter(data.total_pia_oppp_pa)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.total_pia_oppp_pa,
        },
        {
            label: "Gross Profit p/a (Year 3)",
            render: (data: any) => data.gross_profit_pa_year_3 || data.gross_profit_pa_year_3 === 0 ? `£${priceFormatter(data.gross_profit_pa_year_3)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.gross_profit_pa_year_3,
        },
        {
            label: "ROI @ Pen Rate (yrs)",
            render: (data: any) => data.roi_at_pen_rate_years || data.roi_at_pen_rate_years === 0 ? data.roi_at_pen_rate_years.toFixed(2) : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.roi_at_pen_rate_years,
        },
        {
            label: "Gross Profit Over 6 Year Period",
            render: (data: any) => data.gross_profit_over_year_period || data.gross_profit_over_year_period === 0 ? `£${priceFormatter(data.gross_profit_over_year_period)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.gross_profit_over_year_period,
        },
    ]

    //Value By Asset
    const valueByAssetTable = [

        {
            label: "Scenario Name",
            render: (data: any) => <Tooltip title={data.scenario_name} placement="topLeft">{data.scenario_name}</Tooltip>,
            sortValue: (data: any) => data.scenario_name,
        },
        {
            label: "EV by Prem Connected & Passed",
            render: (data: any) => data.EV_per_prem_connected_and_passed || data.EV_per_prem_connected_and_passed === 0 ? `£${priceFormatter(data.EV_per_prem_connected_and_passed)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.EV_per_prem_connected_and_passed,
        },
        {
            label: "12% Coupon reducing over ROI period",
            render: (data: any) => data.coupon_reducing_over_roi_period || data.coupon_reducing_over_roi_period === 0 ? `£${priceFormatter(data.coupon_reducing_over_roi_period)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.coupon_reducing_over_roi_period,
        },
        {
            label: "EV minus Coupon plus period GP (Net EV)",
            render: (data: any) => data.ev_minus_coupon_plus_period_gp_net_EV || data.ev_minus_coupon_plus_period_gp_net_EV === 0 ? `£${priceFormatter(data.ev_minus_coupon_plus_period_gp_net_EV)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.ev_minus_coupon_plus_period_gp_net_EV,
        },
        {
            label: "EV Margin Per Prem Connected & Passed",
            render: (data: any) => data.EV_margin_per_prem_connected_and_passed || data.EV_margin_per_prem_connected_and_passed === 0 ? `£${priceFormatter(data.EV_margin_per_prem_connected_and_passed)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.EV_margin_per_prem_connected_and_passed,
        },
        {
            label: "Net EV + Coupon as % of Total Cash Outlay",
            render: (data: any) => data.net_EV_plus_coupon_as_pct_of_total_cash_outlay || data.net_EV_plus_coupon_as_pct_of_total_cash_outlay === 0 ? `${(data.net_EV_plus_coupon_as_pct_of_total_cash_outlay * 100).toFixed(2)} %` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.net_EV_plus_coupon_as_pct_of_total_cash_outlay,
        },
        {
            label: "Net EV + Coupon as % of Commercial Contribution",
            render: (data: any) => data.net_EV_plus_coupon_as_pct_of_commercial_contribution || data.net_EV_plus_coupon_as_pct_of_commercial_contribution === 0 ? `${(data.net_EV_plus_coupon_as_pct_of_commercial_contribution * 100).toFixed(2)} %` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: any) => data.net_EV_plus_coupon_as_pct_of_commercial_contribution,
        },

    ]

    if (isErrorState) {
        return <Error />
    }

    const tabConfig = [
        {
            label: 'Build Stats',
            key: 'Build Stats',
            children:
                <>
                    <TableHeader>
                        <CSVButton
                            data={[]}
                            preparedData={buildStatsCVS}
                            filename={'build_stats.csv'}
                        />
                    </TableHeader>
                    <div className={styles.scrolledContent}>

                        <Table
                            stickyColumn
                            round
                            config={buildStatsTable}
                            data={tableData}
                            pageSize={10}
                            isClickable={false} />
                    </div>
                </>
        },
        {
            label: 'Build Stats Deltas',
            key: 'Build Stats Deltas',
            children:
                <>
                    {isScenariosDataLoading && <Spinner className={styles.customSpinner} />}
                    {!isScenariosDataLoading &&
                        <div className={styles.scrolledContent}>
                            <Table
                                round
                                config={config}
                                data={transformArrayToObjectArray(cmpPlotData.data ? cmpPlotData?.data[0].cells.values : [])}
                                pageSize={10}
                                isClickable={false} />
                        </div>}
                </>
        },
        {
            label: 'Build Area Prune Comparison',
            key: 'Build Area Prune Comparison',
            children:
                <>
                    <TableHeader>
                        <CSVButton
                            data={[]}
                            preparedData={buildAreaPruneComparisonCVS}
                            filename={'build_area_prune_comparison.csv'}
                        />
                    </TableHeader>
                    <div className={styles.scrolledContent}>
                        <Table
                            round
                            stickyColumn
                            config={buildAreaPruneComparisonTable}
                            data={tableData}
                            pageSize={10}
                            isClickable={false} />
                    </div>
                </>
        },
        {
            label: 'P&L',
            key: 'P&L',
            children:
                <>
                    <TableHeader>
                        <CSVButton
                            data={[]}
                            preparedData={pnlCVS}
                            filename={'pnl.csv'}
                        />
                    </TableHeader>
                    <div className={styles.scrolledContent}>
                        <Table
                            round
                            stickyColumn
                            config={pnlTable}
                            data={tableData}
                            pageSize={10}
                            isClickable={false} />
                    </div>
                </>
        },
        {
            label: 'Value By Asset',
            key: 'Value By Asset',
            children:
                <>
                    <TableHeader>
                        <CSVButton
                            data={[]}
                            preparedData={valueByAssetCVS}
                            filename={'valueByAsset.csv'}
                        />
                    </TableHeader>
                    <div className={styles.scrolledContent}>
                        <Table
                            round
                            stickyColumn
                            config={valueByAssetTable}
                            data={tableData}
                            pageSize={10}
                            isClickable={false} />
                    </div>
                </>
        }
    ]
    return <>

        <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>Scenario Summary</h2>

            </div>
            <div className={styles.chartBody}>
                {isLoadingState && <Spinner className={styles.customSpinner} />}
                {!isLoadingState &&
                    <Tab isScrolled config={tabConfig} defaultValue={'Build Stats'} />}

            </div>
        </div>
    </>
}