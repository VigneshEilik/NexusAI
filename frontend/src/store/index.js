import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import analyticsReducer from './slices/analyticsSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import uiReducer from './slices/uiSlice';
import { authApi } from './api/authApi';
import { chatApi } from './api/chatApi';
import { analyticsApi } from './api/analyticsApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        analytics: analyticsReducer,
        subscription: subscriptionReducer,
        ui: uiReducer,
        [authApi.reducerPath]: authApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [analyticsApi.reducerPath]: analyticsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(
            authApi.middleware,
            chatApi.middleware,
            analyticsApi.middleware
        ),
    devTools: import.meta.env.DEV,
});

export default store;
