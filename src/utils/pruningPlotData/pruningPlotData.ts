import { PruneResult } from "models/ProjectPruning";

export const pruningPlotData = (data: PruneResult[]) => {
    const uprnRoiRevDiffs = data.map(v => v.roi_norm - v.revenue_norm);
    const uprnRoiRevMaxIdx = uprnRoiRevDiffs.indexOf(Math.min(...uprnRoiRevDiffs));
    const uprnRoiRevMaxValue = uprnRoiRevMaxIdx >= 0 && data[uprnRoiRevMaxIdx].uprn_count;

    return { data, uprnRoiRevMaxValue: uprnRoiRevMaxValue };
}