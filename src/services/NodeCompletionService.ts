import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from './createBaseQueryWithAuth';
import { NodeCompletionResponse } from "models/NodeCompletion";

export const nodeCompletionAPI = createApi({
    reducerPath: 'nodeCompletionAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
    endpoints: (builder) => ({
        getNodeCompletion: builder.query<NodeCompletionResponse, {params: string}>({
            query: ({params}) => {

                return {
                    url: `/job-sequencing/node-completion?${params}`,
                    method: 'GET',
                };
            },
        }),
    }),
})
