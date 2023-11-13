import { rest } from 'msw';
export const data = {
    "username": "string",
    "email": "string",
    "password": "string",
    "token": "string"
};

export const userSignUp = () => {
    return rest.post(`${process.env.REACT_APP_API_URL}/user/signup`, (req: any, res: any, ctx: any) => {
        // successful response
        return res(ctx.status(200), ctx.json(data), ctx.delay(30))
    })
}

export const updateUserData = {
    "uuid": "095be615-a8ad-4c33-8e9c-c7612fbf6c9f",
    "username": "string",
    "password": "string",
    "email": "string",
    "is_active": true,
    "is_superuser": true,
    "company_uuid": "aba69bec-94b3-48e8-9737-4f951465d0f8"
}

export const updateUser = () => {
    return rest.patch(`${process.env.REACT_APP_API_URL}/user`, (req: any, res: any, ctx: any) => {
        // successful response
        return res(ctx.status(200), ctx.json(updateUserData), ctx.delay(30))
    })
}

export const deleteUserData = {
    "success": true,
    "message": "string"
}

export const deleteUser = () => {
    return rest.delete(`${process.env.REACT_APP_API_URL}/user/user_uuid`, (req: any, res: any, ctx: any) => {
        // successful response
        return res(ctx.status(200), ctx.json(deleteUserData), ctx.delay(30))
    })
}

const createUserData = {
    "username": "string",
    "email": "string",
    "password": "string",
    "is_superuser": false,
    "is_active": true,
    "company_uuid": "aba69bec-94b3-48e8-9737-4f951465d0f8",
    "is_admin": false
}

export const createUser = () => {
    return rest.put(`${process.env.REACT_APP_API_URL}/user`, (req: any, res: any, ctx: any) => {
        // successful response
        return res(ctx.status(200), ctx.json(createUserData), ctx.delay(30))
    })
}

export const getUsersData = [
    {
        "username": "username_test",
        "email": "string",
        "is_active": true,
        "is_superuser": false,
        "company_uuid": "aba69bec-94b3-48e8-9737-4f951465d0f8",
        "uuid": "user_uuid_1",
        "is_admin": false
    },
    {
        "username": "username_test",
        "email": "string",
        "is_active": true,
        "is_superuser": false,
        "company_uuid": "aba69bec-94b3-48e8-9737-4f951465d0f8",
        "uuid": "user_uuid_2",
        "is_admin": false
    },
    {
        "username": "username_test",
        "email": "string",
        "is_active": true,
        "is_superuser": false,
        "company_uuid": "aba69bec-94b3-48e8-9737-4f951465d0f8",
        "uuid": "user_uuid_3",
        "is_admin": false
    },
];

export const getUsers = () => {
    return rest.get(`${process.env.REACT_APP_API_URL}/users`, (req: any, res: any, ctx: any) => {
        // successful response
        return res(ctx.status(200), ctx.json(getUsersData), ctx.delay(30))
    })
}