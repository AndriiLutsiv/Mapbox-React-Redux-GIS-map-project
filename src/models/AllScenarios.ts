//get scenarios
export interface Scenario {
    description: string
    id: number
    label: string
    area_id: number
}

export interface GetScenarios {
    client_id: string;
    area_id: string;
}

export type GetScenariosResponse = Scenario[];
