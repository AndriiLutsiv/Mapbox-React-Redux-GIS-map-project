export interface ProjectReport {
    id: number,
    scenario_id: number,
    project: string
}

export type ProjectReportResponse = ProjectReport[];