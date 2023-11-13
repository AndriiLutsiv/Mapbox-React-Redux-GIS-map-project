import { useEffect, useState } from 'react';
import styles from './HelicopterView.module.scss';
import { Table } from 'components/Table';
import { priceFormatter } from 'components/Table/utils/priceFormatter';
import { TableHeader } from 'components/TableHeader';
import { Tab } from 'components/Tab';
import { Button } from 'components/Button';
import { Search } from 'components/Search';
import { scenarioReportAPI } from 'services/ScenarioReportService';
import { filterArray } from 'utils/filterArrayWithParams';
import { Spinner } from 'components/Spinner';
import { CSVLink } from "react-csv";
import { Modal } from 'components/Modal';
import Selects from 'components/DashboardToolbar/Select/Selects';
import { Charts } from './Charts';
import { resolvePromisesSeq } from 'utils/resolvePromisesSeq';
import { Tooltip } from 'antd';
import { Error } from 'components/Error';
import { addAreaId, addScenarioId, selectDashboard } from 'store/reducers/dashboardSlice';
import { useSelector } from 'react-redux';
import { useAuth } from 'hooks/useAuth';
import { useAppDispatch } from 'hooks/redux';
import { clearToken } from 'store/reducers/tokenSlice';
import { addComparisonAreaId, addComparisonData, removeComparisonData } from 'store/reducers/comparisonSlice';
interface Props {
}

