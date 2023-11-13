import styles from './ProjectsTable.module.scss';
import { Table } from 'components/Table';
import { priceFormatter } from 'components/Table/utils/priceFormatter';
import { TableHeader } from 'components/TableHeader';
import { Tab } from 'components/Tab';
import { Button } from 'components/Button';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'components/Search';
import { CSVLink } from 'react-csv';
import { projectSummaryReportAPI } from 'services/ProjectSummaryReportService';
import { Spinner } from 'components/Spinner';
import { Charts } from './Charts';
import { urlFormat } from 'utils/urlFormat';
import { useSkipParam } from 'hooks/useSkipParam';
import { Error } from 'components/Error';
import { useSelector } from 'react-redux';
import { addAreaId, addProjectsId, addScenarioId, selectDashboard } from 'store/reducers/dashboardSlice';
import { useDispatch } from 'react-redux';
import { addComparisonAreaId, removeComparisonData, selectComparisonID } from 'store/reducers/comparisonSlice';
import { scenarioReportAPI } from 'services/ScenarioReportService';
interface Props {
}

const ProjectsTable: React.FC<Props> = () => {
    const [searchValue, setSearchValue] = useState<string>();
    const dispatch = useDispatch();
    const { projectsId: projectIdsRTX } = useSelector(selectDashboard)
    const comparisonID = useSelector(selectComparisonID);
    const params: any = useParams();
    const { data: scenarioReportData = [], isLoading: scenarioReportLoading, error } = scenarioReportAPI.useGetScenarioReportQuery();

    useEffect(() => {
        const scenarioId = +params?.param1!;
        const area = scenarioReportData.find((el) => el.id === scenarioId)?.area_id;

        dispatch(addComparisonAreaId(area));
        dispatch(addAreaId(area));
        dispatch(addScenarioId(scenarioId));
    }, [comparisonID, params]);

    const [projectIds, setProjectIds] = useState<number[]>(projectIdsRTX);
    const [cvs, setCVSData] = useState<any[]>();

    useEffect(() => {
        localStorage.removeItem('project_id');
        localStorage.removeItem('modal_data');
        localStorage.removeItem('chart');
        localStorage.removeItem('area_id');

        dispatch(addProjectsId([]));
        dispatch(removeComparisonData());
        
        setProjectIds([]);
    }, []);
    

    useEffect(() => {
        setProjectIds(projectIdsRTX)
    }, [projectIdsRTX])

    const [urlParams, setUrlParams] = useState<string>('');

    useEffect(() => {
        const obj: { scenario_ids: any, aggregate_projects: boolean } = { scenario_ids: [], aggregate_projects: false };

        // if (areaId) {
        //     obj.area_id = areaId
        // }

        // if (scenarioIds.length) {
        //     obj.scenario_ids = scenarioIds
        // }

        if (+params.param1) {
            obj.scenario_ids = [params.param1]
        }
        obj.aggregate_projects = false;

        setUrlParams(urlFormat(obj));
    }, [params]);

    const { skipParam } = useSkipParam(-1, [+params.param1]);

    const { data: projectSummary = [], isLoading: projectSummaryLoading, error: projectSummaryError } = projectSummaryReportAPI.useGetProjectReportQuery({ params: urlParams }, {
        skip: skipParam
    });

    const projectSummaryArr = projectSummary.map((el: any) => ({
        ...el,
        id: el.project_id
    }));


    useEffect(() => {
        const scenarioReportCVS = projectSummaryArr?.map((el: any) => {
            return [el.project_name, el.project, el.total_capex, el.total_opex_per_annum, el.uprn_count]
        }) || [];

        const csvData = [
            ["Project Name", "Project", "Total CAPEX", "Total OPEX", "UPRN"],
            ...scenarioReportCVS
        ];

        setCVSData(csvData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectSummaryLoading]);

    const isLoadingState = projectSummaryLoading;
    const isErrorState = projectSummaryError;


    if (isLoadingState) {
        return <Spinner className={styles.customSpinner} />
    }

    if (isErrorState) {
        return <Error />
    }


    // config for table
    const config = [
        {
            label: "Project Name",
            render: (data: { [key: string]: string | number }) => data.project_name || <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: { [key: string]: string | number }) => data.project_name,
        },
        {
            label: "Project",
            render: (data: { [key: string]: string | number }) => data.project,
            sortValue: (data: { [key: string]: string | number }) => data.project,
        },
        {
            label: "Total CAPEX",
            render: (data: { [key: string]: number }) => data.total_capex ? `£${priceFormatter(data.total_capex)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: { [key: string]: number }) => data.total_capex,
        },
        {
            label: "Total OPEX",
            render: (data: { [key: string]: number }) => data.total_opex_per_annum ? `£${priceFormatter(data.total_opex_per_annum)}` : <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: { [key: string]: number }) => data.total_opex_per_annum,
        },
        {
            label: "UPRN",
            render: (data: { [key: string]: string | number }) => data.uprn_count || <p className={styles.placeholder}>{`<No data>`}</p>,
            sortValue: (data: { [key: string]: string | number }) => data.uprn_count,
        },
    ];

    const filterArray: (arr: any, searchValue?: { str: string, key: string } | null, id?: null | number[]) => any = (arr, searchValue = { str: '', key: 'description' }, areaId = null) => {
        let filtered = arr.slice();

        if (searchValue !== null && searchValue.key.length && searchValue.str.length) {
            filtered = filtered.filter((item: any) =>
                item[searchValue.key]?.toLowerCase().includes(searchValue.str.toLowerCase())
            );
        }

        if (areaId !== null && areaId.length) {
            filtered = filtered.filter((item: any) => areaId?.includes(item?.id));
        }

        return filtered;
    }

    const reasrchResult = searchValue || projectIds?.length
        ? filterArray(projectSummaryArr, {
            key: 'project',
            str: searchValue || ''
        }, projectIds)
        : projectSummaryArr;

    // config for tabs
    const tabsConfig = [
        {
            label: {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2.5 7.5L17.5 7.5M7.5 2.5L7.5 17.5M6.5 2.5H13.5C14.9001 2.5 15.6002 2.5 16.135 2.77248C16.6054 3.01217 16.9878 3.39462 17.2275 3.86502C17.5 4.3998 17.5 5.09987 17.5 6.5V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5Z" stroke="#FAFAFA" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>,
                text: 'Table'
            },
            onClick: () => {
                localStorage.removeItem('chart');
                const customEvent = new CustomEvent('DROPDOWN', {
                    detail: ''
                });
                window.dispatchEvent(customEvent);
            },
            key: '1',
            children: <>
                <TableHeader
                    title='Helicopter View'
                    subtitle='This is an overview of the various scenarios. Please click on a specific scenario or metric to delve deeper into their differences.'>
                    <Search onChange={setSearchValue} value={searchValue} />

                    <Button
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M17.5 12.5V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V12.5M14.1667 8.33333L10 12.5M10 12.5L5.83333 8.33333M10 12.5V2.5" stroke="#F5F5F5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>}>
                        <>
                            <CSVLink data={cvs || 'No Data'} filename={'projects-view-data.csv'}>Download</CSVLink>
                        </>
                    </Button>

                </TableHeader>
                <Table
                    isClickable={false}
                    data={reasrchResult}
                    config={config} pageSize={10} />
            </>,
        },
        {
            label: {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.5 7.5L12.1262 11.3384C11.963 11.455 11.8813 11.5133 11.7939 11.5309C11.7168 11.5464 11.637 11.5398 11.5635 11.5119C11.4801 11.4801 11.4092 11.4092 11.2673 11.2673L8.73267 8.73267C8.5908 8.5908 8.51986 8.51986 8.43652 8.48814C8.36305 8.46017 8.28317 8.45356 8.2061 8.46907C8.11868 8.48666 8.03704 8.54497 7.87378 8.66159L2.5 12.5M6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V6.5C17.5 5.09987 17.5 4.3998 17.2275 3.86502C16.9878 3.39462 16.6054 3.01217 16.135 2.77248C15.6002 2.5 14.9001 2.5 13.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5Z" stroke="#D6D6D6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>,
                text: 'Chart'
            },
            onClick: () => {
                localStorage.setItem('chart', '1');
                const customEvent = new CustomEvent('DROPDOWN', {
                    detail: '1'
                });
                window.dispatchEvent(customEvent);
            },
            key: '2',
            children: <>
                <Charts />


            </>,
        },
    ];

    return <div data-testid="ProjectsTable" className={styles.projects}>
        <div className={styles.projectsContainer}>

            <Tab config={tabsConfig} defaultValue={'1'} />
        </div>
    </div>
}

export default ProjectsTable;