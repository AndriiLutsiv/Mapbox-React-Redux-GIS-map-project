import { RootState } from '../store/store';
import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { clearToken } from 'store/reducers/tokenSlice';

interface BaseQueryArgs {
  url: string;
  method?: string;
  body?: any;
  headers?: Headers;
  params?: any;
  responseHandler?: (response: Response) => Promise<any>;
  validateStatus?: (response: Response, body: any) => boolean;
}

export const createBaseQueryWithAuth = (baseUrl: string) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).token.value;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  const baseQueryWithAuth: BaseQueryFn<string | BaseQueryArgs, unknown, unknown> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && 'status' in result.error && result.error.status === 401) {
      // If a 401 Unauthorized response is received, dispatch the clearToken action
      api.dispatch(clearToken());
    }

    return result;
  };

  return baseQueryWithAuth;
};
