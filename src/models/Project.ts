//get projects
export interface Project {
    name: string,
    scenario_uuid: string,
    uuid: string,
    num_of_properties: number,
    head_end: string
}

export interface GetProjects {
    scenario_uuid: string;
}

export type GetProjectsResponse = Project[];