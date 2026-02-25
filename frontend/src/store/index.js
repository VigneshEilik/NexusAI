import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import analyticsReducer from './slices/analyticsSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import uiReducer from './slices/uiSlice';
import workspaceReducer from './slices/workspaceSlice';
import { authApi } from './api/authApi';
import { chatApi } from './api/chatApi';
import { analyticsApi } from './api/analyticsApi';
import { workspaceApi } from './api/workspaceApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        analytics: analyticsReducer,
        subscription: subscriptionReducer,
        ui: uiReducer,
        workspace: workspaceReducer,
        [authApi.reducerPath]: authApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [analyticsApi.reducerPath]: analyticsApi.reducer,
        [workspaceApi.reducerPath]: workspaceApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(
            authApi.middleware,
            chatApi.middleware,
            analyticsApi.middleware,
            workspaceApi.middleware
        ),
    devTools: import.meta.env.DEV,
});

export default store;
