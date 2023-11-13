import { User, SignUpTokenResponse, SignUpUser, SignUpUserResponse, CreateUserResponse, CreateUser, GetUsersResponse, DeleteUser, UpdateUser, DeleteUserResponse, UpdateUserResponse, GetUserResponse, GetCurrentUserResponse } from './../models/User';
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from './createBaseQueryWithAuth';

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_API_URL}`),
    tagTypes: ['Create', 'Delete', 'Update'],
    endpoints: (build) => ({
        getSignupToken: build.query<SignUpTokenResponse, void>({
            query: () => ({
                url: `/user/signup/token`,
                method: 'GET'
            }),
        }),

        signupUser: build.mutation<SignUpUserResponse, SignUpUser>({
            query: (body) => ({
                url: `/user/signup`,
                method: 'POST',
                body: body,
            }),
        }),

        getCurrentUser: build.query<GetCurrentUserResponse, void>({
            query: () => ({
                url: `/current_user`,
                method: 'GET'
            }),
        }),

        getUser: build.query<GetUserResponse, string>({
            query: (user_uuid) => ({
                url: `/user/${user_uuid}`,
                method: 'GET'
            }),
        }),

        getUsers: build.query<GetUsersResponse, void>({
            query: () => ({
                url: `/users`,
                method: 'GET'
            }),
            providesTags: result => ['Create', 'Delete', 'Update']
        }),

        createUser: build.mutation<CreateUserResponse, CreateUser>({
            query: (body) => ({
                url: `/user`,
                method: 'PUT',
                body: body,
            }),
            invalidatesTags: ['Create']
        }),

        updateUser: build.mutation<UpdateUserResponse, UpdateUser>({
            query: (body) => ({
                url: `/user`,
                method: 'PATCH',
                body: body,
            }),
            invalidatesTags: ['Update']
        }),

        deleteUser: build.mutation<DeleteUserResponse, DeleteUser>({
            query: (user_uuid) => ({
                url: `/user/${user_uuid}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Delete']
        }),
    })
})
