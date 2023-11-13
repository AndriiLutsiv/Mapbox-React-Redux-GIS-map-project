import { createApi } from "@reduxjs/toolkit/query/react";
import { CashflowResponse } from "models/Cashflow";
import { createBaseQueryWithAuth } from "./createBaseQueryWithAuth";

export const cashflowAPI = createApi({
  reducerPath: 'cashflowAPI',
  baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_REPORTS_API_URL}/api/v1`),
  endpoints: (builder) => ({
    getCashflow: builder.query<CashflowResponse, {params: string}>({
      query: ({params}) => {

        return {
          url: `/cashflows?${params}`,
          method: 'GET',
        };
      },
    }),
  }),
})
