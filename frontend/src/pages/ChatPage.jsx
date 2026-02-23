import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSendMessageMutation, useGetChatsQuery } from '../store/api/chatApi';
import { setActiveChat, addMessage, setStreaming, setStreamingContent, clearActiveChat, setChats } from '../store/slices/chatSlice';
import { HiOutlinePaperAirplane, HiOutlineSparkles, HiOutlinePlus, HiOutlineTrash, HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';
import SkeletonLoader from '../components/ui/SkeletonLoader';

const ChatPage = () => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const { activeChat, isStreaming, streamingContent } = useSelector((state) => state.chat);
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const { data: chatsData, isLoading: isLoadingChats } = useGetChatsQuery();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages, streamingContent]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isSending) return;

        const userMessage = input.trim();
        setInput('');

        // Optimistic update
        dispatch(addMessage({ role: 'user', content: userMessage, timestamp: new Date().toISOString() }));
        dispatch(setStreaming(true));
        dispatch(setStreamingContent(''));

        try {
            const result = await sendMessage({
                message: userMessage,
                chatId: activeChat?._id,
            }).unwrap();

            // Simulate streaming effect
            const fullContent = result.data.message.content;
            let i = 0;
            const streamInterval = setInterval(() => {
                if (i < fullContent.length) {
                    const chunk = fullContent.substring(0, i + 3);
                    dispatch(setStreamingContent(chunk));
                    i += 3;
                } else {
                    clearInterval(streamInterval);
                    dispatch(setStreaming(false));
                    dispatch(addMessage({ role: 'assistant', content: fullContent, timestamp: new Date().toISOString() }));
                    dispatch(setStreamingContent(''));

                    if (!activeChat?._id && result.data.chatId) {
                        dispatch(setActiveChat({ _id: result.data.chatId, messages: [], title: userMessage.substring(0, 50) }));
                    }
                }
            }, 15);
        } catch (err) {
            dispatch(setStreaming(false));
            dispatch(addMessage({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date().toISOString() }));
        }
    };

    const handleNewChat = () => {
        dispatch(clearActiveChat());
        inputRef.current?.focus();
    };

    const handleSelectChat = (chat) => {
        dispatch(setActiveChat(chat));
    };

    const messages = activeChat?.messages || [];

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-4 animate-fade-in">
            {/* Chat History Sidebar */}
            <div className="hidden md:flex w-72 flex-col bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl gradient-primary hover:opacity-90 transition-all"
                    >
                        <HiOutlinePlus className="w-4 h-4" />
                        New Chat
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {isLoadingChats ? (
                        <SkeletonLoader type="chat" count={5} />
                    ) : chatsData?.data?.chats?.length > 0 ? (
                        chatsData.data.chats.map((chat) => (
                            <button
                                key={chat._id}
                                onClick={() => handleSelectChat(chat)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors
                  ${activeChat?._id === chat._id
                                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <HiOutlineChatBubbleLeftEllipsis className="w-4 h-4 shrink-0" />
                                    <span className="truncate">{chat.title}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 ml-6">
                                    {new Date(chat.updatedAt).toLocaleDateString()}
                                </p>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <HiOutlineChatBubbleLeftEllipsis className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No chats yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
                    {messages.length === 0 && !isStreaming ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 animate-pulse-glow">
                                <HiOutlineSparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How can I help you today?</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm">
                                I'm your AI assistant. Ask me anything — from data analysis to code review, writing, and beyond.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 w-full max-w-lg">
                                {[
                                    'Analyze my latest sales data',
                                    'Help me write a business proposal',
                                    'Explain machine learning concepts',
                                    'Review my code for best practices',
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}
                                        className="p-3 text-sm text-left text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                    {msg.role !== 'user' && (
                                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                                            <HiOutlineSparkles className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-primary-600 text-white rounded-br-md'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-md'
                                        }`}>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Streaming indicator */}
                            {isStreaming && (
                                <div className="flex gap-3 justify-start animate-fade-in">
                                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                                        <HiOutlineSparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-bl-md bg-slate-100 dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-200 chat-streaming">
                                        <p className="whitespace-pre-wrap chat-content">
                                            {streamingContent || (
                                                <span className="flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSend} className="flex items-end gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                                placeholder="Type your message..."
                                rows={1}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm resize-none"
                                style={{ minHeight: '44px', maxHeight: '120px' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || isSending}
                            className="p-3 rounded-xl gradient-primary text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
                        >
                            <HiOutlinePaperAirplane className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
