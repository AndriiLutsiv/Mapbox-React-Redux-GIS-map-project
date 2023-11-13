import styles from './Select.module.scss';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { selectToken } from './utils/designToken';
import SelectAreas from './SelectAreas';
import SelectProjects from './SelectProjects';
import Selects from './Selects';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAreaId, addProjectsId, addScenarioId } from 'store/reducers/dashboardSlice';

interface Props {
}

const Select: React.FC<Props> = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const [chartPage, setChartPage] = useState<string>('');

    useEffect(() => {
        dispatch(addAreaId(null));
    }, []);

    useEffect(() => {
        localStorage.removeItem('chart');
        setChartPage('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    useEffect(() => {
        const modalListener = (event: CustomEvent<string>) => {
            setChartPage(event.detail);
        };
        window.addEventListener('DROPDOWN', modalListener as EventListener);

        return () => {
            window.removeEventListener('DROPDOWN', modalListener as EventListener);
        }
    }, [chartPage]);

    const retoolPage = Object.keys(params).length === 0;

    return <div data-testid="Select" className={classNames(styles.sort)}><ConfigProvider theme={{
        token: selectToken,
    }}>
        {chartPage ?
            <Selects />
            : retoolPage ? <SelectAreas /> : <SelectProjects />
        }

    </ConfigProvider>
    </div>
}

export default Select;