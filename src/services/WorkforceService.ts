import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { WorkforceResponse } from "models/Workforce";
import { createBaseQueryWithAuth } from "./createBaseQueryWithAuth";

export const workforceAPI = createApi({
    reducerPath: 'workforceAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
    endpoints: (builder) => ({
        getWorkforce: builder.query<WorkforceResponse, {params: string}>({
            query: ({params}) => {

                return {
                    url: `/work-force?${params}`,
                    method: 'GET',
                }
                
            },
        }),
    }),
})