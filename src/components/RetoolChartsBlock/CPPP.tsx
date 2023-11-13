import { Error } from "components/Error";
import { useEffect, useState } from "react";
import { scenarioReportAPI } from "services/ScenarioReportService";
import { resolvePromisesSeq } from "utils/resolvePromisesSeq";
import styles from "./RetoolCharts.module.scss";
import { Tab } from "components/Tab";
import { Chart } from "components/Chart";
import { useSkipParam } from "hooks/useSkipParam";
import { urlFormat } from "utils/urlFormat";
import { projectSummaryReportAPI } from "services/ProjectSummaryReportService";
import { SelectTemplate } from "components/DashboardToolbar/Select/SelectTemplate";
import { getPlotsConfig } from "utils/getPlotsConfig/getPlotsConfig";
import { ProjectLevelData, ScenarioLevelData, feasibilityTransformerAllScenarios } from "utils/feasibilityTransformerAllScenarios/feasibilityTransformerAllScenarios";
import { Spinner } from "components/Spinner";
import { broadbandAPI } from "services/BroadbandService";
import { Broadbands } from "models/Broadbands";
import { propertiesAPI } from "services/PropertiesService";
import { projectReportAPI } from "services/ProjectReportService";
import classNames from "classnames";
import { Properties } from "models/Properties";
import { CSVButton } from "components/CSVButton";
import { useAuth } from "hooks/useAuth";
import { clearToken } from "store/reducers/tokenSlice";
import { useAppDispatch } from "hooks/redux";

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
    vouchers_in_rural: number,
}

