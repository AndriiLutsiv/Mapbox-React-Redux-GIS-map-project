export interface Task {
  role_task: string,
  work_days: number
}

export type TasksResponse = Task[];