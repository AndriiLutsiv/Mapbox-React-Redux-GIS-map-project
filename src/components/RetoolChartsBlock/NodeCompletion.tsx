import { InputNumber, Tag } from "antd";
import { Spinner } from "components/Spinner";
import { Table } from "components/Table";
import { useSkipParam } from "hooks/useSkipParam";
import React, { useEffect, useState } from "react";
import { nodeCompletionAPI } from "services/NodeCompletionService";
import { urlFormat } from "utils/urlFormat";
import styles from './RetoolCharts.module.scss';
import { SelectTemplate } from "components/DashboardToolbar/Select/SelectTemplate";
import { projectReportAPI } from "services/ProjectReportService";
import { scenarioReportAPI } from "services/ScenarioReportService";
import { NodeCompletion as NodeCompletionType } from "models/NodeCompletion";
import { Chart } from "components/Chart";
import classNames from "classnames";
import { resolvePromisesSeq } from "utils/resolvePromisesSeq";
import { Tab } from "components/Tab";
import { Error } from "components/Error";
import { CSVButton } from "components/CSVButton";
import { TableHeader } from "components/TableHeader";
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

export const NodeCompletion: React.FC<Props> = ({ areaId, scenarioIds = [], projectIds = [], comparisonData = [] }) => {
    const { token } = useAuth();
    const dispatch = useAppDispatch();

    const [urlParams, setUrlParams] = useState<string>('');
    const { skipParam, setSkipParam } = useSkipParam(areaId, scenarioIds);
    const [selectedData, setSelectedData] = useState<number | []>([]);
    const [day, setDay] = useState<number>(1);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const [nodeCompletionComparison, setNodeCompletionComparison] = useState<any>([]);

    useEffect(() => {
        const obj: { area_id?: number, scenario_ids?: number[], project_ids: number[] } = { scenario_ids: [], project_ids: [] };


        if (scenarioIds.length) {
            delete obj.area_id;
            obj.scenario_ids = scenarioIds;
        }


        if (areaId === 11) {
            delete obj.area_id;
        }

        setUrlParams(urlFormat(obj));
    }, [areaId, scenarioIds, projectIds]);

    useEffect(() => {
        if (!areaId || scenarioIds.filter((el) => el).length === 0) {
            setSkipParam(true);
        }
    }, [areaId, scenarioIds, projectIds]);

    const { data: nodeCompletionData = [], error: nodeCompletionDataError, isFetching: isNodeCompletionDataFetching } = nodeCompletionAPI.useGetNodeCompletionQuery({ params: urlParams }, {
        skip: skipParam
    });
    const { data: scenarioReportData = [], isLoading: scenarioReportLoading, error: scenarioError } = scenarioReportAPI.useGetScenarioReportQuery();
    const { data: projectReportData = [], isLoading: projectReportLoading, error: projectReportError } = projectReportAPI.useGetProjectReportQuery();

    useEffect(() => {
        if (comparisonData.length) {
            setIsLoading(true);
            setError(false);

            const filterUrl = comparisonData.filter((el) => el.projects.length);
            if (!filterUrl.length) {
                setIsLoading(false);
                setNodeCompletionComparison([]);
                return;
            }

            const mapArr = filterUrl.map((scenario) => {
                const urlParameters = urlFormat({ project_ids: scenario.projects.map((el) => el.value) });

                return fetch(`https://reports.fibreplanner.io/api/v1/job-sequencing/node-completion?${urlParameters}`, {
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

                    setNodeCompletionComparison(users);
                } catch {
                    setError(true);
                } finally {
                    setIsLoading(false);
                }
            })();

        } else {
            setNodeCompletionComparison([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comparisonData]);

    const isLoadingState = scenarioReportLoading || isNodeCompletionDataFetching || projectReportLoading || isLoading;
    const isErrorState = scenarioError || nodeCompletionDataError || projectReportError || error;


    const dataCalculation = (data: NodeCompletionType[], day: number, selectedData: number) => {
        const groupBy = (items: any[], key: string | number) =>
            items.reduce(
                (result, item) => ({
                    ...result,
                    [item[key]]: [...(result[item[key]] || []), item],
                }),
                {}
            );
        const sumBy = (items: any, key: string | number) => items.reduce((a: any, b: any) => a + (b[key] || 0), 0);

        // Reference external variables with curly brackets or using JS variables
        // const data = formatDataAsArray({{ nodeDayCreation.data }});
        const project = selectedData;
        const dayGroupIndex = day;
        // return data.filter(v => v.project == project);

        const projectData = data.filter(v => v.project_id === project);
        const projectDataIdx = projectData.map(v => {
            const day = (v.complete_day).toPrecision(15);
            const day2 = (dayGroupIndex).toPrecision(15);
            const result = parseFloat(day);
            const result2 = parseFloat(day2);
            const r = result / result2;

            return {
                day_group: Math.floor(r),
                ...v
            }
        });

        const groupedDayIdx: { [key: string]: NodeCompletionType[] } = groupBy(projectDataIdx, "day_group");
        let returnData = [];

        for (const [day_group, values] of Object.entries(groupedDayIdx)) {
            const dn_node_ids_raw = values.map(v => v.dn_node_ids).filter(v => !!v);
            const dn_node_ids = dn_node_ids_raw.length === 0 ? null : dn_node_ids_raw.flat();
            const zn_node_ids_raw = values.map(v => v.zn_node_ids).filter(v => !!v);
            const zn_node_ids = zn_node_ids_raw.length === 0 ? null : zn_node_ids_raw.flat();
            const an_node_ids_raw = values.map(v => v.an_node_ids).filter(v => !!v);
            const an_node_ids = an_node_ids_raw.length === 0 ? null : an_node_ids_raw.flat();
            const lastValue = values[values.length - 1];

            returnData.push({
                complete_day: lastValue.complete_day + 1,
                project: values[0].project,
                dn_nodes_completed: sumBy(values, "dn_nodes_completed"),
                dn_node_ids: dn_node_ids,
                dn_node_completed_cumsum: lastValue.dn_node_completed_cumsum,
                zn_nodes_completed: sumBy(values, "zn_nodes_completed"),
                zn_node_ids: zn_node_ids,
                zn_node_completed_cumsum: lastValue.zn_node_completed_cumsum,
                an_nodes_completed: sumBy(values, "an_nodes_completed"),
                an_node_ids: an_node_ids,
                an_node_completed_cumsum: lastValue.an_node_completed_cumsum,
                total_rfs: lastValue.total_rfs,
                live_customers: lastValue.live_customers,
            })
        };

        return returnData;
    }

    const compariosnDataCalculation = nodeCompletionComparison.map((el: any) => {
        return {
            ...el,
            response: dataCalculation(el.response, day, el.project.value),
        }
    })

    const chartData: {
        id: string,
        response: any,
        scenario: { value: number, label: string },
        project: { value: number, label: string },
    }[] = [
            {
                id: `${areaId}-${scenarioIds}-${projectIds.join('')}`,
                scenario: {
                    value: scenarioReportData.find((el) => el.id === scenarioIds[0])?.id || -1,
                    label: scenarioReportData.find((el) => el.id === scenarioIds[0])?.label || ''
                },
                project: {
                    value: projectReportData.find((el) => el.id === selectedData)?.id || -1,
                    label: projectReportData.find((el) => el.id === selectedData)?.project || ''
                },
                response: dataCalculation(nodeCompletionData, day, selectedData as number),
            },
            ...compariosnDataCalculation
        ];

    // CHART CONFIG

    const data = chartData.map((el) => {
        return {
            ...el,
            day: el.response.map((el: { complete_day: any; }) => el.complete_day),
            anNodeCount: el.response.map((el: { an_node_completed_cumsum: any; }) => el.an_node_completed_cumsum),
            znNodeCount: el.response.map((el: { zn_node_completed_cumsum: any; }) => el.zn_node_completed_cumsum),
            dnNodeCount: el.response.map((el: { dn_node_completed_cumsum: any; }) => el.dn_node_completed_cumsum),
            rfs: el.response.map((el: { total_rfs: any; }) => el.total_rfs)
        }
    });

    const anNodeCountPlot = data.map((el) => {
        return {
            x: el.day,
            y: el.anNodeCount,
            name: `${el.project.label} - Total AN Nodes`,
            type: "line",
            hovertemplate: "%{fullData.name}: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.anNodeCount,
                    order: "ascending"
                }
            ],
            mode: "lines+markers",
        }
    });
    const znNodeCountPlot = data.map((el) => {
        return {
            x: el.day,
            y: el.znNodeCount,
            name: `${el.project.label} - Total ZN Nodes`,
            type: "line",
            hovertemplate: "%{fullData.name}: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.znNodeCount,
                    order: "ascending"
                }
            ],
            mode: "lines+markers",
        }
    });
    const dnNodeCountPlot = data.map((el) => {
        return {
            x: el.day,
            y: el.dnNodeCount,
            name: `${el.project.label} - Total DN Nodes`,
            type: "line",
            hovertemplate: "%{fullData.name}: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.dnNodeCount,
                    order: "ascending"
                }
            ],
            mode: "lines+markers",
        }
    });
    const rfsCountPlot = data.map((el) => {
        return {
            x: el.day,
            y: el.rfs,
            name: `${el.project.label} - Total RFS`,
            yaxis: 'y2',
            type: "line",
            hovertemplate: "%{fullData.name}: %{y}<extra></extra>",
            transforms: [
                {
                    type: "sort",
                    target: el.rfs,
                    order: "ascending"
                }
            ],
            mode: "lines+markers",
        }
    });

    const plotData = [...anNodeCountPlot, ...znNodeCountPlot, ...dnNodeCountPlot, ...rfsCountPlot]

    const [nodesCVS, setNodesCVS] = useState<any>();

    // useEffect(() => {
    //     //
    //     const headers_valueByAssetTable = tableConfig.map((el) => el.label);

    //     const data_valueByAssetTable = chartData.map((el, i) => {
    //         const arr: any[] = [];
    //         for (let i = 0; i < tableConfig.length; i++) {
    //             arr.push(tableConfig[i].sortValue(el.response))
    //         }
    //         console.log('el.response', el.response.map((item)))

    //         return arr;
    //     });

    //     const cvs_valueByAssetTable = [
    //         headers_valueByAssetTable,
    //         ...data_valueByAssetTable
    //     ];

    //     setNodesCVS(cvs_valueByAssetTable);


    // }, [isLoadingState]);
    // TABLE CONFIG
    const tableConfig = [
        {
            label: "Working Days",
            render: (data: { complete_day: any; }) => data.complete_day + 1,
            sortValue: (data: { complete_day: any; }) => data.complete_day + 1,
        },
        {
            label: "DN Nodes Delta",
            render: (data: { dn_node_ids: any; }) => Array.isArray(data.dn_node_ids) ? data.dn_node_ids.length : 0,
            sortValue: (data: { dn_node_ids: any; }) => Array.isArray(data.dn_node_ids) ? data.dn_node_ids.length : 0,
        },
        {
            label: "DN Node Ids",
            render: (data: { dn_node_ids: any; }) => Array.isArray(data.dn_node_ids) && data.dn_node_ids.map((el: string) => <Tag color="magenta">{el}</Tag>),
            sortValue: (data: { dn_node_ids: any; }) => Array.isArray(data.dn_node_ids) && data.dn_node_ids.length,
        },
        {
            label: "Total DN Nodes",
            render: (data: { dn_node_completed_cumsum: any; }) => data.dn_node_completed_cumsum,
            sortValue: (data: { dn_node_completed_cumsum: any; }) => data.dn_node_completed_cumsum,
        },
        {
            label: "ZN Nodes Delta",
            render: (data: { zn_node_ids: any; }) => Array.isArray(data.zn_node_ids) ? data.zn_node_ids.length : 0,
            sortValue: (data: { zn_node_ids: any; }) => Array.isArray(data.zn_node_ids) ? data.zn_node_ids.length : 0,
        },
        {
            label: "ZN Nodes IDs",
            render: (data: { zn_node_ids: any; }) => data.zn_node_ids && data.zn_node_ids.map((el: string) => <Tag color="magenta">{el}</Tag>),
            sortValue: (data: { zn_node_ids: any; }) => data.zn_node_ids?.length,
        },
        {
            label: "Total ZN Nodes",
            render: (data: { zn_node_completed_cumsum: any; }) => data.zn_node_completed_cumsum,
            sortValue: (data: { zn_node_completed_cumsum: any; }) => data.zn_node_completed_cumsum,
        },
        {
            label: "AN Nodes Delta",
            render: (data: { an_node_ids: any; }) => Array.isArray(data.an_node_ids) ? data.an_node_ids.length : 0,
            sortValue: (data: { an_node_ids: any; }) => Array.isArray(data.an_node_ids) ? data.an_node_ids.length : 0,
        },
        {
            label: "AN Node IDs",
            render: (data: { an_node_ids: any; }) => data.an_node_ids && data.an_node_ids.map((el: string) => <Tag color="magenta">{el}</Tag>),
            sortValue: (data: { an_node_ids: any; }) => data.an_node_ids?.length,
        },
        {
            label: "Total AN Nodes",
            render: (data: { an_node_completed_cumsum: any; }) => data.an_node_completed_cumsum,
            sortValue: (data: { an_node_completed_cumsum: any; }) => data.an_node_completed_cumsum,
        },
        {
            label: "Total RFS",
            render: (data: { total_rfs: any; }) => data.total_rfs,
            sortValue: (data: { total_rfs: any; }) => data.total_rfs,
        },
        {
            label: "Live customers",
            render: (data: { live_customers: any; }) => Math.round(data.live_customers),
            sortValue: (data: { live_customers: any; }) => Math.round(data.live_customers),
        },
    ];

    // Select config
    const array = projectReportData.filter((el) => el.scenario_id === scenarioIds[0]).map((el) => {
        return {
            value: el.id,
            label: el.project
        }
    });


    useEffect(() => {
        if(array.length) {
            setSelectedData(array[0].value)
        }
    }, [isLoadingState])


    const tabConfig = chartData.map((el, i) => {
        return {
            label: el.project.label,
            key: i + '',
            children:
                <>
                    <Table
                        round
                        isSlim
                        stickyColumn
                        config={tableConfig}
                        data={el.response}
                        pageSize={10}
                        isClickable={false} />
                </>
        }
    });


    if (isErrorState) {
        return <Error />
    }
    return <div>
        <div className={classNames(styles.sliderBlock, styles.variableBlock)}>
            <p className={styles.sliderBlockTitle}>Select project: </p>
            <div className={classNames(styles.inputWrapper, styles.inputWrapperTransparent)}>
                <SelectTemplate
                    data={array}
                    value={selectedData}
                    onChange={setSelectedData}
                    width="600px"
                />
            </div>
        </div>
        <div className={classNames(styles.sliderBlock, styles.variableBlock)}>
            <p className={styles.sliderBlockTitle}>Average Voucher Value</p>
            <div className={styles.inputWrapper}>
                <InputNumber
                    defaultValue={day}
                    step={1}
                    min={1}
                    onChange={(value: number | null) => setDay(value ? value : 0)} />
            </div>

        </div>

        {isLoadingState && <Spinner className={styles.customSpinner} />}
        {!isLoadingState && <>
            <div style={{ position: 'relative' }}>
                <div className={styles.download}>
                    <CSVButton
                        data={chartData}
                        filename={'CPPP.csv'}
                        arrOfProps={['complete_day', 'an_node_completed_cumsum', 'zn_node_completed_cumsum', 'dn_node_completed_cumsum', 'total_rfs']}
                    />
                </div>
                <Chart plotData={!isNodeCompletionDataFetching && plotData}
                    y={'ROI in Years'}
                    x={'UPRN Count'}
                    title={`ROI vs Revenue P/A`}
                    layout={{
                        yaxis2: {
                            title: 'RFS',
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
                />
                {chartData[0].response.length &&
                    <Tab config={tabConfig} defaultValue="0" isScrolled />
                }
            </div>

        </>
        }
    </div>
}