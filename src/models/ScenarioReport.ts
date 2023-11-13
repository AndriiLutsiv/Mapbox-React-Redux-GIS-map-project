export interface ScenarioReport {
    area_id:number,
    area_name:string,
    description: string,
    id:number,
    label:string,
}

export type ScenarioReportResponse = ScenarioReport[];