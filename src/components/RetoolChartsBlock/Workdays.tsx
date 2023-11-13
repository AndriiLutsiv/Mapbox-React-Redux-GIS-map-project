import React, { useEffect, useState } from 'react';
import styles from './RetoolCharts.module.scss';
import { Spinner } from 'components/Spinner';
import { Chart } from 'components/Chart';
import { CSVButton } from 'components/CSVButton';
import { urlFormat } from 'utils/urlFormat';
import { tasksAPI } from 'services/TaskService';
import { Error } from 'components/Error';
import { useSkipParam } from 'hooks/useSkipParam';
import { resolvePromisesSeq } from 'utils/resolvePromisesSeq';
import { Task } from 'models/Task';
import { scenarioReportAPI } from 'services/ScenarioReportService';
import classNames from 'classnames';
import { projectReportAPI } from 'services/ProjectReportService';
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

export const Workdays: React.FC<Props> = ({ areaId, scenarioIds = [], projectIds = [], comparisonData = [], isProject, isScenario }) => {
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
        if (!scenarioIds.filter((el) => el).length && skipParamScenarios === false && tasksData.length) {
            setSkipParamScenarios(true);
        }

        if (!projectIds.filter((el) => el).length && skipParamProjects === false && tasksData.length) {
            setSkipParamProjects(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skipParamProjects, skipParamScenarios, scenarioIds, projectIds])

    const { data: scenarioReportData = [], isFetching: scenarioReportLoading, error: scenarioError } = scenarioReportAPI.useGetScenarioReportQuery();
    const { data: projectReportData = [], isFetching: projectReportLoading, error: projectReportError } = projectReportAPI.useGetProjectReportQuery();

    const { data: tasksData = [], isFetching: tasksDataLoading, error: tasksError } = tasksAPI.useGetTasksQuery({ params: urlParams }, {
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

                return fetch(`https://reports.fibreplanner.io/api/v1/tasks?${urlParameters}`, {
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

    const isLoadingState = scenarioReportLoading || projectReportLoading || tasksDataLoading || isLoading;
    const isErrorState = scenarioError || projectReportError || tasksError || error;


    if (isErrorState) {
        return <Error />
    }

    const responseData = ((isProject && projectIds.length) || (isScenario && scenarioIds.length)) ? tasksData : [];

    const chartData: {
        id: string,
        response: Task[],
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

    const getSunburstChart = (originalData: Task[]): {
        type: "sunburst",
        branchvalues: "total",
        labels: string[],
        parents: string[],
        values: number[],
        marker: any
    }[] | void => {

        const groupBy = (items: any[], key: string | number) =>
            items.reduce(
                (result, item) => ({
                    ...result,
                    [item[key]]: [...(result[item[key]] || []), item],
                }),
                {}
            );
        const sumBy = (items: any, key: string | number) => items.reduce((a: any, b: any) => a + (b[key] || 0), 0);

        const data = originalData.map((v: any) => {
            return {
                role: v.role_task.split('_')[0],
                task: v.role_task.split('_').slice(1).join('_'),
                role_task: v.role_task,
                work_days: Math.round(v.work_days),
            }
        });

        const labels = [];
        const parents = [];
        const plotValues = [];

        const groupedRoles = groupBy(data, "role");
        for (const [role, values] of Object.entries(groupedRoles)) {
            labels.push(role);
            parents.push("");
            plotValues.push(Math.round(sumBy(values, "work_days")))
        }

        data.forEach((v: any) => {
            if (v.role !== "reinstatement") {
                labels.push(v.task);
                parents.push(v.role);
                plotValues.push(Math.round(v.work_days));
            }
        });

        return [
            {
                type: "sunburst",
                branchvalues: "total",
                labels: labels,
                parents: parents,
                values: plotValues,
                marker: {
                    line:
                    {
                        width: 1,
                        color: '#000'
                    }
                },
            }
        ];
    };

    const plotlyData = chartData.map((el, i) => {
        return {
            ...el,
            plotData: getSunburstChart(el.response) || []
        }
    }).flat(2);
    const chartJSX = plotlyData.map((el) => {
        return <Chart key={el.id}
            plotData={el.plotData}
            y={'Kilometers'}
            title={`${isScenario ? el.scenario?.label : el.project?.label}`}
            style={{
                // width: arr.length > 1 ? '50%' : '100%',
                width: '50%',
                minHeight: '700px'
            }}
        />
    });

    const cvs = (originalData: any) => originalData.map((v: any) => {
        return {
            role: v.role_task.split('_')[0],
            task: v.role_task.split('_').slice(1).join('_'),
            role_task: v.role_task,
            work_days: Math.round(v.work_days),
        }
    });

    const cvsData = chartData.map((el) => {
        return {
            ...el,
            response: cvs(el.response) || []
        }
    });

    return <>

        <div className={styles.chartBody}>
            <div>
                {(isLoadingState) && <Spinner className={styles.customSpinner} />}
                {(!isLoadingState) && <>
                    <h2 className={styles.chartSectionTitle}>Total Workdays per Role</h2>
                    {!tasksData.length && <p className={classNames(styles.placeholder, styles.placeholderCenter)}>Nothing to show</p>}
                    {!!tasksData.length &&
                        <>
                            <div className={styles.download}>
                                <CSVButton
                                    data={cvsData}
                                    filename={'workdays.csv'}
                                    arrOfProps={[
                                        'role',
                                        'task',
                                        'role_task',
                                        'work_days'
                                    ]}
                                />
                            </div>

                            <div className={classNames({ [styles.workdaysLayout]: plotlyData.length > 1, [styles.workdaysLayoutCenter]: plotlyData.length <= 1 })}>
                                {chartJSX}
                            </div>
                        </>
                    }
                </>
                }
            </div>
        </div>
    </>
}