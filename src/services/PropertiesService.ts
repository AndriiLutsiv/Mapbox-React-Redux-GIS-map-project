import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { PropertiesResponse } from "models/Properties";
import { createBaseQueryWithAuth } from "./createBaseQueryWithAuth";

export const propertiesAPI = createApi({
    reducerPath: 'propertiesAPI',
    baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
    endpoints: (builder) => ({
        getProperties: builder.query<PropertiesResponse, {params: string}>({
            query: ({params}) => {

                return {
                    url: `/properties?${params}`,
                    method: 'GET',
                }
            },
        }),
    }),
})