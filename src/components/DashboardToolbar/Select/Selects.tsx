import styles from './Select.module.scss';
import classNames from 'classnames';
import { ConfigProvider, Select as SelectAndt } from 'antd';
import { selectToken } from './utils/designToken';
import { scenarioReportAPI } from 'services/ScenarioReportService';
import { tagRender } from './utils/TagRender';
import { useEffect, useState } from 'react';
import { projectReportAPI } from 'services/ProjectReportService';
import { useDataHook } from 'hooks/useDataHook';
import { useParams } from 'react-router-dom';
import { addAreaId, addProjectsId, addScenarioId, selectDashboard } from 'store/reducers/dashboardSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import SelectAreas from './SelectAreas';

interface Props {
    isBlock?: boolean;
}

const Selects: React.FC<Props> = ({ isBlock }) => {
    const { areaId, scenarioId, projectsId } = useSelector(selectDashboard);
    const dispatch = useDispatch();

    const { data: scenarioReportData = [], isLoading: scenarioReportLoading, error } = scenarioReportAPI.useGetScenarioReportQuery();
    const { data: projectReportData = [], isLoading: projectReportDataLoading, error: projectReportDataRrror } = projectReportAPI.useGetProjectReportQuery();

    const param = useParams();
    const areaIds: { id: number, name: string }[] = [];

    // const [arrOfScenarios, setScenariosArr] = useState<any>();
    // const { projectId, setProjectId, scenarioId, setScenarioId, setModalData, modalData } = useDataHook();

    // // const [selectedArea, setSelectedArea] = useState<any>();
    // const [selectedScenario, setSelectedScenario] = useState<any>();
    // const [selectedProject, setSelectedProject] = useState<any>();
    // const [areaValue, setAreaValue] = useState<number | null>(areaId);


    // const dispatch = useDispatch();
    // const [selectedArea, setSelectedArea] = useState(areaId);

    // useEffect(() => {
    //     const prjSelect = projectReportData.filter((el) => {
    //         return el.scenario_id === scenarioId;
    //     });
    //     setSelectedProject(prjSelect);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectedScenario, scenarioId, modalData]);

    // useEffect(() => {
    //     if (scenarioReportData.length && !param.param1) {
    //         setAreaValue(options[0].value);
    //         handleClickAreas(options[0].value);
    //     } else {
    //         const data = scenarioReportData.find((el) => param.param1 && el.id === +param.param1)?.area_id;
    //         setAreaValue(options.find(el => el.value === data)!.value);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [scenarioReportLoading]);

    // useEffect(() => {
    //     const arrOfScenarios = scenarioReportData.filter((el) => el.area_id === areaValue);

    //     setScenariosArr(arrOfScenarios);

    //     if (param.param1) {
    //         handleClickScenario(arrOfScenarios.find((el) => param.param1 && el.id === +param.param1)?.id);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [areaValue, param.param1]);



    // for (let scenario of scenarioReportData) {
    //     const find = areaIds.find((el) => {
    //         return el.id === scenario.area_id
    //     });

    //     if (!find) {
    //         areaIds.push({
    //             id: scenario.area_id,
    //             name: scenario.area_name
    //         })
    //     }
    // }

    // const []

    // const options: { value: number; label: string; }[] = areaIds.map((element) => {
    //     return {
    //         value: element.id,
    //         label: element.name
    //     }
    // });

    // const options2: { value: number; label: string; }[] = scenarioReportData.filter((el) => el.area_id === areaValue)?.map((element: any) => {
    //     return {
    //         value: element.id,
    //         label: element.label
    //     }
    // });
    // const options3: { value: number; label: string; }[] = selectedProject?.map((element: any) => {

    //     return {
    //         value: element.id,
    //         label: element.project
    //     }
    // });

    // const handleClickAreas = (value: any) => {
    //     localStorage.setItem('area_id', JSON.stringify(value));
    //     const customEvent = new CustomEvent<number>('AREA_ID', {
    //         detail: value
    //     });
    //     window.dispatchEvent(customEvent);
    //     // setSelectedArea(value);
    //     setAreaValue(value);
    // }

    // const handleClickScenario = (value: any) => {
    //     localStorage.setItem('scenario_id', JSON.stringify(value));
    //     const customEvent = new CustomEvent('SCENARIO_ID', {
    //         detail: value
    //     });
    //     window.dispatchEvent(customEvent);
    //     setSelectedScenario(value);
    // }

    // const handleClickProject = (value: any) => {
    //     localStorage.setItem('project_ids', JSON.stringify(value));
    //     const customEvent = new CustomEvent('PRJS_ID', {
    //         detail: value
    //     });
    //     window.dispatchEvent(customEvent);
    //     setProjectId(value);

    //     // const arrOfData = value.map((el: any) => {
    //     //     return {
    //     //         area: areaValue,
    //     //         scenario: scenarioId,
    //     //         project: el
    //     //     }
    //     // })

    //     // setModalData(arrOfData);

    //     // localStorage.setItem('modal_data', JSON.stringify(arrOfData));
    //     // const customEventMODALDATA = new CustomEvent('MODAL_DATA', {
    //     //     detail: [
    //     //         ...arrOfData
    //     //     ]
    //     // });
    //     // window.dispatchEvent(customEventMODALDATA);

    // }

    const [selectedArea, setSelectedArea] = useState(areaId);
    const [selectedScenario, setSelectedScenario] = useState<any>();
    const [selectedProject, setSelectedProject] = useState<number[]>([]);

    const handleClickAreas = (value: any) => {
        dispatch(addAreaId(value));
    };

    const handleClickScenario = (value: any) => {
        dispatch(addScenarioId(value))
    }

    const handleClickProject = (value: any) => {
        dispatch(addProjectsId(value))
    }

    const areasArray: { id: number, name: string }[] = [];

    for (let scenario of scenarioReportData) {
        const find = areasArray.find((el) => {
            return el.id === scenario.area_id
        });

        if (!find) {
            areasArray.push({
                id: scenario.area_id,
                name: scenario.area_name
            })
        }
    }

    const areaOptions: { value: number; label: string; }[] = areasArray.map((element) => {
        return {
            value: element.id,
            label: element.name
        }
    });


    const scenarioOptions: { value: number; label: string; }[] = scenarioReportData.filter((el) => el.area_id === areaId).map((element) => {
        return {
            value: element.id,
            label: element.label
        }
    });

    const projectsOptions: { value: number; label: string; }[] = projectReportData.filter((el) => el.scenario_id === scenarioId).map((element) => {
        return {
            value: element.id,
            label: element.project
        }
    });


    return <>
        <ConfigProvider theme={{
            token: selectToken,

            components: {
                Select: { //@ts-ignore
                    clearBg: '#737373',
                }
            }
        }}>
            <div className={styles.select}>
                <label className={styles.selectLabel}>All: </label>
                <SelectAndt
                    showSearch
                    className={styles.select}
                    defaultActiveFirstOption={true}
                    // mode="tags"
                    // value={options.find((el) => el.value === areaValue)}
                    value={areaId}
                    style={{ width: '20vw', maxWidth: '300px' }}
                    placeholder="All"
                    onChange={handleClickAreas}
                    options={areaOptions}
                    tagRender={tagRender}
                    maxTagCount='responsive'
                    allowClear
                    onClear={() => {
                        dispatch(addAreaId(null));
                    }}
                />
            </div>
            <div className={styles.select}>
                <label className={styles.selectLabel}>Scenarios: </label>
                <SelectAndt
                    showSearch
                    className={styles.select}
                    value={scenarioId}
                    disabled={scenarioReportLoading}
                    style={{ width: '20vw', maxWidth: '300px' }}
                    placeholder="All"
                    onChange={handleClickScenario}
                    options={scenarioOptions}
                    tagRender={tagRender}
                    allowClear
                    onClear={() => {
                        dispatch(addScenarioId(null));
                    }}
                />
            </div>
            <div className={styles.select}>
                <label className={styles.selectLabel}>Project: </label>
                <SelectAndt
                    showSearch
                    className={styles.select}
                    mode="tags"
                    style={{ width: '31vw', maxWidth: '450px' }}
                    placeholder="All"
                    onChange={handleClickProject}
                    options={projectsOptions}
                    tagRender={tagRender}
                    value={projectsId}
                    disabled={projectReportDataLoading}
                    maxTagCount='responsive'
                    allowClear
                    onClear={() => {
                        dispatch(addProjectsId([]));
                    }}
                />
            </div>

        </ConfigProvider>
    </>
}

export default Selects;