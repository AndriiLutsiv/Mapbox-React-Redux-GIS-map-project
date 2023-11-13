import { useSkipParam } from "hooks/useSkipParam";
import { useEffect, useState } from "react";
import { urlFormat } from "utils/urlFormat";
import { scenarioReportAPI } from "services/ScenarioReportService";
import { projectSummaryReportAPI } from "services/ProjectSummaryReportService";
import { Button, Tooltip } from "antd";
import { Table } from "components/Table";
import { numberFormatter, priceFormatter } from "utils/priceFormatter";
import { Spinner } from "components/Spinner";
import styles from './RetoolCharts.module.scss';
import { feasibilityTransformerAllScenarios } from "utils/feasibilityTransformerAllScenarios/feasibilityTransformerAllScenarios";
import { projectReportAPI } from "services/ProjectReportService";
import { ProjectSummaryReport } from "models/ProjectSummaryReport";
import { Tab } from "components/Tab";
import { Error } from "components/Error";
import { TableHeader } from "components/TableHeader";
import { CSVButton } from "components/CSVButton";
import { CSVLink } from "react-csv";

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

export const ROITable: React.FC<Props> = ({ areaId, scenarioIds = [], projectIds = [], variables }) => {
    const { skipParam, setSkipParam } = useSkipParam(areaId, scenarioIds);
    const [urlParams, setUrlParams] = useState<string>('');
    const [cvs, setCVSData] = useState<any[]>();
    const [cvsProjects, setCVSProjectsData] = useState<any[]>();

    const { data: scenariosData = [], error: scenariosDataError, isFetching: isScenariosDataLoading } = scenarioReportAPI.useGetScenarioReportQuery();
    const { data: projectsData = [], error: projectsDataError, isFetching: isprojectsDataLoading } = projectReportAPI.useGetProjectReportQuery();

    useEffect(() => {
        const obj: { area_id?: number, scenario_ids: number[], aggregate_projects: boolean } = { area_id: areaId, scenario_ids: [], aggregate_projects: false };

        if (areaId) {
            obj.area_id = areaId;
            const arr = scenariosData.filter((el) => el.area_id === areaId);
            obj.scenario_ids = arr.map((el) => el.id);
        }
        obj.aggregate_projects = false;

        if (areaId === 11) {
            delete obj.area_id;
        }
        setUrlParams(urlFormat(obj));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaId, projectIds, isScenariosDataLoading]);

    useEffect(() => {
        if (!areaId || scenarioIds.filter((el) => el).length === 0) {
            setSkipParam(true);
        }
    }, [areaId, scenarioIds, projectIds]);



    const { data: projectSummary = [], isFetching: projectSummaryLoading, error: projectSummaryError } = projectSummaryReportAPI.useGetProjectReportQuery({ params: urlParams }, {
        skip: skipParam
    });

    const isLoadingState = projectSummaryLoading || isprojectsDataLoading || isScenariosDataLoading;
    const isErrorState = projectSummaryError || projectsDataError || scenariosDataError;


    const fixedData = projectSummary.map((el: ProjectSummaryReport) => {
        const scenario_name1 = projectsData.find((item) => item.id === el.project_id)?.scenario_id;
        const scenario_name = scenariosData.find((item) => item.id === scenario_name1)?.label;

        return {
            scenario_name,
            ...el
        }
    });

    const projectData = feasibilityTransformerAllScenarios(fixedData, scenariosData, variables).project_level;
    const selectedProjectData = projectData.filter((el: { project_id: number; }) => {
        const d1 = projectsData.find((item) => item.id === el.project_id)?.scenario_id;

        if (scenarioIds[0] === d1) {
            return el
        }

    })

    useEffect(() => {
        const scenarioReportCVS = projectData?.map((el: { project_name: any; scenario_name: any; roi_at_pen_rate_years: any; uprn_count: any; prems_connected: any; total_capex1: any; total_capex: any; avg_cppp: any; total_opex_per_annum: any; voucher_subsidy: any; revenue_d30_r80: any; gross_profit_pa: any; gross_profit_over_year_period: any; }) => {
            return [el.project_name, el.scenario_name, el.roi_at_pen_rate_years, el.uprn_count, el.prems_connected, el.total_capex1, el.total_capex, el.avg_cppp, el.total_opex_per_annum, el.voucher_subsidy, el.revenue_d30_r80, el.gross_profit_pa, el.gross_profit_over_year_period]
        }) || [];

        const csvData = [
            ["Te Name", "Scenario Name", "ROI Years @ Pen. Rate", "Uprn Count", "Prems connected", "Total capex", "Total build capex", "Avg cppp", "Total opex per annum", "Voucher subsidy", "Revenue D30 R80", "GP in 1Y", "GP Over 6Y Period"],
            ...scenarioReportCVS
        ];

        setCVSData(csvData);
    }, [isLoadingState]);

    useEffect(() => {
        const scenarioReportCVS = selectedProjectData?.map((el: { project_name: any; scenario_name: any; roi_at_pen_rate_years: any; uprn_count: any; prems_connected: any; total_capex1: any; total_capex: any; avg_cppp: any; total_opex_per_annum: any; voucher_subsidy: any; revenue_d30_r80: any; gross_profit_pa: any; gross_profit_over_year_period: any; }) => {
            return [el.project_name, el.scenario_name, el.roi_at_pen_rate_years, el.uprn_count, el.prems_connected, el.total_capex1, el.total_capex, el.avg_cppp, el.total_opex_per_annum, el.voucher_subsidy, el.revenue_d30_r80, el.gross_profit_pa, el.gross_profit_over_year_period]
        }) || [];
        // console.log('scenarioReportCVS', scenarioReportCVS)

        const csvData = [
            ["Te Name", "Scenario Name", "ROI Years @ Pen. Rate", "Uprn Count", "Prems connected", "Total capex", "Total build capex", "Avg cppp", "Total opex per annum", "Voucher subsidy", "Revenue D30 R80", "GP in 1Y", "GP Over 6Y Period"],
            ...scenarioReportCVS
        ];

        setCVSProjectsData(csvData);
    }, [isLoadingState]);


    if (isErrorState) {
        return <Error />
    }
    const config = [
        {
            label: "Te Name",
            render: (data: { project_name: string }) => <Tooltip title={data.project_name} placement="topLeft">{data.project_name?.split('_').map((el: string) => el[0]?.toUpperCase() + el?.slice(1))?.join(' ')}</Tooltip>,
            sortValue: (data: { project_name: string }) => data.project_name,
        },
        {
            label: "Scenario Name",
            render: (data: { scenario_name: string }) => <Tooltip title={data.scenario_name} placement="topLeft">{data.scenario_name}</Tooltip>,
            sortValue: (data: { scenario_name: string }) => data.scenario_name,
        },
        {
            label: "ROI Years @ Pen. Rate",
            render: (data: { roi_at_pen_rate_years: number }) => data.roi_at_pen_rate_years.toFixed(3),
            sortValue: (data: { roi_at_pen_rate_years: number }) => data.roi_at_pen_rate_years,
        },
        {
            label: "Uprn Count",
            render: (data: { uprn_count: number }) => numberFormatter(data.uprn_count),
            sortValue: (data: { uprn_count: number }) => data.uprn_count,
        },
        {
            label: "Prems connected",
            render: (data: { prems_connected: number }) => data.prems_connected.toFixed(3),
            sortValue: (data: { prems_connected: number }) => data.prems_connected,
        },
        {
            label: "Total capex",
            render: (data: { total_capex1: number }) => `£${priceFormatter(data.total_capex1)}`,
            sortValue: (data: { total_capex1: number }) => data.total_capex1,
        },
        {
            label: "Total build capex",
            render: (data: { total_capex: number }) => `£${priceFormatter(data.total_capex)}`,
            sortValue: (data: { total_capex: number }) => data.total_capex,
        },
        {
            label: "Total leadin capex",
            render: (data: { total_leadin_capex: number }) => `£${priceFormatter(data.total_leadin_capex)}`,
            sortValue: (data: { total_leadin_capex: number }) => data.total_leadin_capex,
        },
        {
            label: "Avg cppp",
            render: (data: { avg_cppp: number }) => `£${priceFormatter(data.avg_cppp)}`,
            sortValue: (data: { avg_cppp: number }) => data.avg_cppp,
        },
        {
            label: "Total opex per annum",
            render: (data: { total_opex_per_annum: number }) => `£${priceFormatter(data.total_opex_per_annum)}`,
            sortValue: (data: { total_opex_per_annum: number }) => data.total_opex_per_annum,
        },
        {
            label: "Voucher subsidy",
            render: (data: { voucher_subsidy: number }) => `£${priceFormatter(data.voucher_subsidy)}`,
            sortValue: (data: { voucher_subsidy: number }) => data.voucher_subsidy,
        },
        {
            label: "Revenue D30 R80",
            render: (data: { revenue_d30_r80: number }) => `£${priceFormatter(data.revenue_d30_r80)}`,
            sortValue: (data: { revenue_d30_r80: number }) => data.revenue_d30_r80,
        },
        {
            label: "GP in 1Y",
            render: (data: { gross_profit_pa: number }) => `£${priceFormatter(data.gross_profit_pa)}`,
            sortValue: (data: { gross_profit_pa: number }) => data.gross_profit_pa,
        },
        {
            label: "GP Over 6Y Period",
            render: (data: { gross_profit_over_year_period: number }) => `£${priceFormatter(data.gross_profit_over_year_period)}`,
            sortValue: (data: { gross_profit_over_year_period: number }) => data.gross_profit_over_year_period,
        },
    ];

    const tabConfig = [
        {
            label: 'All Scenarios',
            key: 'All_Scenario',
            children:
                <>
                    <TableHeader>
                        <CSVButton
                            data={[]}
                            preparedData={cvs}
                            filename={'roi.csv'}
                        />
                    </TableHeader>
                    <Table
                        round
                        stickyColumn
                        config={config}
                        data={projectData.sort((a: { roi_at_pen_rate_years: number; }, b: { roi_at_pen_rate_years: number; }) => a.roi_at_pen_rate_years - b.roi_at_pen_rate_years)}
                        pageSize={10}
                        isClickable={false} />
                </>
        },
        {
            label: 'Selected Scenarios',
            key: 'Selected_Scenario',
            children:
                <>
                    <TableHeader>
                        <CSVButton
                            data={[]}
                            preparedData={cvsProjects}
                            filename={'roi.csv'}
                        />
                    </TableHeader>
                    <Table
                        round
                        stickyColumn
                        config={config}
                        data={selectedProjectData.sort((a: { roi_at_pen_rate_years: number; }, b: { roi_at_pen_rate_years: number; }) => a.roi_at_pen_rate_years - b.roi_at_pen_rate_years)}
                        pageSize={10}
                        isClickable={false} />
                </>
        },
    ]

    return <>
        <div className={styles.chartSection} style={{ marginTop: '60px' }}>
            <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>Best Project for Each Area by ROI</h2>
            </div>
            <div className={styles.chartBody}>
                {isLoadingState && <Spinner className={styles.customSpinner} />}
                {!isLoadingState &&

                    <div className={styles.scrolledContent}>
                        <Tab isScrolled config={tabConfig} defaultValue={'All_Scenario'} />

                    </div>
                }
            </div>
        </div>
    </>
}