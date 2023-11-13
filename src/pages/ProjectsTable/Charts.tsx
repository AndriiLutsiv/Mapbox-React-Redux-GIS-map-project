import styles from './ProjectsTable.module.scss';
import React, { useEffect, useState } from "react";
import { Tag } from '../../components/Tag';
import { MultiScenarioProjects } from 'components/RetoolChartsBlock/MultiScenarioProjects';
import { CPPP } from 'components/RetoolChartsBlock/CPPP';
import { ScenarioSummaryTables } from 'components/RetoolChartsBlock/ScenarioSummaryTables';
import { ROITable } from 'components/RetoolChartsBlock/ROITable';
import { Requirements } from 'components/RetoolChartsBlock/Requirements';
import { Workdays } from 'components/RetoolChartsBlock/Workdays';
import { Materials } from 'components/RetoolChartsBlock/Materials';
import { ComparisonChartModal } from 'components/ComparisonChartModal/ComparisonChartModal';
import { Variables } from 'components/RetoolChartsBlock/Variables';
import { useParams } from 'react-router-dom';
import { Pruning } from 'components/RetoolChartsBlock/Pruning';
import { NodeCompletion } from 'components/RetoolChartsBlock/NodeCompletion';
import { Tab } from 'components/Tab';
import { useSelector } from 'react-redux';
import { selectDashboard } from 'store/reducers/dashboardSlice';
import { useDispatch } from 'react-redux';
import { deleteItemInComparisonData, selectComparisonData } from 'store/reducers/comparisonSlice';

interface Props {

}

