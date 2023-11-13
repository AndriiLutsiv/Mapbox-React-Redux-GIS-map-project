import { Chart } from "components/Chart";
import { SelectTemplate } from "components/DashboardToolbar/Select/SelectTemplate";
import { useSkipParam } from "hooks/useSkipParam";
import { PruneResult } from "models/ProjectPruning";
import React, { useEffect, useState } from "react";
import { pruningAPI } from "services/ProjectPruningService";
import { projectSummaryReportAPI } from "services/ProjectSummaryReportService";
import { scenarioReportAPI } from "services/ScenarioReportService";
import { pruningPlotData } from "utils/pruningPlotData/pruningPlotData";
import { urlFormat } from "utils/urlFormat";
import styles from './RetoolCharts.module.scss';
import { Spinner } from "components/Spinner";
import { resolvePromisesSeq } from "utils/resolvePromisesSeq";
import { Error } from "components/Error";
import { CSVButton } from "components/CSVButton";
import { useAuth } from "hooks/useAuth";
import { useAppDispatch } from "hooks/redux";
import { clearToken } from "store/reducers/tokenSlice";

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
}

export const Pruning: React.FC<Props> = ({ areaId, scenarioIds = [], projectIds = [], comparisonData = [] }) => {
    const { skipParam, setSkipParam } = useSkipParam(areaId, scenarioIds);
    const { token } = useAuth();
    const dispatch = useAppDispatch();

    const [urlParams, setUrlParams] = useState<string>('');

    const [selectedData, setSelectedData] = useState<number | []>([]);

    useEffect(() => {
        const obj: { area_id?: number, scenario_ids?: number[], project_ids: number[], aggregate_projects: boolean } = { scenario_ids: [], project_ids: [], aggregate_projects: false };

        if (scenarioIds.length) {
            obj.scenario_ids = scenarioIds
        }

        if (areaId === 11) {
            delete obj.area_id;
        }

        obj.aggregate_projects = false;

        setUrlParams(urlFormat(obj));
    }, [areaId, scenarioIds, projectIds, selectedData]);

    useEffect(() => {
        if (!areaId || scenarioIds.filter((el) => el).length === 0) {
            setSkipParam(true);
            setSelectedData([]);
        }

    }, [areaId, scenarioIds, projectIds]);

    const { data: pruningData = [], isFetching: pruningDataLoading, error: pruningDataError } = pruningAPI.useGetPruningQuery({ params: urlParams }, {
        skip: skipParam
    });

    const { data: scenarioReportData = [], isFetching: scenarioReportLoading, error: scenarioError } = scenarioReportAPI.useGetScenarioReportQuery();
    const { data: projectSummary = [], isFetching: projectSummaryLoading, error: projectSummaryError } = projectSummaryReportAPI.useGetProjectReportQuery({ params: urlParams }, {
        skip: skipParam
    });

    const [comparisonReport, setComparisonReport] = useState<any>([]);

    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (comparisonData.length) {
            setIsLoading(true);
            setError(false);

            const filterUrl = comparisonData.filter((el) => el.projects.length);
            if (!filterUrl.length) {
                setIsLoading(false);
                setComparisonReport([]);
                return;
            }

            const mapArr = filterUrl.map((scenario) => {
                const urlParameters = urlFormat({ project_ids: scenario.projects[0].value, aggregate_projects: false });

                return fetch(`https://reports.fibreplanner.io/api/v1/prune-results?${urlParameters}`, {
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

    const isLoadingState = scenarioReportLoading || pruningDataLoading || projectSummaryLoading || isLoading;
    const isErrorState = scenarioError || pruningDataError || projectSummaryError || error;


    const array: { label: string, value: number }[] = [];

    for (let project of projectSummary) {
        const find = array.find((el) => {
            return el.label === project.project_name
        });

        if (!find && project.project_name) {
            array.push({
                label: project.project_name,
                value: project.project_id || -1
            })
        }
    }

    useEffect(() => {
        if(array.length) {
            setSelectedData(array[0].value)
        }
    }, [isLoadingState])

    if (isErrorState) {
        return <Error />
    }

    const selectedPrineData = pruningData.filter((el) => el.project_id === selectedData);

    const chartData: {
        id: string,
        response: PruneResult[],
        scenario: { value: number, label: string } | null,
        project: { value: number, label: string } | null,
    }[] = [
            {
                id: `${areaId}-${scenarioIds}-${projectIds.join('')}`,
                scenario: {
                    value: scenarioReportData.find((el) => el.id === scenarioIds[0])?.id,
                    label: scenarioReportData.find((el) => el.id === scenarioIds[0])?.label
                },
                project: {
                    value: projectSummary.find((el) => el.project_id === selectedData)?.project_id,
                    label: projectSummary.find((el) => el.project_id === selectedData)?.project
                },
                response: selectedPrineData,
            },
            ...comparisonReport
        ];

    const chartDataConfigured = chartData.map((el) => {
        return {
            ...el,
            response: pruningPlotData(el.response).data,
            line: pruningPlotData(el.response).uprnRoiRevMaxValue

        }
    });
    const data = chartDataConfigured.map((el) => {
        return {
            ...el,
            roi: el.response.map((item) => item.roi),
            uprn_count: el.response.map((item) => item.uprn_count),
            revenue: el.response.map((item) => item.revenue),
            total_capex: el.response.map((item) => item.total_capex),
            total_opex: el.response.map((item) => item.total_opex),
            cppp: el.response.map((item) => item.cppp)
        }
    });

    const shapes: {
        type: "path" | "line" | "rect" | "circle" | undefined;
        x0?: number,
        y0?: number,
        x1?: number,
        y1?: number,
        xref?: any,
        yref?: any,
        line: {
            color: string,
            width?: number
        }
    }[] = data.map((el) => {
        return {
            type: 'line',
            x0: el.line ? el.line : 0,
            x1: el.line ? el.line : 0,
            xref: "x",
            y0: 0,
            y1: 1,
            yref: "y domain",
            line: {
                color: 'rgb(0, 182, 0)',
                width: 2,
            }
        }
    })

    const roiPlot = data.map((el) => {
        return {
            x: el.uprn_count,
            y: el.roi,
            name: `${el.project?.label} - roi_norm`,
            type: "line",
            transforms: [
                {
                    type: "sort",
                    target: el.uprn_count,
                    order: "ascending"
                }
            ],
            mode: "lines+markers",
        }
    });
    const revenuePlot = data.map((el) => {
        return {
            x: el.uprn_count,
            y: el.revenue,
            name: `${el.project?.label} - revenue_pa`,
            yaxis: 'y2',
            type: "line",
            transforms: [
                {
                    type: "sort",
                    target: el.uprn_count,
                    order: "ascending"
                }
            ],
            mode: "lines+markers",
        }
    });

    const plotDataROI = [...roiPlot, ...revenuePlot];


    const total_capexPlot = data.map((el) => {
        return {
            x: el.uprn_count,
            y: el.total_capex,
            name: `${el.project?.label} - roi_norm`,
            type: "line",
            transforms: [
                {
                    type: "sort",
                    target: el.uprn_count,
                    order: "ascending"
                }
            ],
            mode: "lines+markers",
        }
    });
    const total_opexPlot = data.map((el) => {
        return {
            x: el.uprn_count,
            y: el.total_opex,
            name: `${el.project?.label} - revenue_pa`,
            yaxis: 'y2',
            type: "line",
            transforms: [
                {
                    type: "sort",
                    target: el.uprn_count,
                    order: "ascending"
                }
            ],
            mode: "lines+markers",
        }
    });

    const plotDataCapexOpex = [...total_capexPlot, ...total_opexPlot];

    const cpppPlot = data.map((el) => {
        return {
            x: el.uprn_count,
            y: el.cppp,
            name: `${el.project?.label} - cppp`,
            type: "line",
            transforms: [
                {
                    type: "sort",
                    target: el.uprn_count,
                    order: "ascending"
                }
            ],
            mode: "lines+markers",
        }
    });

    return <>
        <div className={styles.chartBody}>
            <div style={{ minHeight: '500px' }}>
                {isLoadingState && <Spinner className={styles.customSpinner} />}
                {!isLoadingState && <>
                    <SelectTemplate
                            data={array}
                            value={selectedData}
                            onChange={setSelectedData}
                            label="Select project:"
                        />

                    <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={chartDataConfigured}
                                filename={'ROI_revenue_pa.csv'}
                                arrOfProps={['uprn_count', 'roi', 'revenue']}
                            />
                        </div>
                        <Chart plotData={plotDataROI}
                            y={'ROI in Years'}
                            x={'UPRN Count'}
                            title={`ROI vs Revenue P/A`}
                            layout={{
                                yaxis2: {
                                    title: 'Revenue P/A',
                                    overlaying: 'y',
                                    side: 'right',
                                    showline: false,
                                    linecolor: '#424242',
                                    linewidth: 1,
                                    showgrid: true,
                                    gridwidth: 1,
                                    family: 'Inter, sans-serif',
                                    size: 12,
                                    color: '#E5E5E5',
                                    gridcolor: '#424242',
                                    zerolinecolor: "#424242",
                                    titlefont: {

                                        family: 'Inter, sans-serif',
                                        size: 12,
                                        color: '#E5E5E5',
                                    }
                                },
                                "hovermode": "x unified",
                                "hoverlabel": {
                                    "bgcolor": "#000",
                                    "bordercolor": "#000",
                                    "font": {
                                        "color": "#fff",
                                        "family": "var(--default-font, var(--sans-serif))",
                                        "size": 13
                                    }
                                },
                                "clickmode": "select+event",
                                "dragmode": "select",
                            }}
                            shapes={shapes} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={chartDataConfigured}
                                filename={'CAPEX_OPEX.csv'}
                                arrOfProps={['uprn_count', 'total_capex', 'total_opex']}
                            />
                        </div>
                        <Chart plotData={plotDataCapexOpex}
                            y={'Total CAPEX'}
                            x={'UPRN Count'}
                            title={`CAPEX vs OPEX`}
                            layout={{
                                yaxis2: {
                                    title: 'Total OPEX',
                                    overlaying: 'y',
                                    side: 'right',
                                    showline: false,
                                    linecolor: '#424242',
                                    linewidth: 1,
                                    showgrid: true,
                                    gridcolor: '#424242',
                                    gridwidth: 1,
                                    family: 'Inter, sans-serif',
                                    size: 12,
                                    color: '#E5E5E5',
                                    zerolinecolor: "#424242",
                                    titlefont: {

                                        family: 'Inter, sans-serif',
                                        size: 12,
                                        color: '#E5E5E5',
                                    }
                                },

                                "hovermode": "x unified",
                                "hoverlabel": {
                                    "bgcolor": "#000",
                                    "bordercolor": "#000",
                                    "font": {
                                        "color": "#fff",
                                        "family": "var(--default-font, var(--sans-serif))",
                                        "size": 13
                                    }
                                },
                                "clickmode": "select+event",
                                "dragmode": "select",

                            }}
                            shapes={shapes} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={chartDataConfigured}
                                filename={'CPPP.csv'}
                                arrOfProps={['uprn_count', 'cppp']}
                            />
                        </div>
                        <Chart plotData={cpppPlot}
                            y={'CPPP'}
                            x={'UPRN Count'}
                            title={`CPPP`}
                            layout={
                                {
                                    "hovermode": "x unified",
                                    "hoverlabel": {
                                        "bgcolor": "#000",
                                        "bordercolor": "#000",
                                        "font": {
                                            "color": "#fff",
                                            "family": "var(--default-font, var(--sans-serif))",
                                            "size": 13
                                        }
                                    },
                                    "clickmode": "select+event",
                                    "dragmode": "select",
                                }
                            }
                            shapes={shapes}
                        />
                    </div>
                </>
                }
            </div>
        </div>
    </>
}
