import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from './createBaseQueryWithAuth';
import { MaterialsResponse } from "models/Materials";

export const materialsAPI = createApi({
    reducerPath: 'materialsAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
    endpoints: (builder) => ({
        getMaterials: builder.query<MaterialsResponse, {params: string}>({
            query: ({params}) => {

                return {
                    url: `/materials?${params}`,
                    method: 'GET',
                };
            },
        }),
    }),
})
