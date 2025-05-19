import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

const baseUrl = 'https://arcbilling-api.arcapps.org/api/v1';

export const API = createApi({
  reducerPath: 'API',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({}),
  tagTypes: ['auth'],
});
