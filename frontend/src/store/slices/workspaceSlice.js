import { createSlice } from '@reduxjs/toolkit';

const getStoredWorkspace = () => {
    try {
        const ws = localStorage.getItem('nexusai_workspace');
        return ws ? JSON.parse(ws) : null;
    } catch {
        return null;
    }
};

const initialState = {
    workspaces: [],
    activeWorkspace: getStoredWorkspace(),
    members: [],
    usage: null,
    isLoading: false,
    error: null,
};

const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setWorkspaces: (state, action) => {
            state.workspaces = action.payload;
            state.isLoading = false;
        },
        setActiveWorkspace: (state, action) => {
            state.activeWorkspace = action.payload;
            localStorage.setItem('nexusai_workspace', JSON.stringify(action.payload));
        },
        clearActiveWorkspace: (state) => {
            state.activeWorkspace = null;
            localStorage.removeItem('nexusai_workspace');
        },
        setMembers: (state, action) => {
            state.members = action.payload;
        },
        setUsage: (state, action) => {
            state.usage = action.payload;
        },
        setWorkspaceLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setWorkspaceError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const {
    setWorkspaces,
    setActiveWorkspace,
    clearActiveWorkspace,
    setMembers,
    setUsage,
    setWorkspaceLoading,
    setWorkspaceError,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
