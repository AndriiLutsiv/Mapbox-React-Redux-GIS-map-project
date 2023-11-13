export interface ProjectSummaryReport {
    uprn_count: number,
    total_capex: number,
    avg_cppp: number,
    total_opex_per_annum: number,
    avg_oppp_per_annum: number,
    roi: number,
    vouchers_in_dense: number,
    vouchers_in_rural: number,
    total_vouchers: number,
    total_uprns_within_75m_of_dn: number,
    omr_grey_count: number,
    omr_black_count: number,
    omr_under_review_count: number,
    omr_white_count: number,
    project_id?: number,
    project?: string,
    project_name?: string;
}

export interface GetProjectSummaryReport {
    aggregate_projects:boolean,
    scenario_ids: string
}

export type ProjectSummaryReportResponse = ProjectSummaryReport[];