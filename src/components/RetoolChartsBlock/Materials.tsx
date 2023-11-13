import React, { useEffect, useState } from 'react';
import styles from './RetoolCharts.module.scss';
import { Spinner } from 'components/Spinner';
import { Chart } from 'components/Chart';
import { scenarioReportAPI } from 'services/ScenarioReportService';
import { CSVButton } from 'components/CSVButton';
import { urlFormat } from 'utils/urlFormat';
import { materialsAPI } from 'services/MaterialsService';
import { getArrayOfUniqueValues } from 'utils/arrayOfUniqueValues';
import { resolvePromisesSeq } from 'utils/resolvePromisesSeq';
import { Materials as MaterialsType } from 'models/Materials';
import { useSkipParam } from 'hooks/useSkipParam';
import { projectReportAPI } from 'services/ProjectReportService';
import { Error } from 'components/Error';
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



export const Materials: React.FC<Props> = ({ areaId, scenarioIds = [], projectIds = [], comparisonData = [], isProject, isScenario }) => {
    const { token } = useAuth();
    const dispatch = useAppDispatch();

    const [urlParams, setUrlParams] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

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
        if (!scenarioIds.filter((el) => el).length && skipParamScenarios === false && materialsData.length) {
            setSkipParamScenarios(true);
        }

        if (!projectIds.filter((el) => el).length && skipParamProjects === false && materialsData.length) {
            setSkipParamProjects(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skipParamProjects, skipParamScenarios, scenarioIds, projectIds])
    

    const { data: scenarioReportData = [], isLoading: scenarioReportLoading, error: scenarioError } = scenarioReportAPI.useGetScenarioReportQuery();
    const { data: projectReportData = [], isLoading: projectReportLoading, error: projectReportError } = projectReportAPI.useGetProjectReportQuery();

    const { data: materialsData = [], isLoading: materialsDataLoading, error: materialsError } = materialsAPI.useGetMaterialsQuery({ params: urlParams }, {
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

                return fetch(`https://reports.fibreplanner.io/api/v1/materials?${urlParameters}`, {
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

    const isLoadingState = projectReportLoading || scenarioReportLoading || materialsDataLoading || isLoading;
    const isErrorState = projectReportError || scenarioError || materialsError || error;

    if (isErrorState) {
        return <Error />
    }

    const responseData = ((isProject && projectIds.length) || (isScenario && scenarioIds.length)) ? materialsData : [];

    const chartData: {
        id: string,
        response: MaterialsType[],
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

    const result = chartData.map((el) => {
        const nonZero = el.response.filter((i) => i.length > 0);
        return {
            ...el,
            response: nonZero
        }
    }).map((el) => {
        return {
            "x": el.response.map((i) => i.day),
            "y": el.response.map((i) => i.length),
            name: `${isScenario ? el.scenario?.label : el.project?.label}`,
            "type": "line",
            "transforms": [
                {
                    "type": "groupby",
                    "groups": el.response.map((i) => i.material_type),
                    "styles": getArrayOfUniqueValues(el.response.map((i) => i.material_type)).map((el) => {
                        return {
                            "target": el,
                        }
                    })
                },
                {
                    "type": "sort",
                    "target": el.response.map((i) => i.day),
                    "order": "ascending"
                },
                {
                    "type": "aggregate",
                    "groups": el.response.map((i) => i.day),
                    "aggregations": [
                        {
                            "target": "y",
                            "func": "sum",
                            "enabled": true
                        }
                    ]
                }
            ],
            "mode": "lines+markers"
        }

    });

    return <>

        <div className={styles.chartBody}>
            <div style={{ minHeight: '500px' }}>
                {isLoadingState && <Spinner className={styles.customSpinner} />}
                {!isLoadingState && <>
                    <div className={styles.download}>
                        <CSVButton
                            data={chartData}
                            filename={'cumulative-materials.csv'}
                            arrOfProps={['day', 'material_type', 'length', 'count']}
                        />
                    </div>
                    <Chart plotData={result}
                        y={'Kilometers'}
                        title={`Cumulative Materials`} />
                </>
                }
            </div>
        </div>
    </>
}