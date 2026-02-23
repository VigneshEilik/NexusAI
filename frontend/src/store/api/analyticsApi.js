import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const analyticsApi = createApi({
    reducerPath: 'analyticsApi',
    baseQuery,
    tagTypes: ['Analytics', 'DashboardStats'],
    endpoints: (builder) => ({
        getAnalytics: builder.query({
            query: (params) => ({
                url: '/analytics',
                params,
            }),
            providesTags: ['Analytics'],
        }),
        getAnalyticsById: builder.query({
            query: (id) => `/analytics/${id}`,
            providesTags: (result, error, id) => [{ type: 'Analytics', id }],
        }),
        uploadCsv: builder.mutation({
            query: (formData) => ({
                url: '/analytics/upload',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Analytics', 'DashboardStats'],
        }),
        deleteAnalytics: builder.mutation({
            query: (id) => ({
                url: `/analytics/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Analytics', 'DashboardStats'],
        }),
        getDashboardStats: builder.query({
            query: () => '/analytics/dashboard/stats',
            providesTags: ['DashboardStats'],
        }),
    }),
});

export const {
    useGetAnalyticsQuery,
    useGetAnalyticsByIdQuery,
    useUploadCsvMutation,
    useDeleteAnalyticsMutation,
    useGetDashboardStatsQuery,
} = analyticsApi;
