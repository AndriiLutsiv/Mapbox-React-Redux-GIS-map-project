import { GetLayers, GetLayersResponse, GetLayer, GetLayerResponse } from './../models/Map';
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from './createBaseQueryWithAuth';

export const mapAPI = createApi({
    reducerPath: 'mapAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_API_URL}`),
    tagTypes: ['Create', 'Delete', 'Update'],
    endpoints: (build) => ({
        getLayers: build.query<GetLayersResponse, GetLayers>({
            query: ({project_uuid}) => ({
                url: `/layers/${project_uuid}`,
                method: 'GET',
            }),
            providesTags: result => ['Create', 'Delete', 'Update']
        }),

        getLayer: build.mutation<GetLayerResponse, GetLayer>({
            query: (body) => ({
                url: `/layer`,
                method: 'POST',
                body: body,
            }),
        }),

    })
})
