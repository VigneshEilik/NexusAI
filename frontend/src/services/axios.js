import axios from 'axios';
import { store } from '../store';
import { logout, setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        const workspace = state.workspace?.activeWorkspace;
        if (workspace?._id) {
            config.headers['x-workspace-id'] = workspace._id;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 - try refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = store.getState().auth.refreshToken;
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
                    const { token, user } = response.data.data;
                    store.dispatch(setCredentials({ token, user, refreshToken }));
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    store.dispatch(logout());
                    toast.error('Session expired. Please login again.');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                store.dispatch(logout());
                window.location.href = '/login';
            }
        }

        // Global error notifications
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        if (error.response?.status !== 401) {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
