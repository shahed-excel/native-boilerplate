import { API } from '../API/API';

export const authApi = API.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['auth'],
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = authApi;
