import { GetScenarios, GetScenariosResponse, Scenario, UpdateScenario } from '../models/Scenario';
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from './createBaseQueryWithAuth';

export const scenarioAPI = createApi({
    reducerPath: 'scenarioAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_API_URL}`),
    tagTypes: ['Create', 'Delete', 'Update'],
    endpoints: (build) => ({
        getScenarios: build.query<GetScenariosResponse, GetScenarios>({
            query: ({area_uuid}) => ({
                url: `/scenarios/${area_uuid}`,
                method: 'GET',
            }),
            providesTags: result => ['Create', 'Delete', 'Update']
        }),

        updateScenario: build.mutation<Scenario, UpdateScenario>({
            query: (body) => ({
                url: `/scenario`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Update']
        }),
    })
})
