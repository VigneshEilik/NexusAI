import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    reports: [],
    currentReport: null,
    isUploading: false,
    uploadProgress: 0,
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setReports: (state, action) => {
            state.reports = action.payload;
        },
        setCurrentReport: (state, action) => {
            state.currentReport = action.payload;
        },
        addReport: (state, action) => {
            state.reports.unshift(action.payload);
        },
        removeReport: (state, action) => {
            state.reports = state.reports.filter((r) => r._id !== action.payload);
        },
        setUploading: (state, action) => {
            state.isUploading = action.payload;
        },
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
    },
});

export const {
    setReports, setCurrentReport, addReport,
    removeReport, setUploading, setUploadProgress,
} = analyticsSlice.actions;
export default analyticsSlice.reducer;
