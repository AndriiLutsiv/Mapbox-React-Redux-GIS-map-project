import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { ScenarioReportResponse } from "models/ScenarioReport";
import { createBaseQueryWithAuth } from "./createBaseQueryWithAuth";

export const scenarioReportAPI = createApi({
    reducerPath: 'scenarioReportAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
    endpoints: (builder) => ({
        getScenarioReport: builder.query<ScenarioReportResponse, void>({
            query: () => {

                return {
                    url: `/scenarios`,
                    method: 'GET',
                }
            },
        }),
    }),
})