import styles from './Select.module.scss';
import classNames from 'classnames';
import { ConfigProvider, Select as SelectAndt } from 'antd';
import { selectToken } from './utils/designToken';
import { scenarioReportAPI } from 'services/ScenarioReportService';
import { tagRender } from './utils/TagRender';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { addAreaId, addProjectsId, addScenarioId, selectDashboard } from 'store/reducers/dashboardSlice';

interface Props {
    val?: any;
}

const SelectAreas: React.FC<Props> = ({ val }) => {
    const dispatch = useDispatch();
    const { areaId } = useSelector(selectDashboard);

    const [selectedArea, setSelectedArea] = useState(areaId);
    const { data: scenarioReportData = [], isLoading: scenarioReportLoading, error } = scenarioReportAPI.useGetScenarioReportQuery();
    const areaIds: { id: number, name: string }[] = [];

    useEffect(() => {
        if (areaId === null) {
            setSelectedArea([])
        }
    }, [areaId]);

    for (let scenario of scenarioReportData) {
        const find = areaIds.find((el) => {
            return el.id === scenario.area_id
        });

        if (!find) {
            areaIds.push({
                id: scenario.area_id,
                name: scenario.area_name
            })
        }
    }

    const options: { value: number; label: string; }[] = areaIds.map((element) => {
        return {
            value: element.id,
            label: element.name
        }
    });

    const handleClickAreas = (value: any) => {

        dispatch(addAreaId(value));

        // localStorage.setItem('area_id', JSON.stringify(value));
        // const customEvent = new CustomEvent('AREA_ID', {
        //     detail: [
        //         value
        //     ]
        // });
        // window.dispatchEvent(customEvent);
        setSelectedArea(value);
    }

    return <div data-testid="SelectAreas" className={classNames(styles.sort)}><ConfigProvider
        theme={{
            token: selectToken,
            components: {
                Select: { //@ts-ignore
                    clearBg: '#737373',
                }
            }
        }}
    >
        <div className={styles.select}>
            <label className={styles.selectLabel}>All: </label>
            <SelectAndt
                showSearch
                className={styles.select}
                // mode="tags"
                style={{ width: '300px' }}
                placeholder="All"
                onChange={handleClickAreas}
                options={options}
                tagRender={tagRender}
                value={selectedArea || []}
                allowClear
                onClear={() => {
                    dispatch(addAreaId(null));
                }}
            />
        </div>

    </ConfigProvider>
    </div>
}

export default SelectAreas;