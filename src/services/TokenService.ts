import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "./createBaseQueryWithAuth";

export const tokenAPI = createApi({
  reducerPath: 'tokenAPI',
  baseQuery: createBaseQueryWithAuth(`${process.env.REACT_APP_API_URL}`),
  tagTypes: ['Token'],
  endpoints: (build) => ({
    fetchLoginToken: build.mutation<URLSearchParams, URLSearchParams>({
      query: (body) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Accept', 'application/json');

        return {
          url: `/oauth/token`,
          method: 'POST',
          body,
          headers,
        };
      },
      invalidatesTags: ['Token']
    }),
  })
})
