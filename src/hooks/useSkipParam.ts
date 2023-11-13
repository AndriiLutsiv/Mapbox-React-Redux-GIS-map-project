import { useEffect, useState } from "react";

export const useSkipParam = (areaId: number, scenarioIds?: number[]) => {
    const [skipParam, setSkipParam] = useState<boolean>(true);

    useEffect(() => {
        // console.log(areaId && scenarioIds?.filter((el) => el)?.length, scenarioIds?.filter((el) => el), areaId)
        if(areaId && scenarioIds?.filter((el) => el)?.length) {
            setSkipParam(false);
        }
    }, [areaId, scenarioIds]);

    return {
        skipParam,
        setSkipParam
    };
}