export const CPPP: React.FC<Props> = ({ areaId, scenarioIds = [], projectIds = [], comparisonData = [], variables }) => {
    const { token } = useAuth();
    const dispatch = useAppDispatch();

    const [scenarioReport, setScenarioReport] = useState<Data[]>([]);
    const [error, setError] = useState<boolean>(false);
    //broadbandDataScenarios
    const [errorBroadbandData, setErrorBroadbandData] = useState<boolean>(false);
    const [isLoadingBroadbandData, setIsLoadingBroadbandData] = useState<boolean>(false);
    //PropertyDataScenarios
    const [errorPropertyData, setErrorPropertyData] = useState<boolean>(false);
    const [isLoadingPropertyData, setIsLoadingPropertyData] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { skipParam, setSkipParam } = useSkipParam(areaId, scenarioIds);
    const [urlParams, setUrlParams] = useState<string>('');

    const { data: scenariosData = [], error: scenariosDataError, isFetching: isScenariosDataLoading } = scenarioReportAPI.useGetScenarioReportQuery();
    const { data: projectReportData = [], isFetching: projectReportLoading, error: projectReportError } = projectReportAPI.useGetProjectReportQuery();

    useEffect(() => {
        const obj: { area_id?: number, scenario_ids: number[], aggregate_projects: boolean } = { area_id: areaId, scenario_ids: [], aggregate_projects: false };

        if (areaId) {
            obj.area_id = areaId;
        }

        if (scenarioIds.length) {
            delete obj.area_id;
            obj.scenario_ids = scenarioIds;
        }

        obj.aggregate_projects = false;

        if (areaId === 11) {
            delete obj.area_id;
        }

        setUrlParams(urlFormat(obj));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaId, projectIds, isScenariosDataLoading]);

    const [aggregateProjects, setAggregateProjects] = useState(true);
    const [urlForBroadBand, setUrlForBradband] = useState('');
    const [urlForBroadBandProject, setUrlForBradbandProjects] = useState('');

    useEffect(() => {
        const obj: { area_id?: number, scenario_ids: number[], aggregate_projects: boolean } = { area_id: areaId, scenario_ids: [], aggregate_projects: false };

        if (scenarioIds.length) {
            delete obj.area_id;
            obj.scenario_ids = scenarioIds;
        }

        obj.aggregate_projects = true;

        if (areaId === 11) {
            delete obj.area_id;
        }

        setUrlForBradband(urlFormat(obj));

        obj.aggregate_projects = false;
        setUrlForBradbandProjects(urlFormat(obj));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaId, projectIds, isScenariosDataLoading, aggregateProjects]);
    

    useEffect(() => {
        if (!areaId || scenarioIds.filter((el) => el).length === 0) {
            setSkipParam(true);
        }
    }, [areaId, scenarioIds, projectIds]);

    const { data: projectSummary = [], isFetching: projectSummaryLoading, error: projectSummaryError } = projectSummaryReportAPI.useGetProjectReportQuery({ params: urlParams }, {
        skip: skipParam
    });

    const { data: broadbandData = [], isFetching: broadbandDataLoading, error: broadbandDataError } = broadbandAPI.useGetBroadbandsQuery({ params: urlForBroadBand }, {
        skip: skipParam
    });
    const { data: broadbandDataPrj = [], isFetching: broadbandDataPrjLoading, error: broadbandDataPrjError } = broadbandAPI.useGetBroadbandsQuery({ params: urlForBroadBandProject }, {
        skip: skipParam
    });
    const { data: propertiesData = [], isFetching: propertiesDataLoading, error: propertiesDataError } = propertiesAPI.useGetPropertiesQuery({ params: urlForBroadBandProject }, {
        skip: skipParam
    });

    const array: { label: string, value: number }[] = [];

    for (let project of projectSummary) {
        const find = array.find((el) => {
            return el.label === project.project_name
        });

        if (!find && project.project_name) {
            array.push({
                label: project.project_name,
                value: project.project_id!
            })
        }
    }

    const [selectedData, setSelectedData] = useState<number | []>();
    const [projectSummaryComparisonData, setProjectSummaryComparison] = useState<any>([]);
    const [BroadbandComparisonData, setBroadbandComparison] = useState<any>([]);
    const [BroadbandComparisonDatProjects, setBroadbandComparisonDatProjects] = useState<any>([]);
    const [propertyComparisonData, setPropertyComparisonData] = useState<any>([]);

    useEffect(() => {
        if (scenarioIds.length || comparisonData.length) {
            setIsLoading(true);
            setIsLoadingBroadbandData(true);
            setError(false);
            setErrorBroadbandData(false);
            setErrorPropertyData(false);
            setIsLoadingPropertyData(true);

            const dataArr = [scenariosData.find((el) => el.id === scenarioIds[0])];

            const arrComparison = scenariosData.filter((el) => {
                if (comparisonData.length) {
                    const areasArr = comparisonData.map((el) => el.scenario.value);

                    return areasArr.includes(el.id);
                }
            });

            if (comparisonData.length) {
                dataArr.push(...arrComparison)
            }
            if (!dataArr.filter((el) => el).length) {
                setIsLoading(false);
                setScenarioReport([]);
                return;
            }
            // projectSummary
            const projectSummary = dataArr.filter((el) => el).map((scenario) => {
                return fetch(`https://reports.fibreplanner.io/api/v1/project-summary?aggregate_projects=true&scenario_ids=${scenario?.id}`, {
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
                            id: scenario?.id,
                            areasId: scenario?.area_id,
                            scenario_name: scenario?.label || '',
                            description: scenario?.description,
                            ...response[0]
                        };
                    });
            });

            (async () => {
                try {
                    const users = (await resolvePromisesSeq(projectSummary)).filter((el) => el);

                    setScenarioReport(users);
                } catch {
                    setError(true);
                } finally {
                    setIsLoading(false);
                }
            })();

            //broadband
            const filterUrlScenarios = comparisonData.filter((el) => el.scenario?.value);

            if (!filterUrlScenarios.length) {
                setIsLoading(false);
                setIsLoadingBroadbandData(false);
                setPropertyComparisonData([]);
                setBroadbandComparison([]);
                setIsLoadingPropertyData(false);
                return;
            }
            const broadbandDataScenarios = filterUrlScenarios.map((scenario) => {
                const urlParameters = urlFormat({ scenario_ids: scenario.scenario.value, aggregate_projects: true });
                return fetch(`https://reports.fibreplanner.io/api/v1/demographics/broadband-buckets?${urlParameters}`, {
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
                            response: response
                        };
                    });
            });

            (async () => {
                try {
                    const users = (await resolvePromisesSeq(broadbandDataScenarios)).filter((el) => el);

                    setBroadbandComparison(users);
                } catch {
                    setErrorBroadbandData(true);
                } finally {
                    setIsLoadingBroadbandData(false);

                }
            })();

            const propertyDataScenarios = filterUrlScenarios.map((scenario) => {
                const urlParameters = urlFormat({ scenario_ids: scenario.scenario.value, aggregate_projects: false });

                return fetch(`https://reports.fibreplanner.io/api/v1/properties?${urlParameters}`, {
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
                            response: response
                        };
                    });
            });

            (async () => {
                try {
                    const users = (await resolvePromisesSeq(propertyDataScenarios)).filter((el) => el);

                    setPropertyComparisonData(users);
                } catch {
                    setErrorPropertyData(false);
                } finally {
                    setIsLoadingPropertyData(false);
                }
            })();

            // projectSummaryComparison
            const filterUrl = comparisonData.filter((el) => el.projects.length);
            if (!filterUrl.length) {
                setIsLoading(false);
                setProjectSummaryComparison([]);
                return;
            }

            const projectSummaryComparison = filterUrl.map((scenario) => {
                const urlParameters = urlFormat({ project_ids: scenario.projects.map((el) => el.value), aggregate_projects: false });

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
                            areasId: scenario.area.value,
                            scenario_name: scenario.scenario.label || '',
                            scenario: scenario.scenario,
                            // project: scenario.projects[0],
                            project_name: scenario.projects[0].label,
                            ...response[0]
                        };
                    });
            });

            (async () => {
                try {
                    const users = (await resolvePromisesSeq(projectSummaryComparison)).filter((el) => el);
                    setProjectSummaryComparison(users);
                } catch {
                    setError(true);
                } finally {
                    setIsLoading(false);
                }
            })();


            // broadband
            if (!filterUrl.length) {
                setIsLoading(false);
                setBroadbandComparisonDatProjects([]);
                return;
            }

            const broadbandDataProjects = filterUrl.map((scenario) => {
                const urlParameters = urlFormat({ project_ids: scenario.projects.map((el) => el.value), aggregate_projects: false });
                return fetch(`https://reports.fibreplanner.io/api/v1/demographics/broadband-buckets?${urlParameters}`, {
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
                            response: response
                        };
                    });
            });

            (async () => {
                try {
                    const users = (await resolvePromisesSeq(broadbandDataProjects)).filter((el) => el);

                    setBroadbandComparisonDatProjects(users);
                } catch {
                    setError(true);
                } finally {
                    setIsLoading(false);
                }
            })();


        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScenariosDataLoading, comparisonData, scenarioIds]);

    const isLoadingStateBroadband = isLoadingBroadbandData || broadbandDataPrjLoading || broadbandDataLoading;
    const isErrorStateBroadband = errorBroadbandData || broadbandDataPrjError || broadbandDataError;

    const isLoadingStateScenario = isScenariosDataLoading || projectReportLoading || isLoading;
    const isErrorStateScenario = scenariosDataError || projectReportError || error;


    const chartData: {
        id: string,
        response: Broadbands[],
        scenario: { value: number, label: string } | null,
        project: { value: number, label: string } | null,
    }[] = [
            {
                id: `${areaId}-${scenarioIds}-${projectIds.join('')}`,
                scenario: {
                    value: scenariosData.find((el) => el.id === scenarioIds[0])?.id,
                    label: scenariosData.find((el) => el.id === scenarioIds[0])?.label
                },
                project: {
                    value: projectReportData.find((el) => el.id === projectIds[0])?.id,
                    label: projectReportData.find((el) => el.id === projectIds[0])?.project
                },
                response: broadbandData,
            },
            ...BroadbandComparisonData
        ];

    const chartDataProjects: {
        id: string,
        response: Broadbands[],
        scenario: { value: number, label: string } | null,
        project: { value: number, label: string } | null,
    }[] = [
            {
                id: `${areaId}-${scenarioIds}-${projectIds.join('')}`,
                scenario: {
                    value: scenariosData.find((el) => el.id === scenarioIds[0])?.id,
                    label: scenariosData.find((el) => el.id === scenarioIds[0])?.label
                },
                project: {
                    value: projectReportData.find((el) => el.id === projectIds[0])?.id,
                    label: projectReportData.find((el) => el.id === projectIds[0])?.project
                },
                response: broadbandDataPrj.filter((el) => el.project_id === selectedData),
            },
            ...BroadbandComparisonDatProjects
        ];

    const chartDataProperties: {
        id: string,
        response: Properties[],
        scenario: { value: number, label: string } | null,
        project: { value: number, label: string } | null,
    }[] = [
            {
                id: `${areaId}-${scenarioIds}-${projectIds.join('')}`,
                scenario: {
                    value: scenariosData.find((el) => el.id === scenarioIds[0])?.id,
                    label: scenariosData.find((el) => el.id === scenarioIds[0])?.label
                },
                project: {
                    value: projectReportData.find((el) => el.id === projectIds[0])?.id,
                    label: projectReportData.find((el) => el.id === projectIds[0])?.project
                },
                response: propertiesData,
            },
            ...propertyComparisonData
        ];
    // cppp buckets

    const bucketDefinitionObj: { [key: string]: [number, number] } = {};
    const step = 300;
    const max = 4500;
    let count = 1;
    for (let i = 0; i < max; i = i + step) {
        const arr: [number, number] = [i, i + step - 1];
        bucketDefinitionObj["bucket_" + count++] = arr;
    }
    bucketDefinitionObj["bucket_" + count++] = [4500, Infinity];

    const parseToBucket = (value: number, bucketDefinitionObj: { [key: string]: [number, number]; }) => {
        for (const bucket in bucketDefinitionObj) {
            if (
                value >= bucketDefinitionObj[bucket][0] &&
                value <= bucketDefinitionObj[bucket][1]
            ) {
                return bucket;
            }
        }
        return;
    };

    const plotlyConfig = chartDataProperties.map((el) => {
        const bucketCounts: { [key: string]: number } = {};

        for (const property of el.response) {
            const bucket = parseToBucket(Math.round(property.cppp), bucketDefinitionObj) || '';

            if (bucket in bucketCounts) {
                bucketCounts[bucket] += 1;
            } else {
                bucketCounts[bucket] = 1;
            }
        };
        const sortedPropertiesData = [];
        for (let key in bucketDefinitionObj) {
            const obj = {
                bucketName: key,
                bucketValues: bucketDefinitionObj[key],
                value: bucketCounts[key]
            }

            sortedPropertiesData.push(obj);
        }

        const plotlyConfig2 = [{
            x: sortedPropertiesData.map((el, i, arr) => {
                if (i === arr.length - 1) {
                    return `${el.bucketValues[0]}+`
                }
                return el.bucketValues.join('-');
            }),
            y: sortedPropertiesData.map((el) => el.value),
            name: `${el.scenario?.label} - cppp_count`,
            type: "bar",
        }];

        return plotlyConfig2
    }).flat(1);

    const tableData2: ScenarioLevelData[] = feasibilityTransformerAllScenarios(scenarioReport, scenariosData, variables).scenario_level;
    const projectData: ProjectLevelData[] = feasibilityTransformerAllScenarios(projectSummary, scenariosData, variables).project_level;
    const projectComparisonData: ProjectLevelData[] = feasibilityTransformerAllScenarios(projectSummaryComparisonData, scenariosData, variables).project_level;

    const foundedData = projectData.filter((el: any) => {
        const prjName = array.find((elem) => elem.value === selectedData)?.label;

        if (el.project_name === prjName) {
            return el
        }
    });

    // cppp_spreads && cppc
    const avgCppData = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'average_cppp');
    const avgCppDataPr = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'avg_cppp');
    
    const cppp_spreadsTabConfig = [
        {
            label: 'By Scenario',
            key: 'CPPP_Spreads_Scenario',
            children:
                <>

                    {isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={avgCppData.scenarioPlotConfig.map((el: any) => ({
                                    scenario: {
                                        label: el.name
                                    },
                                    response: [
                                        { average_cppp: el.y[0], }
                                    ]
                                }))}
                                filename={'cumulative-materials.csv'}
                                arrOfProps={['average_cppp']}
                            />
                        </div>
                        <Chart plotData={avgCppData.scenarioPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                            shapes={
                                [
                                    {
                                        line: { color: "green", width: 2 },
                                        type: "line",
                                        x0: 0,
                                        x1: 1, xref: "x domain", y0: 1250, y1: 1250, yref: "y"
                                    },
                                    {
                                        line: { color: "red", width: 2 },
                                        type: "line",
                                        x0: 0,
                                        x1: 1, xref: "x domain", y0: 1800, y1: 1800, yref: "y"
                                    },
                                ]
                            }
                        />
                    </div>
                    }

                </>
        },
        {
            label: 'By Project',
            key: 'CPPP_Spreads_Project',
            children:
                <>
                    {isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={avgCppDataPr.projectPlotConfig.map((el: any) => ({
                                    project: {
                                        label: el.name
                                    },
                                    response: [
                                        { average_cppp: el.y[0], }
                                    ]
                                }))}
                                filename={'cumulative-materials.csv'}
                                arrOfProps={['average_cppp']}
                            />
                        </div>
                        <SelectTemplate
                            data={array}
                            value={ selectedData}
                            onChange={setSelectedData}
                            label="Select project:"
                        />

                        <Chart plotData={avgCppDataPr.projectPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                            shapes={
                                [
                                    {
                                        line: { color: "green", width: 2 },
                                        type: "line",
                                        x0: 0,
                                        x1: 1, xref: "x domain", y0: 1250, y1: 1250, yref: "y"
                                    },
                                    {
                                        line: { color: "red", width: 2 },
                                        type: "line",
                                        x0: 0,
                                        x1: 1, xref: "x domain", y0: 1800, y1: 1800, yref: "y"
                                    },
                                ]
                            }
                        />
                    </div>
                    }
                </>
        },
    ]
    const cppc_spreadsTabConfig = [
        {
            label: 'By Scenario',
            key: 'CPPC_Spreads_Scenario',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={avgCppData.scenarioPlotConfig.map((el: any) => ({
                                    project: {
                                        label: el.name
                                    },
                                    response: [
                                        { average_cppp: el.y[0], }
                                    ]
                                }))}
                                filename={'cumulative-materials.csv'}
                                arrOfProps={['average_cppp']}
                            />
                        </div>
                        <Chart plotData={avgCppData.scenarioPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>
                    }
                </>
        },
        {
            label: 'By Project',
            key: 'CPPC_Spreads_Project',
            children:
                <>
                    {isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={avgCppDataPr.projectPlotConfig.map((el: any) => ({
                                    project: {
                                        label: el.name
                                    },
                                    response: [
                                        { average_cppp: el.y[0], }
                                    ]
                                }))}
                                filename={'cumulative-materials.csv'}
                                arrOfProps={['average_cppp']}
                            />
                        </div>
                        <SelectTemplate
                            data={array}
                            value={selectedData}
                            onChange={setSelectedData}
                            label="Select project:"
                        />
                        <Chart plotData={avgCppDataPr.projectPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
    ]

    //roi years
    const roi_at_pen_rate_yearsData = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'roi_at_pen_rate_years');

    const ROIYearTabConfig = [
        {
            label: 'By Scenario',
            key: 'ROI_Years_Scenario',
            children:
                <>
                    {isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={roi_at_pen_rate_yearsData.scenarioPlotConfig.map((el: any) => ({
                                    scenario: {
                                        label: el.name
                                    },
                                    response: [
                                        { roi_at_pen_rate_years: el.y[0], }
                                    ]
                                }))}
                                filename={'ROI_Years.csv'}
                                arrOfProps={['roi_at_pen_rate_years']}
                            />
                        </div>
                        <Chart plotData={roi_at_pen_rate_yearsData.scenarioPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                            shapes={
                                [
                                    {
                                        line: { color: "green", width: 2 },
                                        type: "line",
                                        x0: 0,
                                        x1: 1, xref: "x domain", y0: 6, y1: 6, yref: "y"
                                    },
                                    {
                                        line: { color: "red", width: 2 },
                                        type: "line",
                                        x0: 0,
                                        x1: 1, xref: "x domain", y0: 9, y1: 9, yref: "y"
                                    },
                                ]
                            }
                        />
                    </div>}
                </>
        },
        {
            label: 'By Project',
            key: 'ROI_Years_Project',
            children:
                <>
                    {isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={roi_at_pen_rate_yearsData.projectPlotConfig.map((el: any) => ({
                                    project: {
                                        label: el.name
                                    },
                                    response: [
                                        { roi_at_pen_rate_years: el.y[0], }
                                    ]
                                }))}
                                filename={'ROI_Years.csv'}
                                arrOfProps={['roi_at_pen_rate_years']}
                            />
                        </div>
                        <SelectTemplate
                            data={array}
                            value={selectedData}
                            onChange={setSelectedData}
                            label="Select project:"
                        />
                        <Chart plotData={roi_at_pen_rate_yearsData.projectPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                            shapes={
                                [
                                    {
                                        line: { color: "green", width: 2 },
                                        type: "line",
                                        x0: 0,
                                        x1: 1, xref: "x domain", y0: 6, y1: 6, yref: "y"
                                    },
                                    {
                                        line: { color: "red", width: 2 },
                                        type: "line",
                                        x0: 0,
                                        x1: 1, xref: "x domain", y0: 9, y1: 9, yref: "y"
                                    },
                                ]
                            }
                        />
                    </div>}
                </>
        },
    ]

    //UPRN 
    const uprn_countData = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'uprn_count');

    const UPRNTabConfig = [
        {
            label: 'By Scenario',
            key: 'UPRN_Scenario',
            children:
                <>
                    {isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={uprn_countData.scenarioPlotConfig.map((el: any) => ({
                                    scenario: {
                                        label: el.name
                                    },
                                    response: [
                                        { uprn_count: el.y[0], }
                                    ]
                                }))}
                                filename={'uprn_count.csv'}
                                arrOfProps={['uprn_count']}
                            />
                        </div>
                        <Chart plotData={uprn_countData.scenarioPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}

                </>
        },
        {
            label: 'By Project',
            key: 'UPRN_Project',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={uprn_countData.projectPlotConfig.map((el: any) => ({
                                    project: {
                                        label: el.name
                                    },
                                    response: [
                                        { uprn_count: el.y[0], }
                                    ]
                                }))}
                                filename={'uprn_count.csv'}
                                arrOfProps={['uprn_count']}
                            />
                        </div>
                        <SelectTemplate
                            data={array}
                            value={selectedData}
                            onChange={setSelectedData}
                            label="Select project:"
                        />
                        <Chart plotData={uprn_countData.projectPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
    ]

    //CAPEX 
    const total_capexData = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'total_capex');

    const total_capexTabConfig = [
        {
            label: 'By Scenario',
            key: 'CAPEX_Scenario',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={total_capexData.scenarioPlotConfig.map((el: any) => ({
                                    scenario: {
                                        label: el.name
                                    },
                                    response: [
                                        { total_capex: el.y[0], }
                                    ]
                                }))}
                                filename={'total_capex.csv'}
                                arrOfProps={['total_capex']}
                            />
                        </div>
                        <Chart plotData={total_capexData.scenarioPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
        {
            label: 'By Project',
            key: 'CAPEX_Project',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={total_capexData.projectPlotConfig.map((el: any) => ({
                                    project: {
                                        label: el.name
                                    },
                                    response: [
                                        { total_capex: el.y[0], }
                                    ]
                                }))}
                                filename={'total_capex.csv'}
                                arrOfProps={['total_capex']}
                            />
                        </div>
                        <SelectTemplate
                            data={array}
                            value={selectedData}
                            onChange={setSelectedData}
                            label="Select project:"
                        />
                        <Chart plotData={total_capexData.projectPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
    ]

    // Projects
    const unique_property_countData = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'unique_property_count');

    //one year revenue 
    const revenue_first_yearData = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'revenue_first_year');
    const revenue_first_yearProjectData = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'revenue_d30_r80');

    const revenue_first_yearTabConfig = [
        {
            label: 'By Scenario',
            key: 'FIRST_YEAR_Scenario',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={revenue_first_yearData.scenarioPlotConfig.map((el: any) => ({
                                    scenario: {
                                        label: el.name
                                    },
                                    response: [
                                        { revenue_first_year: el.y[0], }
                                    ]
                                }))}
                                filename={'revenue_first_year.csv'}
                                arrOfProps={['revenue_first_year']}
                            />
                        </div>
                        <Chart plotData={revenue_first_yearData.scenarioPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
        {
            label: 'By Project',
            key: 'FIRST_YEAR_Project',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={revenue_first_yearProjectData.projectPlotConfig.map((el: any) => ({
                                    project: {
                                        label: el.name
                                    },
                                    response: [
                                        { revenue_first_year: el.y[0], }
                                    ]
                                }))}
                                filename={'revenue_first_year.csv'}
                                arrOfProps={['revenue_first_year']}
                            />
                        </div>
                        <SelectTemplate
                            data={array}
                            value={ selectedData}
                            onChange={setSelectedData}
                            label="Select project:"
                        />
                        <Chart plotData={revenue_first_yearProjectData.projectPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
    ];

    //Gross Profit p/a 3Y
    const gross_profit_pa_year_3Data = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'gross_profit_pa_year_3');
    const gross_profit_pa_year_3ProjectData = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'gross_profit_pa');

    const gross_profit_pa_year_3TabConfig = [
        {
            label: 'By Scenario',
            key: 'Gross_Profit_Scenario',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={gross_profit_pa_year_3Data.scenarioPlotConfig.map((el: any) => ({
                                    scenario: {
                                        label: el.name
                                    },
                                    response: [
                                        { gross_profit_pa_year_3: el.y[0], }
                                    ]
                                }))}
                                filename={'gross_profit_pa_year_3.csv'}
                                arrOfProps={['gross_profit_pa_year_3']}
                            />
                        </div>
                        <Chart plotData={gross_profit_pa_year_3Data.scenarioPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
        {
            label: 'By Project',
            key: 'Gross_Profit_Project',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={gross_profit_pa_year_3ProjectData.projectPlotConfig.map((el: any) => ({
                                    project: {
                                        label: el.name
                                    },
                                    response: [
                                        { gross_profit_pa_year_3: el.y[0], }
                                    ]
                                }))}
                                filename={'gross_profit_pa_year_3.csv'}
                                arrOfProps={['gross_profit_pa_year_3']}
                            />
                        </div>
                        <SelectTemplate
                            data={array}
                            value={ selectedData}
                            onChange={setSelectedData}
                            label="Select project:"
                        />
                        <Chart plotData={gross_profit_pa_year_3ProjectData.projectPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
    ];

    //Gross Profit Over 6Y Period
    const gross_profit_over_year_periodData = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'gross_profit_over_year_period');

    const gross_profit_over_year_periodTabConfig = [
        {
            label: 'By Scenario',
            key: 'Gross_Profit_Over_6Y_Period_Scenario',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={gross_profit_over_year_periodData.scenarioPlotConfig.map((el: any) => ({
                                    scenario: {
                                        label: el.name
                                    },
                                    response: [
                                        { gross_profit_over_year_period: el.y[0], }
                                    ]
                                }))}
                                filename={'gross_profit_over_year_period.csv'}
                                arrOfProps={['gross_profit_over_year_period']}
                            />
                        </div>
                        <Chart plotData={gross_profit_over_year_periodData.scenarioPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
        {
            label: 'By Project',
            key: 'Gross_Profit_Over_6Y_Period_Project',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={gross_profit_over_year_periodData.projectPlotConfig.map((el: any) => ({
                                    project: {
                                        label: el.name
                                    },
                                    response: [
                                        { gross_profit_over_year_period: el.y[0], }
                                    ]
                                }))}
                                filename={'gross_profit_over_year_period.csv'}
                                arrOfProps={['gross_profit_over_year_period']}
                            />
                        </div>
                        <SelectTemplate
                            data={array}
                            value={selectedData}
                            onChange={setSelectedData}
                            label="Select project:"
                        />
                        <Chart plotData={gross_profit_over_year_periodData.projectPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
    ];

    //EV by UPRN Connected & Passed
    const EV_per_prem_connected_and_passedData = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'EV_per_prem_connected_and_passed');

    const EV_per_prem_connected_and_passedTabConfig = [
        {
            label: 'By Scenario',
            key: 'EV_by_UPRN_Connected_Scenario',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={EV_per_prem_connected_and_passedData.scenarioPlotConfig.map((el: any) => ({
                                    scenario: {
                                        label: el.name
                                    },
                                    response: [
                                        { EV_per_prem_connected_and_passed: el.y[0], }
                                    ]
                                }))}
                                filename={'EV_per_prem_connected_and_passed.csv'}
                                arrOfProps={['EV_per_prem_connected_and_passed']}
                            />
                        </div>
                        <Chart plotData={EV_per_prem_connected_and_passedData.scenarioPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
        {
            label: 'By Project',
            key: 'EV_by_UPRN_Connected_Project',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={EV_per_prem_connected_and_passedData.projectPlotConfig.map((el: any) => ({
                                    project: {
                                        label: el.name
                                    },
                                    response: [
                                        { EV_per_prem_connected_and_passed: el.y[0], }
                                    ]
                                }))}
                                filename={'EV_per_prem_connected_and_passed.csv'}
                                arrOfProps={['EV_per_prem_connected_and_passed']}
                            />
                        </div>
                        <SelectTemplate
                            data={array}
                            value={ selectedData}
                            onChange={setSelectedData}
                            label="Select project:"
                        />
                        <Chart plotData={EV_per_prem_connected_and_passedData.projectPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
    ];

    //EV minus Coupon plus 6Y Gross Profit
    const ev_minus_coupon_plus_period_gp_net_EVData = getPlotsConfig(tableData2, [...foundedData, ...projectComparisonData], 'ev_minus_coupon_plus_period_gp_net_EV');

    const ev_minus_coupon_plus_period_gp_net_EVTabConfig = [
        {
            label: 'By Scenario',
            key: 'ev_minus_coupon_plus_period_Scenario',
            children:
                <>
                    {isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={ev_minus_coupon_plus_period_gp_net_EVData.scenarioPlotConfig.map((el: any) => ({
                                    scenario: {
                                        label: el.name
                                    },
                                    response: [
                                        { ev_minus_coupon_plus_period_gp_net_EV: el.y[0], }
                                    ]
                                }))}
                                filename={'ev_minus_coupon_plus_period_gp_net_EV.csv'}
                                arrOfProps={['ev_minus_coupon_plus_period_gp_net_EV']}
                            />
                        </div>
                        <Chart plotData={ev_minus_coupon_plus_period_gp_net_EVData.scenarioPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
        {
            label: 'By Project',
            key: 'ev_minus_coupon_plus_period_Project',
            children:
                <>{isLoadingStateScenario && <Spinner className={styles.customSpinner} />}
                    {isErrorStateScenario && <Error />}
                    {!isLoadingStateScenario && !isErrorStateScenario && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={ev_minus_coupon_plus_period_gp_net_EVData.projectPlotConfig.map((el: any) => ({
                                    project: {
                                        label: el.name
                                    },
                                    response: [
                                        { ev_minus_coupon_plus_period_gp_net_EV: el.y[0], }
                                    ]
                                }))}
                                filename={'ev_minus_coupon_plus_period_gp_net_EV.csv'}
                                arrOfProps={['ev_minus_coupon_plus_period_gp_net_EV']}
                            />
                        </div>
                        <SelectTemplate
                            data={array}
                            value={selectedData}
                            onChange={setSelectedData}
                            label="Select project:"
                        />
                        <Chart plotData={ev_minus_coupon_plus_period_gp_net_EVData.projectPlotConfig}
                            legend={{
                                x: 0,
                                y: 1.2,
                            }}
                        />
                    </div>}
                </>
        },
    ];

    //broadband
    const labels = [
        "speed_0_2_mbs",
        "speed_2_5_mbs",
        "speed_5_10_mbs",
        "speed_10_30_mbs",
        "speed_30_300_mbs",
        "speed_300_above_mbs",
        "speed_no_internet",
    ];

    const scenariobroadbandPlots = chartData.map((el) => {
        const plotDataForScenario = el.response.map((item) => {
            const values = labels.map((label: any) => {
                return item[label as keyof Broadbands]
            });

            return {
                id: item.project_id,
                labels: labels,
                values: values.slice(1),
                uprn_count: item.uprn_count,
                title: el.scenario?.label || el.project?.label
            }
        });

        const configplotDataForScenario = plotDataForScenario.map((item, i) => {
            return {
                values: item.values,
                labels: labels,
                type: 'pie',
                name: item.title
            }
        });

        return configplotDataForScenario
    });

    const broadbandScenarioJSX = scenariobroadbandPlots.flat(1).map((el) => {
        return <Chart key={el.name} plotData={[el]}
            legend={{
                x: -0.5,
                y: 1,
                orientation: "v",
            }}
            title={el.name}
            style={{ width: '50%' }}
        />
    });

    const projectbroadbandPlots = chartDataProjects.map((el) => {
        const plotdata = el.response.map((item) => {
            const values = labels.map((label: any) => {
                return item[label as keyof Broadbands]
            });

            return {
                id: item.project_id,
                labels: labels,
                values: values.slice(1),
                uprn_count: item.uprn_count,
                title: item.project
            }
        });

        const configd = plotdata.map((item, i) => {
            return {
                values: item.values,
                labels: labels,
                type: 'pie',
                chartTitle: item.title
            }
        });

        return configd;
    });


    const projectbroadbandPlotsConfig = projectbroadbandPlots.flat(1).map((el) => {
        return <Chart key={el.chartTitle} plotData={[el]}
            legend={{
                x: -0.5,
                y: 1,
                orientation: "v",
            }}
            title={el.chartTitle}
            style={{ width: '50%' }}
        />
    });

    const broadbandTabConfig = [
        {
            label: 'By Scenario',
            key: 'Broadband_Scenario',
            onClick: () => setAggregateProjects(true),
            children:
                <>
                    {isLoadingStateBroadband && <Spinner className={styles.customSpinner} />}
                    {isErrorStateBroadband && <Error />}
                    {!isLoadingStateBroadband && !isErrorStateBroadband && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={chartData}
                                filename={'broadband_speed.csv'}
                                arrOfProps={labels}
                            />
                        </div>
                        <div className={classNames({ [styles.workdaysLayout]: broadbandScenarioJSX.length > 1, [styles.workdaysLayoutCenter]: broadbandScenarioJSX.length <= 1 })}>
                            {broadbandScenarioJSX}
                        </div>
                    </div>
                    }
                </>
        },
        {
            label: 'By Project',
            key: 'Broadband_Project',
            onClick: () => setAggregateProjects(false),
            children:
                <>
                    {isLoadingStateBroadband && <Spinner className={styles.customSpinner} />}
                    {isErrorStateBroadband && <Error />}
                    {!isLoadingStateBroadband && !isErrorStateBroadband && <>
                        <SelectTemplate
                            data={array}
                            value={ selectedData}
                            onChange={setSelectedData}
                            label="Select project:"
                        />
                        {!broadbandDataLoading && <div style={{ position: 'relative' }}>
                            <div className={styles.download}>
                                <CSVButton
                                    data={chartData}
                                    filename={'broadband_speed.csv'}
                                    arrOfProps={labels}
                                />
                            </div>
                            <div className={classNames({ [styles.workdaysLayout]: broadbandScenarioJSX.length > 1, [styles.workdaysLayoutCenter]: broadbandScenarioJSX.length <= 1 })}>
                                {projectbroadbandPlotsConfig}
                            </div>
                        </div>}
                    </>
                    }
                </>
        },
    ]

    // Broadband speed
    const tabConfig = [
        {
            label: 'CPPP Buckets',
            key: 'CPPP Buckets',
            onClick: () => setSelectedData([]),
            children:
                <>
                    {(propertiesDataLoading || isLoadingPropertyData) && <Spinner className={styles.customSpinner} />}
                    {(propertiesDataError || errorPropertyData) && <Error />}
                    {!propertiesDataError && !propertiesDataLoading && !errorPropertyData && <div style={{ position: 'relative' }}>
                        <div className={styles.download}>
                            <CSVButton
                                data={plotlyConfig.map((el: any) => ({
                                    project: {
                                        label: el.name
                                    },
                                    response: [
                                        ...el.x.map((item: any, i: number) => {
                                            return {
                                                bucket: item,
                                                count: el.y[i] ? el.y[i] : 0
                                            }
                                        })
                                    ]
                                }))}
                                filename={'CPPP_buckets_for_scenarios.csv'}
                                arrOfProps={['bucket', 'count']}
                            />
                        </div>
                        <Chart plotData={plotlyConfig}
                            title={'CPPP Buckets for Scenarios'}
                        />
                    </div>
                    }
                </>
        },
        {
            label: 'CPPP Spreads',
            key: 'CPPP Spreads',
            onClick: () => setSelectedData([]),
            children:
                <>
                    <Tab config={cppp_spreadsTabConfig} defaultValue="CPPP_Spreads_Scenario" />
                </>
        },
        {
            label: 'ROI Years',
            key: 'ROI Years',
            onClick: () => setSelectedData([]),
            children:
                <>
                    <Tab config={ROIYearTabConfig} defaultValue="ROI_Years_Scenario" />

                </>
        },
        {
            label: 'UPRN Count',
            key: 'UPRN Count',
            onClick: () => setSelectedData([]),
            children:
                <>
                    <Tab config={UPRNTabConfig} defaultValue="UPRN_Scenario" />
                </>
        },
        {
            label: 'Broadband Speeds',
            key: 'Broadband Speeds',
            onClick: () => setSelectedData([]),
            children:
                <>
                    <Tab config={broadbandTabConfig} defaultValue="Broadband_Scenario" />


                </>
        },
        {
            label: 'Capex',
            key: 'Capex',
            onClick: () => setSelectedData([]),
            children:
                <>
                    <Tab config={total_capexTabConfig} defaultValue="CAPEX_Scenario" />

                </>
        },
        {
            label: 'Unique Project/Builds',
            key: 'Unique Project/Builds',
            onClick: () => setSelectedData([]),
            children:
                <><div style={{ position: 'relative' }}>
                    <div className={styles.download}>
                        <CSVButton
                            data={unique_property_countData.scenarioPlotConfig.map((el: any) => ({
                                scenario: {
                                    label: el.name
                                },
                                response: [
                                    { unique_property_count: el.y[0], }
                                ]
                            }))}
                            filename={'unique_property_count.csv'}
                            arrOfProps={['unique_property_count']}
                        />
                    </div>
                    <Chart plotData={unique_property_countData.scenarioPlotConfig}
                        legend={{
                            x: 0,
                            y: 1.2,
                        }}
                    />
                </div>
                </>
        },
        {
            label: 'Avg. CPPC',
            key: 'Avg. CPPC',
            onClick: () => setSelectedData([]),
            children:
                <>
                    <Tab config={cppc_spreadsTabConfig} defaultValue="CPPC_Spreads_Scenario" />
                </>
        },
        {
            label: '1Y Revenue',
            key: '1Y Revenue',
            onClick: () => setSelectedData([]),
            children:
                <>
                    <Tab config={revenue_first_yearTabConfig} defaultValue="FIRST_YEAR_Scenario" />

                </>
        },
        {
            label: 'Gross Profit p/a 3Y',
            key: 'Gross Profit p/a 3Y',
            onClick: () => setSelectedData([]),
            children:
                <>
                    <Tab config={gross_profit_pa_year_3TabConfig} defaultValue="Gross_Profit_Scenario" />

                </>
        },
        {
            label: 'Gross Profit Over 6Y Period',
            key: 'Gross Profit Over 6Y Period',
            onClick: () => setSelectedData([]),
            children:
                <>
                    <Tab config={gross_profit_over_year_periodTabConfig} defaultValue="Gross_Profit_Over_6Y_Period_Scenario" />

                </>
        },
        {
            label: 'EV by UPRN Connected & Passed',
            key: 'EV by UPRN Connected & Passed',
            onClick: () => setSelectedData([]),
            children:
                <>
                    <Tab config={EV_per_prem_connected_and_passedTabConfig} defaultValue="EV_by_UPRN_Connected_Scenario" />

                </>
        },
        {
            label: 'EV minus Coupon plus 6Y Gross Profit',
            key: 'EV minus Coupon plus 6Y Gross Profit',
            onClick: () => setSelectedData([]),
            children:
                <>
                    <Tab config={ev_minus_coupon_plus_period_gp_net_EVTabConfig} defaultValue="ev_minus_coupon_plus_period_Scenario" />

                </>
        },
    ]
    return <>

        <div className={styles.chartSection}>
            <div className={styles.chartBody}>
                <Tab isScrolled config={tabConfig} defaultValue={'CPPP Buckets'} />

            </div>
        </div>
    </>
}