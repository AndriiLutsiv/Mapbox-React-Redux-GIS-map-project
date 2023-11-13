import { rest } from 'msw';
export const data = [
    {
        "uuid": "area_uuid_1",
        "name": "areas_name_test",
        "description": "areas_description_test",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        null,
                        null
                    ]
                ]
            ]
        }
    },
    {
        "uuid": "area_uuid_2",
        "name": "areas_name_test",
        "description": "areas_description_test",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        null,
                        null
                    ]
                ]
            ]
        }
    },
    {
        "uuid": "area_uuid_3",
        "name": "areas_name_test",
        "description": "areas_description_test",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        null,
                        null
                    ]
                ]
            ]
        }
    },
];

export const getAreas = () => {
    return rest.get(`${process.env.REACT_APP_API_URL}/areas`, (req: any, res: any, ctx: any) => {
        // successful response
        return res(ctx.status(200), ctx.json(data), ctx.delay(30))
    })
}

export const createAreaData = {
    "name": "string",
    "description": "string",
    "geometry": {
        "type": "Polygon",
        "coordinates": []
    }
}

export const createArea = () => {
    return rest.put(`${process.env.REACT_APP_API_URL}/area`, (req: any, res: any, ctx: any) => {
        // successful response
        return res(ctx.status(200), ctx.json(createAreaData), ctx.delay(30))
    })
}

export const updateAreaData = {
    "uuid": "095be615-a8ad-4c33-8e9c-c7612fbf6c9f",
    "name": "string",
    "description": "string",
    "geometry": {
        "type": "Polygon",
        "coordinates": []
    }
}

export const updateArea = () => {
    return rest.patch(`${process.env.REACT_APP_API_URL}/area`, (req: any, res: any, ctx: any) => {
        // successful response
        return res(ctx.status(200), ctx.json(updateAreaData), ctx.delay(30))
    })
}

export const deleteAreaData = {
    "uuid": "095be615-a8ad-4c33-8e9c-c7612fbf6c9f",
    "name": "string",
    "description": "string",
    "geometry": {
        "type": "Polygon",
        "coordinates": []
    }
}

export const deleteArea = () => {
    return rest.delete(`${process.env.REACT_APP_API_URL}/area/area_uuid`, (req: any, res: any, ctx: any) => {
        // successful response
        return res(ctx.status(200), ctx.json(deleteAreaData), ctx.delay(30))
    })
}