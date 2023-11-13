import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { PruneResultResponse } from "models/ProjectPruning";
import { createBaseQueryWithAuth } from "./createBaseQueryWithAuth";

export const pruningAPI = createApi({
    reducerPath: 'pruningAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
    endpoints: (builder) => ({
        getPruning: builder.query<PruneResultResponse, {params: string}>({
            query: ({params}) => {

                return {
                    url: `/prune-results?${params}`,
                    method: 'GET',
                }
            },
        }),
    }),
})
