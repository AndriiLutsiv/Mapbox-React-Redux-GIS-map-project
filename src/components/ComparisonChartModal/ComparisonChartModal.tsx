import { SelectTemplate } from "components/DashboardToolbar/Select/SelectTemplate";
import { Modal } from "components/Modal";
import styles from "./ComparisonChartModal.module.scss";
import React, { useEffect, useState } from "react";
import { scenarioReportAPI } from "services/ScenarioReportService";
import { projectReportAPI } from "services/ProjectReportService";
import { useDispatch } from "react-redux";
import { addComparisonAreaId, addComparisonData, addComparisonProjectsId, addComparisonScenarioId, editComparisonData } from "store/reducers/comparisonSlice";
import { useSelector } from "react-redux";

interface Props {
    onClose: () => void;
    isEditMode: boolean;
    editId?: string;
}

export const ComparisonChartModal: React.FC<Props> = ({ onClose, isEditMode, editId }) => {
    const dispatch = useDispatch();
    const { comparisonAreaId, comparisonScenarioId, comparisonProjectsId } = useSelector((store: any) => {
        return store.comparison;
    });

    const editObj = useSelector((store: any) => {
        return store.comparison.comparisonData.find((el: any) => el.id === editId);
    });

    const [modalError, setModalError] = useState<boolean>(false);
    const { data: scenarioReportData = [], isLoading: scenarioReportLoading, error } = scenarioReportAPI.useGetScenarioReportQuery();
    const { data: projectReportData = [], isLoading: projectReportLoading, error: projectReportError } = projectReportAPI.useGetProjectReportQuery();

    useEffect(() => {
        if (editId) {
            dispatch(addComparisonAreaId(editObj?.area.value));
            dispatch(addComparisonScenarioId(editObj?.scenario.value));
            dispatch(addComparisonProjectsId(editObj?.projects.map((el: any) => el.value)));
        }
    }, [editId]);


    const handleClose = () => {
        onClose();
        dispatch(addComparisonAreaId(null));
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

    const scenarioOptions: { value: number; label: string; }[] = scenarioReportData.filter((el) => el.area_id === comparisonAreaId).map((element) => {
        return {
            value: element.id,
            label: element.label
        }
    });

    const projectsOptions: { value: number; label: string; }[] = projectReportData.filter((el) => el.scenario_id === comparisonScenarioId).map((element) => {
        return {
            value: element.id,
            label: element.project
        }
    });

    const handleSubmit = () => {
        if (comparisonScenarioId === null || comparisonAreaId === null) {
            setModalError(true);
            return;
            
        } else {
            setModalError(false);
        }
        dispatch(addComparisonData({
            area: areaOptions.find((el) => el.value === comparisonAreaId),
            scenario: scenarioOptions.find((el) => el.value === comparisonScenarioId),
            projects: projectsOptions.filter((el) => comparisonProjectsId.includes(el.value))
        }));
        handleClose();
    };
    const handleEdit = () => {
        if (comparisonScenarioId === null || comparisonAreaId === null) {
            setModalError(true);
            return;
        } else {
            setModalError(false);
        }

        dispatch(editComparisonData({
            id: editId,
            area: areaOptions.find((el) => el.value === comparisonAreaId),
            scenario: scenarioOptions.find((el) => el.value === comparisonScenarioId),
            projects: projectsOptions.filter((el) => comparisonProjectsId.includes(el.value))
        }));

        handleClose();
    };

    return <Modal className={styles.comparisonModal} onClose={handleClose} >
        <div className={styles.close} onClick={handleClose}></div>
        <h1 className={styles.title}>{isEditMode ? 'Edit comparison' : 'Add comparison'}</h1>
        <h2 className={styles.subtitle}>Compare XYZ...</h2>
        <div className={styles.select}>
            <SelectTemplate gapBottom isBlock data={areaOptions} width={'100%'}
                label={'Area:'}
                value={comparisonAreaId}
                onChange={(value) => {
                    dispatch(addComparisonAreaId(value));
                }}
            />
            <SelectTemplate gapBottom isBlock data={scenarioOptions} width={'100%'}
                label={'Scenario:'} value={comparisonScenarioId} onChange={(value) => {
                    dispatch(addComparisonScenarioId(value));
                }} />

            <SelectTemplate gapBottom isBlock data={projectsOptions} width={'100%'}
                label={'Project name:'} value={comparisonProjectsId} onChange={(value) => {
                    dispatch(addComparisonProjectsId([value]));

                }} />

            {
                modalError && <p className={styles.modalError}>Select at least area and scenario</p>
            }
        </div>
        <div className={styles.modalBottom}>
            <button className={styles.buttonAdd} onClick={!isEditMode ? handleSubmit : handleEdit}>
                {isEditMode ? 'Edit' : 'Add'}
            </button>

            <button className={styles.buttonCancel} onClick={handleClose}>Cancel</button>
        </div>
    </Modal>
}