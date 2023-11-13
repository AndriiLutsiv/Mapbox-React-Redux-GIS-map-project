import { rest } from 'msw';
export const data = [
    {
        "uuid": "scenario_uuid_1",
        "area_uuid": "area_uuid_1",
        "name": "scenario_name_test",
        "description": "scenario_description_test",
        "last_updated": "2019-08-24T14:15:22Z",
        "created_on": "2019-08-24T14:15:22Z",
        "starred": false,
        "num_of_projects": 0
    },
    {
        "uuid": "scenario_uuid_2",
        "area_uuid": "area_uuid_1",
        "name": "scenario_name_test",
        "description": "scenario_description_test",
        "last_updated": "2019-08-24T14:15:22Z",
        "created_on": "2019-08-24T14:15:22Z",
        "starred": false,
        "num_of_projects": 0
    },
    {
        "uuid": "scenario_uuid_3",
        "area_uuid": "area_uuid_1",
        "name": "scenario_name_test",
        "description": "scenario_description_test",
        "last_updated": "2019-08-24T14:15:22Z",
        "created_on": "2019-08-24T14:15:22Z",
        "starred": false,
        "num_of_projects": 0
    },
    
];

export const getScenarios = () => {
    return rest.get(`${process.env.REACT_APP_API_URL}/scenarios/area_uuid`, (req: any, res: any, ctx: any) => {
        // successful response
        return res(ctx.status(200), ctx.json(data), ctx.delay(30))
    })
}

export const updateScenario = () => {
    return rest.patch(`${process.env.REACT_APP_API_URL}/scenario`, (req: any, res: any, ctx: any) => {
        // successful response
        return res(ctx.status(200), ctx.json(data), ctx.delay(30))
    })
}