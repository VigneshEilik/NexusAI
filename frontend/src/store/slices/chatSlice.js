import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chats: [],
    activeChat: null,
    isStreaming: false,
    streamingContent: '',
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
        addChat: (state, action) => {
            state.chats.unshift(action.payload);
        },
        removeChat: (state, action) => {
            state.chats = state.chats.filter((c) => c._id !== action.payload);
            if (state.activeChat?._id === action.payload) {
                state.activeChat = null;
            }
        },
        addMessage: (state, action) => {
            if (state.activeChat) {
                if (!state.activeChat.messages) state.activeChat.messages = [];
                state.activeChat.messages.push(action.payload);
            }
        },
        setStreaming: (state, action) => {
            state.isStreaming = action.payload;
        },
        setStreamingContent: (state, action) => {
            state.streamingContent = action.payload;
        },
        appendStreamingContent: (state, action) => {
            state.streamingContent += action.payload;
        },
        clearActiveChat: (state) => {
            state.activeChat = null;
            state.streamingContent = '';
        },
    },
});

export const {
    setChats, setActiveChat, addChat, removeChat,
    addMessage, setStreaming, setStreamingContent,
    appendStreamingContent, clearActiveChat,
} = chatSlice.actions;
export default chatSlice.reducer;
