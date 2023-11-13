import styles from './Select.module.scss';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { ConfigProvider, Select as SelectAndt } from 'antd';
import { selectToken } from './utils/designToken';
import { projectSummaryReportAPI } from 'services/ProjectSummaryReportService';
import { tagRender } from './utils/TagRender';
import { useEffect, useState } from 'react';
import { urlFormat } from 'utils/urlFormat';
import { useSkipParam } from 'hooks/useSkipParam';
import { useDispatch } from 'react-redux';
import { addAreaId, addProjectsId, addScenarioId, selectDashboard } from 'store/reducers/dashboardSlice';
import { useSelector } from 'react-redux';
import { scenarioReportAPI } from 'services/ScenarioReportService';
import { addComparisonAreaId } from 'store/reducers/comparisonSlice';

interface Props {
}

const SelectProjects: React.FC<Props> = () => {
    const params: any = useParams();
    const dispatch = useDispatch();
    const { areaId, projectsId } = useSelector(selectDashboard);

    const [selectedProjects, setSelectedProjects] = useState(projectsId);

    const [urlParams, setUrlParams] = useState<string>('');
    const { data: scenarioReportData = [], isLoading: scenarioReportLoading, error } = scenarioReportAPI.useGetScenarioReportQuery();
    const { data: projectSummary = [], isLoading: projectSummaryLoading, error: projectSummaryError } = projectSummaryReportAPI.useGetProjectReportQuery({ params: urlParams }, {
        skip: !urlParams
    });

    useEffect(() => {
        if (projectsId.length === 0) {
            setSelectedProjects([])
        }
    }, [projectsId])

    useEffect(() => {
        const obj: { scenario_ids: any, aggregate_projects: boolean } = { scenario_ids: [], aggregate_projects: false };

        if (+params.param1) {
            obj.scenario_ids = [params.param1]
        }

        obj.aggregate_projects = false;

        setUrlParams(urlFormat(obj));

        if (areaId === null) {
            const areaIdValue = scenarioReportData.find((el) => el.id === +params.param1)?.area_id;
            dispatch(addAreaId(areaIdValue));
            dispatch(addComparisonAreaId(areaIdValue));
        }

        
        dispatch(addScenarioId(+params.param1));
    }, [params]);

    


    const scenarioOptions: { value: number; label: string; }[] = projectSummary.map((element) => {
        return {
            value: element.project_id!,
            label: element.project_name!
        }
    });


    const handleClickAreas = (value: any) => {
        localStorage.setItem('project_id', JSON.stringify(value));
        const customEvent = new CustomEvent('PROJECT_ID', {
            detail: [
                value
            ]
        });
        window.dispatchEvent(customEvent);
        if (value.length) {
            dispatch(addProjectsId(value))
        } else {
            dispatch(addProjectsId([]))
        }
        setSelectedProjects(value);
    }

    return <div data-testid="SelectProjects" className={classNames(styles.sort)}><ConfigProvider theme={{
        token: selectToken,
        components: {
            Select: { //@ts-ignore
                clearBg: '#737373',
            }
        }
    }}>
        <div className={styles.select}>
            <label className={styles.selectLabel}>Project Name: </label>
            <SelectAndt
                className={styles.select}
                mode="tags"
                style={{ width: '300px' }}
                placeholder="All"
                onChange={handleClickAreas}
                options={scenarioOptions}
                tagRender={tagRender}
                value={selectedProjects || []}
                allowClear
                onClear={() => {
                    dispatch(addProjectsId([]))
                }}
            />
        </div>

    </ConfigProvider>
    </div>
}

export default SelectProjects;