const HelicopterView: React.FC<Props> = () => {

    const { areaId, scenarioId, projectsId } = useSelector(selectDashboard);
    const { token } = useAuth();
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>();
    const [scenarioReport, setScenarioReport] = useState<any>();
    const [error, setError] = useState<boolean>();
    const [cvs, setCVSData] = useState<any[]>();

    const [showModal, setShowModal] = useState(false);

    const { data: scenariosData = [], error: scenariosDataError, isFetching: isScenariosDataLoading } = scenarioReportAPI.useGetScenarioReportQuery();

    useEffect(() => {
        localStorage.removeItem('area_id');
        localStorage.removeItem('projects_id');
        localStorage.removeItem('project_id');
        localStorage.removeItem('scenario_id');
        localStorage.removeItem('chart');

        dispatch(addComparisonAreaId(null));
        dispatch(removeComparisonData());
        dispatch(addScenarioId(null));
    }, []);


    useEffect(() => {
        if (scenariosData.length) {

            setIsLoading(true);
            setError(false);

            const mapArr = scenariosData.map((scenario) => {

                return fetch(`https://reports.fibreplanner.io/api/v1/project-summary?aggregate_projects=true&scenario_ids=${scenario.id}`, {
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
                            area_id: scenario.area_id,
                            name: scenario.label || '',
                            description: scenario.description,
                            ...response[0]
                        };
                    });
            });

            (async () => {
                try {
                    const users = (await resolvePromisesSeq(mapArr)).filter((el) => el);

                    setScenarioReport(users);
                } catch {
                    setError(true);
                } finally {
                    setIsLoading(false);
                }
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScenariosDataLoading]);


    useEffect(() => {
        const scenarioReportCVS = (areaId || searchValue
            ? filterArray(scenarioReport, {
                key: 'description',
                str: searchValue || ''
            }, areaId)
            : scenarioReport)?.map((el: { name: string; description: string; total_capex: number; total_opex_per_annum: number; uprn_count: number; }) => {
                return [el.name, el.description, el.total_capex, el.total_opex_per_annum, el.uprn_count]
            }) || [];

        const csvData = [
            ["Scenario Name", "Scenario description", "Total CAPEX", "Total OPEX", "UPRN"],
            ...scenarioReportCVS
        ];

        setCVSData(csvData);
    }, [areaId, searchValue, scenarioReport]);

    const isLoadingState = isScenariosDataLoading || isLoading;
    const isErrorState = scenariosDataError || error;


    if (isLoadingState) {
        return <Spinner className={styles.customSpinner} />
    }

    if (isErrorState) {
        return <Error />
    }

    // config for table
    const config = [
        {
            label: "Scenario Name",
            render: (data: { [key: string]: string }) => <Tooltip title={data.name} placement="topLeft">{data.name}</Tooltip>,
            sortValue: (data: { [key: string]: string }) => data.name,
        },
        {
            label: "Scenario description",
            render: (data: { [key: string]: string }) => data.description,
            sortValue: (data: { [key: string]: string }) => data.description,
        },
        {
            label: "Total CAPEX",
            render: (data: { [key: string]: number }) => data.total_capex ? `£${priceFormatter(data.total_capex)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: { [key: string]: number }) => data.total_capex || 0,
        },
        {
            label: "Total OPEX",
            render: (data: { [key: string]: number }) => data.total_opex_per_annum ? `£${priceFormatter(data.total_opex_per_annum)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: { [key: string]: number }) => data.total_opex_per_annum || 0,
        },
        {
            label: "UPRN",
            render: (data: { [key: string]: number }) => data.uprn_count ? data.uprn_count : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: { [key: string]: number }) => data.uprn_count || 0,
        },
    ];


    const filteredResult = areaId || searchValue
        ? filterArray(scenarioReport, {
            key: 'description',
            str: searchValue || ''
        }, areaId)
        : scenarioReport;


    // config for tabs
    const tabsConfig = [
        {
            label: {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2.5 7.5L17.5 7.5M7.5 2.5L7.5 17.5M6.5 2.5H13.5C14.9001 2.5 15.6002 2.5 16.135 2.77248C16.6054 3.01217 16.9878 3.39462 17.2275 3.86502C17.5 4.3998 17.5 5.09987 17.5 6.5V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5Z" stroke="#FAFAFA" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>,
                text: 'Table'
            },
            key: '1',
            onClick: () => {
                localStorage.removeItem('chart');
                const customEvent = new CustomEvent('DROPDOWN', {
                    detail: ''
                });
                window.dispatchEvent(customEvent);
            },
            children: <>
                <TableHeader
                    title='Helicopter View'
                    subtitle='This is an overview of the various scenarios. Please click on a specific scenario or metric to delve deeper into their differences.'>


                    <Search onChange={setSearchValue} value={searchValue} />
                    <CSVLink data={cvs || 'No Data'} filename={'helicopter-view-data.csv'}>
                        <Button
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M17.5 12.5V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V12.5M14.1667 8.33333L10 12.5M10 12.5L5.83333 8.33333M10 12.5V2.5" stroke="#F5F5F5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>}>
                            <>
                                Download
                            </>
                        </Button>
                    </CSVLink>
                </TableHeader>
                <Table
                    data={filteredResult}
                    round
                    stickyColumn
                    config={config}
                    pageSize={10}
                    isClickable />
            </>,
        },
        {
            label: {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.5 7.5L12.1262 11.3384C11.963 11.455 11.8813 11.5133 11.7939 11.5309C11.7168 11.5464 11.637 11.5398 11.5635 11.5119C11.4801 11.4801 11.4092 11.4092 11.2673 11.2673L8.73267 8.73267C8.5908 8.5908 8.51986 8.51986 8.43652 8.48814C8.36305 8.46017 8.28317 8.45356 8.2061 8.46907C8.11868 8.48666 8.03704 8.54497 7.87378 8.66159L2.5 12.5M6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V6.5C17.5 5.09987 17.5 4.3998 17.2275 3.86502C16.9878 3.39462 16.6054 3.01217 16.135 2.77248C15.6002 2.5 14.9001 2.5 13.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5Z" stroke="#D6D6D6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>,
                text: 'Chart'
            },
            key: '2',
            onClick: () => {
                localStorage.setItem('chart', '1');
                const customEvent = new CustomEvent('DROPDOWN', {
                    detail: '1'
                });
                window.dispatchEvent(customEvent);
            },
            children: <>
                <Charts />
            </>,
        },
    ];
    return <div data-testid="HelicopterView" className={styles.projects}>
        <div className={styles.projectsContainer}>
            <Tab config={tabsConfig} defaultValue={'1'} isScrolled />

            {showModal && <Modal onClose={() => setShowModal(false)}>
                <Selects isBlock />
            </Modal>}
        </div>
    </div>
}

export default HelicopterView;