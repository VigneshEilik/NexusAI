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
        const workspace = getState().workspace.activeWorkspace;
        if (workspace?._id) {
            headers.set('x-workspace-id', workspace._id);
        }
        return headers;
    },
});

export const workspaceApi = createApi({
    reducerPath: 'workspaceApi',
    baseQuery,
    tagTypes: ['Workspace', 'Members', 'Usage', 'Pipelines'],
    endpoints: (builder) => ({
        // Workspaces
        getWorkspaces: builder.query({
            query: () => '/workspaces',
            providesTags: ['Workspace'],
        }),
        createWorkspace: builder.mutation({
            query: (body) => ({
                url: '/workspaces',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Workspace'],
        }),
        updateWorkspace: builder.mutation({
            query: ({ workspaceId, ...body }) => ({
                url: `/workspaces/${workspaceId}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Workspace'],
        }),

        // Members
        getMembers: builder.query({
            query: (workspaceId) => `/workspaces/${workspaceId}/members`,
            providesTags: ['Members'],
        }),
        inviteMember: builder.mutation({
            query: ({ workspaceId, ...body }) => ({
                url: `/workspaces/${workspaceId}/members`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Members'],
        }),
        removeMember: builder.mutation({
            query: ({ workspaceId, userId }) => ({
                url: `/workspaces/${workspaceId}/members/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Members'],
        }),

        // Usage
        getUsage: builder.query({
            query: (workspaceId) => `/workspaces/${workspaceId}/usage`,
            providesTags: ['Usage'],
        }),

        // Pipelines
        getPipelines: builder.query({
            query: (params) => ({
                url: '/pipelines',
                params,
            }),
            providesTags: ['Pipelines'],
        }),
        uploadCsvPipeline: builder.mutation({
            query: (formData) => ({
                url: '/pipelines/upload-csv',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Pipelines', 'Usage'],
        }),
    }),
});

export const {
    useGetWorkspacesQuery,
    useCreateWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useGetMembersQuery,
    useInviteMemberMutation,
    useRemoveMemberMutation,
    useGetUsageQuery,
    useGetPipelinesQuery,
    useUploadCsvPipelineMutation,
} = workspaceApi;
