export interface Workforce {
  role: string,
  workers_needed: number,
  cpm_work_days: number,
  total_work_days: number,
  project_id?:number,
  project?: string
  }

export type WorkforceResponse = Workforce[];