export const Charts: React.FC<Props> = () => {
    const { areaId: areaIdRTX,
        scenarioId: scenarioIdRTX,
        projectsId: projectsIdRTX } = useSelector(selectDashboard);
    const comparisonData = useSelector(selectComparisonData);

    const dispatch = useDispatch();


    const [areaId, setAreaId] = useState<number>(areaIdRTX);
    const [scenarioId, setScenarioId] = useState<number[]>([scenarioIdRTX]);
    const [projectId, setProjectId] = useState<number[]>(projectsIdRTX);

    const [isModalShown, setIsModalShown] = useState<boolean>();
    const [isEditMode, setEditMode] = useState<boolean>(false);
    const [editId, setEditId] = useState<string>('');

    const [averageVoucherValue, setAverageVoucherValue] = useState<number>(1000);
    const [averageOPPPPerAnnum, setAverageOPPPPerAnnum] = useState<number>(0.00);

    const [revenuePeriod, setRevenuePeriod] = useState<number>(6);
    const [CPPPAssetValue1, setCPPPAssetValue1] = useState<number>(1500.00);
    const [CPPCAssetValue, setCPPCAssetValue] = useState<number>(3000.00);
    const [borrowingCouponRate, setBorrowingCouponRate] = useState<number>(0.12);

    useEffect(() => {
        setAreaId(areaIdRTX)
    }, [areaIdRTX]);

    useEffect(() => {
        setScenarioId([scenarioIdRTX])
    }, [scenarioIdRTX]);

    useEffect(() => {
        setProjectId(projectsIdRTX)
    }, [projectsIdRTX]);


    const handleDelete = (id: string) => {
        dispatch(deleteItemInComparisonData(id));
    };

    const handleEdit = (id: string) => {
        setIsModalShown(true);
        setEditMode(true);
        setEditId(id);
    };

    const tagsJSX = comparisonData?.map((el: any) => {
        const { area, projects, scenario, id } = el;

        return <Tag
            key={id}
            id={id}
            areaName={area.label}
            scenarioName={scenario.label}
            projectName={(Array.isArray(projects) && projects.length) ? projects[0].label : 'All projects'}
            onDelete={() => handleDelete(id)}
            onEdit={() => handleEdit(id)}
        />
    });

    const tabConfig = [
        {
            label: 'By Scenario',
            key: 'By_Scenario_Requirements',
            children:
                <>
                    <div className={styles.scrolledContent}>
                        <Requirements
                            areaId={areaId as number}
                            scenarioIds={scenarioId || []}
                            projectIds={projectId || []}
                            isScenario
                            comparisonData={comparisonData}
                        />

                        <Materials areaId={areaId as number}
                            scenarioIds={scenarioId || []}
                            projectIds={projectId || []}
                            isScenario
                            comparisonData={comparisonData} />
                        <Workdays
                            areaId={areaId as number}
                            scenarioIds={scenarioId || []}
                            projectIds={projectId || []}
                            isScenario

                            comparisonData={comparisonData}
                        />
                    </div>
                </>
        },
        {
            label: 'By Project',
            key: 'By_Project_Requirements',
            children:
                <>
                    <div className={styles.scrolledContent}>
                        <Requirements
                            areaId={areaId as number}
                            scenarioIds={scenarioId || []}
                            projectIds={projectId || []}
                            isProject
                            comparisonData={comparisonData}
                        />

                        <Materials areaId={areaId as number}
                            scenarioIds={scenarioId || []}
                            projectIds={projectId || []}
                            isProject
                            comparisonData={comparisonData} />

                        <Workdays
                            areaId={areaId as number}
                            scenarioIds={scenarioId || []}
                            projectIds={projectId || []}
                            isProject

                            comparisonData={comparisonData}
                        />
                    </div>
                </>
        }
    ]

    return <>
        <div className={styles.comparisonSection}>
            <button className={styles.button} onClick={() => setIsModalShown(true)}>
                <span className={styles.plus} />Add Comparison
            </button>
            {tagsJSX}
        </div>
        <div>
            <Variables
                setAverageOPPPPerAnnum={setAverageOPPPPerAnnum}
                setAverageVoucherValue={setAverageVoucherValue}
                setRevenuePeriod={setRevenuePeriod}
                setCPPPAssetValue1={setCPPPAssetValue1}
                setCPPCAssetValue={setCPPCAssetValue}
                setBorrowingCouponRate={setBorrowingCouponRate}
                averageVoucherValue={averageVoucherValue}
                averageOPPPPerAnnum={averageOPPPPerAnnum}
                revenuePeriod={revenuePeriod}
                CPPPAssetValue1={CPPPAssetValue1}
                CPPCAssetValue={CPPCAssetValue}
                borrowingCouponRate={borrowingCouponRate}
            />
        </div>
        <ScenarioSummaryTables areaId={areaId as number}
            scenarioIds={scenarioId || []}
            projectIds={projectId || []}

            comparisonData={comparisonData}
            variables={{
                averageVoucherValue: averageVoucherValue,
                avgOpppPa: averageOPPPPerAnnum,
                revenuePeriod: revenuePeriod,
                cpppAssetValue: CPPPAssetValue1,
                couponRate: borrowingCouponRate,
                cppcAssetvalue: CPPCAssetValue,
            }}
        />
        <CPPP areaId={areaId as number}
            scenarioIds={scenarioId || []}
            projectIds={projectId || []}

            comparisonData={comparisonData}
            variables={{
                averageVoucherValue: averageVoucherValue,
                avgOpppPa: averageOPPPPerAnnum,
                revenuePeriod: revenuePeriod,
                cpppAssetValue: CPPPAssetValue1,
                couponRate: borrowingCouponRate,
                cppcAssetvalue: CPPCAssetValue,
            }} />
        <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>TEMP: Multi Scenario Project Plots</h2>

            </div>
            <div className={styles.chartBody}>
                <MultiScenarioProjects
                    areaId={areaId as number}
                    scenarioIds={scenarioId || []}
                    projectIds={projectId || []}

                    comparisonData={comparisonData}

                    variables={{
                        averageVoucherValue: averageVoucherValue,
                        avgOpppPa: averageOPPPPerAnnum,
                        revenuePeriod: revenuePeriod,
                        cpppAssetValue: CPPPAssetValue1,
                        couponRate: borrowingCouponRate,
                        cppcAssetvalue: CPPCAssetValue,
                    }} />
            </div>
        </div>
        <ROITable areaId={areaId as number}
            scenarioIds={scenarioId || []}
            projectIds={projectId || []}

            comparisonData={comparisonData}
            variables={{
                averageVoucherValue: averageVoucherValue,
                avgOpppPa: averageOPPPPerAnnum,
                revenuePeriod: revenuePeriod,
                cpppAssetValue: CPPPAssetValue1,
                couponRate: borrowingCouponRate,
                cppcAssetvalue: CPPCAssetValue,
            }} />


        <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>Cashflow, Customers, Materials & Workday Requirements</h2>
            </div>
            <div className={styles.chartBody}>
                <div className={styles.download}>
                </div>
                <Tab config={tabConfig} defaultValue='By_Scenario_Requirements' />

            </div>
        </div>
        <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>Project Pruning</h2>
            </div>
            <div className={styles.chartBody}>
                <div className={styles.download}>
                </div>
                <Pruning areaId={areaId as number}
                    scenarioIds={scenarioId || []}
                    projectIds={projectId || []}

                    comparisonData={comparisonData} />
            </div>
        </div>
        <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>Node Completion</h2>

            </div>
            <div className={styles.chartBody}>
                <NodeCompletion
                    areaId={areaId as number}
                    scenarioIds={scenarioId || []}
                    projectIds={projectId || []}

                    comparisonData={comparisonData}
                />
            </div>
        </div>
        {isModalShown && <ComparisonChartModal
            onClose={() => {
                setIsModalShown(false);
                setEditMode(false);
                setEditId('');
            }}
            isEditMode={isEditMode}
            editId={editId}
        />}
    </>
}