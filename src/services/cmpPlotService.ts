import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from './createBaseQueryWithAuth'; // Adjust the path as necessary

export const cmpPlotAPI = createApi({
    reducerPath: 'cmpPlotAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
    endpoints: (builder) => ({
        getCmpPlotData: builder.query<any, {params: string}>({
            query: ({params}) => {
                
                return {
                    url: `/plots/cmp?${params}`,
                    method: 'GET',
                };
            },
        }),
    }),
})
