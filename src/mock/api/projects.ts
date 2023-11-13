import { rest } from 'msw';
export const data = [
    {
        "name": "project_name_test",
        "scenario_uuid": "cdc4e940-d1b0-44af-b59a-5b3639b4798f",
        "uuid": "project_uuid_1",
        "num_of_properties": 0,
        "head_end": "string"
    },
    {
        "name": "project_name_test",
        "scenario_uuid": "cdc4e940-d1b0-44af-b59a-5b3639b4798f",
        "uuid": "project_uuid_2",
        "num_of_properties": 2,
        "head_end": "string"
    },
    {
        "name": "project_name_test",
        "scenario_uuid": "cdc4e940-d1b0-44af-b59a-5b3639b4798f",
        "uuid": "project_uuid_3",
        "num_of_properties": 3,
        "head_end": "string"
    }
];

export const getProjects = () => {
    return rest.get(`${process.env.REACT_APP_API_URL}/projects/scenario_uuid`, (req: any, res: any, ctx: any) => {
        // successful response
        return res(ctx.status(200), ctx.json(data), ctx.delay(30))
    })
}