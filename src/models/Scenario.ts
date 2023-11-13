//get scenarios
export interface Scenario {
    uuid: string
    area_uuid: string
    name: string
    description: string
    last_updated: string
    created_on: string
    starred: boolean
    num_of_projects: number
}

export interface GetScenarios {
    area_uuid: string;
}

export type GetScenariosResponse = Scenario[];

//update scenario
export interface UpdateScenario {
    uuid: string,
    area_uuid?: string,
    name?: string,
    description?: string,
    starred?: boolean
}

export type UpdateScenarioResponse = Scenario[]