import { createApi } from "@reduxjs/toolkit/dist/query/react";
import {  TasksResponse } from "models/Task";
import { createBaseQueryWithAuth } from "./createBaseQueryWithAuth";

export const tasksAPI = createApi({
    reducerPath: 'tasksAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
    endpoints: (builder) => ({
        getTasks: builder.query<TasksResponse, {params: string}>({
            query: ({params}) => {

                return {
                    url: `/tasks?${params}`,
                    method: 'GET',
                }
            },
        }),
    }),
})
