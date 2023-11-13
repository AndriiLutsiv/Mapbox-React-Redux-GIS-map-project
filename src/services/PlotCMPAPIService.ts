import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from './createBaseQueryWithAuth';

export const plotCMPAPI = createApi({
    reducerPath: 'plotCMPAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
    endpoints: (builder) => ({
        getCMP: builder.query<any, {params: string}>({
            query: ({params}) => {

                return {
                    url: `/plots/cmp?${params}`,
                    method: 'GET',
                };
            },
        }),
    }),
})
