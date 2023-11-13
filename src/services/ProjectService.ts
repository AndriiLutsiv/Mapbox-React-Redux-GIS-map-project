import { GetProjects, GetProjectsResponse } from '../models/Project';
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from './createBaseQueryWithAuth';

export const projectAPI = createApi({
    reducerPath: 'projectAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_API_URL}`),
    tagTypes: ['Create', 'Delete', 'Update'],
    endpoints: (build) => ({
        getProjects: build.query<GetProjectsResponse, GetProjects>({
            query: ({scenario_uuid}) => ({
                url: `/projects/${scenario_uuid}`,
                method: 'GET',
            }),
            providesTags: result => ['Create', 'Delete', 'Update']
        }),
    })
})
