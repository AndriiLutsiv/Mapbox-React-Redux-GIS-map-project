import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { ProjectReportResponse } from "models/ProjectReport";
import { createBaseQueryWithAuth } from "./createBaseQueryWithAuth";

export const projectReportAPI = createApi({
    reducerPath: 'projectReportAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
    endpoints: (builder) => ({
        getProjectReport: builder.query<ProjectReportResponse, void>({
            query: () => {

                return {
                    url: `/projects`,
                    method: 'GET',
                }
               
            },
        }),
    }),
})