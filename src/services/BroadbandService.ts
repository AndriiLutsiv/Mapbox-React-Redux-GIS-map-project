import { createApi } from "@reduxjs/toolkit/query/react";
import { BroadbandsResponse } from "models/Broadbands";
import { createBaseQueryWithAuth } from './createBaseQueryWithAuth';

export const broadbandAPI = createApi({
    reducerPath: 'broadbandAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
    endpoints: (builder) => ({
        getBroadbands: builder.query<BroadbandsResponse, {params: string}>({
            query: ({params}) => {
                
                return {
                    url: `/demographics/broadband-buckets/?${params}`,
                    method: 'GET',
                };
            },
        }),
    }),
})
