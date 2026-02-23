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

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery,
    tagTypes: ['Chat', 'ChatList'],
    endpoints: (builder) => ({
        getChats: builder.query({
            query: (params) => ({
                url: '/chat',
                params,
            }),
            providesTags: ['ChatList'],
        }),
        getChat: builder.query({
            query: (chatId) => `/chat/${chatId}`,
            providesTags: (result, error, chatId) => [{ type: 'Chat', id: chatId }],
        }),
        createChat: builder.mutation({
            query: (data) => ({
                url: '/chat',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ChatList'],
        }),
        sendMessage: builder.mutation({
            query: (data) => ({
                url: '/chat/message',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result) => [
                'ChatList',
                { type: 'Chat', id: result?.data?.chatId },
            ],
        }),
        deleteChat: builder.mutation({
            query: (chatId) => ({
                url: `/chat/${chatId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ChatList'],
        }),
        archiveChat: builder.mutation({
            query: (chatId) => ({
                url: `/chat/${chatId}/archive`,
                method: 'PATCH',
            }),
            invalidatesTags: ['ChatList'],
        }),
        getAiHealth: builder.query({
            query: () => '/chat/ai/health',
        }),
    }),
});

export const {
    useGetChatsQuery,
    useGetChatQuery,
    useCreateChatMutation,
    useSendMessageMutation,
    useDeleteChatMutation,
    useArchiveChatMutation,
    useGetAiHealthQuery,
} = chatApi;
