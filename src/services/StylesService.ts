import { GetStylesResponse, GetStyleResponse, Style, CreateStyleResponse, CreateStyle, UpdateStyleResponse, UpdateStyle } from 'models/Styles';
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from './createBaseQueryWithAuth';

export const stylesAPI = createApi({
    reducerPath: 'stylesAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_API_URL}`),
    tagTypes: ['Create', 'Update'],
    endpoints: (build) => ({
        getStyles: build.query<GetStylesResponse, void>({
            query: () => ({
                url: `/styles`,
                method: 'GET'
            }),
            providesTags: result => ['Create', 'Update']
        }),

        getStyle: build.query<GetStyleResponse, string>({
            query: (layer) => ({
                url: `/style/${layer}`,
                method: 'GET'
            }),
        }),

        createStyle: build.mutation<CreateStyleResponse, CreateStyle>({
            query: (body) => ({
                url: `/style`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Create'],
        }),

        updateStyle: build.mutation<UpdateStyleResponse, UpdateStyle>({
            query: (body) => ({
                url: `/style`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Update']
        }),

    })
})
