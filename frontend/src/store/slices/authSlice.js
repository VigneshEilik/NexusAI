import { createSlice } from '@reduxjs/toolkit';

const getStoredToken = () => {
    try {
        return localStorage.getItem('nexusai_token') || null;
    } catch {
        return null;
    }
};

const getStoredUser = () => {
    try {
        const user = localStorage.getItem('nexusai_user');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

const initialState = {
    user: getStoredUser(),
    token: getStoredToken(),
    refreshToken: null,
    isAuthenticated: !!getStoredToken(),
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token, refreshToken } = action.payload;
            state.user = user;
            state.token = token;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
            state.error = null;
            localStorage.setItem('nexusai_token', token);
            localStorage.setItem('nexusai_user', JSON.stringify(user));
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('nexusai_user', JSON.stringify(state.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('nexusai_token');
            localStorage.removeItem('nexusai_user');
        },
        setAuthLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setAuthError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { setCredentials, updateUser, logout, setAuthLoading, setAuthError, clearError } = authSlice.actions;
export default authSlice.reducer;
