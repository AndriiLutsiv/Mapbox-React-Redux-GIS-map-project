import { GetAreasResponse, CreateAreaResponse, CreateArea, GetAreaResponse, DeleteAreaResponse, UpdateAreaResponse, UpdateArea } from './../models/Area';
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from './createBaseQueryWithAuth';

export const areaAPI = createApi({
    reducerPath: 'areaAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_API_URL}`),
    tagTypes: ['Create', 'Delete', 'Update'],
    endpoints: (build) => ({
        getAreas: build.query<GetAreasResponse, void>({
            query: () => ({
                url: `/areas`,
                method: 'GET'
            }),
            providesTags: result => ['Create', 'Delete', 'Update']
        }),

        getArea: build.query<GetAreaResponse, string>({
            query: (area_uuid) => {
                console.log('area', area_uuid)
                return {
                url: `/area/${area_uuid}`,
                method: 'GET'
            }
        },
            providesTags: result => ['Update']
        }),

        createArea: build.mutation<CreateAreaResponse, CreateArea>({
            query: (body) => ({
                url: `/area`,
                method: 'PUT',
                body: body,
            }),
            invalidatesTags: ['Create'],
        }),

        updateArea: build.mutation<UpdateAreaResponse, UpdateArea>({
            query: (body) => ({
                url: `/area`,
                method: 'PATCH',
                body: body,
            }),
            invalidatesTags: ['Update']
        }),

        deleteArea: build.mutation<DeleteAreaResponse, string>({
            query: (area_uuid) => ({
                url: `/area/${area_uuid}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Delete']
        }),
    })
})