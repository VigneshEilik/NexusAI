import { createSlice } from '@reduxjs/toolkit';

const getStoredTheme = () => {
    try {
        return localStorage.getItem('nexusai_theme') || 'light';
    } catch {
        return 'light';
    }
};

const initialState = {
    theme: getStoredTheme(),
    sidebarCollapsed: false,
    sidebarMobileOpen: false,
    isLoading: false,
    modal: {
        isOpen: false,
        type: null,
        data: null,
    },
    toast: {
        show: false,
        message: '',
        type: 'info',
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('nexusai_theme', state.theme);
            if (state.theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('nexusai_theme', action.payload);
        },
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        setSidebarCollapsed: (state, action) => {
            state.sidebarCollapsed = action.payload;
        },
        toggleMobileSidebar: (state) => {
            state.sidebarMobileOpen = !state.sidebarMobileOpen;
        },
        setMobileSidebar: (state, action) => {
            state.sidebarMobileOpen = action.payload;
        },
        setGlobalLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        openModal: (state, action) => {
            state.modal = { isOpen: true, type: action.payload.type, data: action.payload.data };
        },
        closeModal: (state) => {
            state.modal = { isOpen: false, type: null, data: null };
        },
        showToast: (state, action) => {
            state.toast = { show: true, message: action.payload.message, type: action.payload.type || 'info' };
        },
        hideToast: (state) => {
            state.toast = { ...state.toast, show: false };
        },
    },
});

export const {
    toggleTheme, setTheme, toggleSidebar, setSidebarCollapsed,
    toggleMobileSidebar, setMobileSidebar, setGlobalLoading,
    openModal, closeModal, showToast, hideToast,
} = uiSlice.actions;
export default uiSlice.reducer;
