import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { ProjectSummaryReportResponse } from "models/ProjectSummaryReport";
import { createBaseQueryWithAuth } from "./createBaseQueryWithAuth";

export const projectSummaryReportAPI = createApi({
    reducerPath: 'projectSummaryReportAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
    endpoints: (builder) => ({
        getProjectReport: builder.query<ProjectSummaryReportResponse, {params: string}>({
            query: ({params} ) => {

                return {
                    url: `/project-summary?${params}`,
                    method: 'GET',
                }
            },
        }),
    }),
})
