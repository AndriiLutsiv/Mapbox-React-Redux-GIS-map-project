import { useEffect, useState } from "react";

export const useDataHook = () => {

    // const [modalData, setModalData] = useState<any>([])
    const [modalData, setModalData] = useState<any>([])
    const [areaId, setAreaId] = useState<any>();
    const [projectId, setProjectId] = useState<any>([]);
    const [scenarioId, setScenarioId] = useState<any>([]);
    const [skipParam, setSkipFalse] = useState(true);
    const [compare, setCompareMode] = useState(true);

    useEffect(() => {
        localStorage.removeItem('scenario_id');
        setScenarioId([]);
        localStorage.removeItem('project_ids');
        setProjectId([]);
        // localStorage.removeItem('modal_data');
        // setModalData([]);

        const areasIdListener = (event: CustomEvent<number>) => {
            setAreaId(event.detail);
        };

        window.addEventListener('AREA_ID', areasIdListener as EventListener);

        return () => {
            window.removeEventListener('AREA_ID', areasIdListener as EventListener);
        }
    }, [areaId]);

    useEffect(() => {
        localStorage.removeItem('project_ids');
        setProjectId([]);

        const areasIdListener = (event: CustomEvent<number>) => {
            setScenarioId(event.detail);
        };

        window.addEventListener('SCENARIO_ID', areasIdListener as EventListener);

        return () => {
            window.removeEventListener('SCENARIO_ID', areasIdListener as EventListener);
        }
    }, [scenarioId]);

    useEffect(() => {
        const areasIdListener = (event: CustomEvent<number[]>) => {
            setProjectId(event.detail);
        };

        window.addEventListener('PRJS_ID', areasIdListener as EventListener);

        return () => {
            window.removeEventListener('PRJS_ID', areasIdListener as EventListener);
        }
    }, [projectId]);

    useEffect(() => {
        setSkipFalse(false);
    }, [areaId])

    return {
        modalData,
        skipParam,
        compare,
        projectId,
        areaId,
        scenarioId,
        setCompareMode,
        setAreaId,
        setProjectId,
        setModalData,
        setScenarioId
    }
}