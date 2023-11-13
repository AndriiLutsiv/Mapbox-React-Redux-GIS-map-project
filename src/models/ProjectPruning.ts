export interface PruneResult {
    scenario_id: 0,
    project_id: 0,
    project: string,
    idx: 0,
    uprn_count: 0,
    total_capex: 0,
    total_opex: 0,
    cppp: 0,
    revenue: 0,
    revenue_norm: 0,
    roi: 0,
    roi_norm: 0,
}

export type PruneResultResponse = PruneResult[];