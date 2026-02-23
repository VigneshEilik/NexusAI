const { Chat } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const ollamaService = require('../services/ollamaService');
const logger = require('../config/logger');

// @desc    Get all chats for user
// @route   GET /api/v1/chat
exports.getChats = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const chats = await Chat.find({ user: req.user.id, isArchived: false })
        .select('title model metadata createdAt updatedAt')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Chat.countDocuments({ user: req.user.id, isArchived: false });

    res.status(200).json({
        status: 'success',
        data: {
            chats,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        },
    });
});

// @desc    Get single chat
// @route   GET /api/v1/chat/:chatId
exports.getChat = asyncHandler(async (req, res, next) => {
    const chat = await Chat.findOne({ _id: req.params.chatId, user: req.user.id });

    if (!chat) {
        return next(new AppError('Chat not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { chat },
    });
});

// @desc    Create new chat
// @route   POST /api/v1/chat
exports.createChat = asyncHandler(async (req, res) => {
    const chat = await Chat.create({
        user: req.user.id,
        title: req.body.title || 'New Chat',
        model: req.body.model,
    });

    res.status(201).json({
        status: 'success',
        data: { chat },
    });
});

// @desc    Send message and get AI response
// @route   POST /api/v1/chat/message
exports.sendMessage = asyncHandler(async (req, res, next) => {
    const { message, chatId, model } = req.body;

    let chat;
    if (chatId) {
        chat = await Chat.findOne({ _id: chatId, user: req.user.id });
        if (!chat) {
            return next(new AppError('Chat not found', 404));
        }
    } else {
        // Create new chat with first message as title
        const title = message.length > 50 ? message.substring(0, 50) + '...' : message;
        chat = await Chat.create({
            user: req.user.id,
            title,
            model: model || undefined,
        });
    }

    // Add user message
    chat.messages.push({
        role: 'user',
        content: message,
    });

    // Get AI response
    const messagesForAI = chat.messages.map((m) => ({
        role: m.role,
        content: m.content,
    }));

    try {
        const aiResponse = await ollamaService.chat(messagesForAI, { model: chat.model });

        // Add AI response to chat
        chat.messages.push({
            role: 'assistant',
            content: aiResponse.content,
            tokens: {
                prompt: aiResponse.promptEvalCount,
                completion: aiResponse.evalCount,
            },
        });

        await chat.save();

        res.status(200).json({
            status: 'success',
            data: {
                chatId: chat._id,
                message: {
                    role: 'assistant',
                    content: aiResponse.content,
                },
                fromCache: aiResponse.fromCache || false,
            },
        });
    } catch (error) {
        logger.error('Chat AI error:', error.message);

        // Save user message even if AI fails
        await chat.save();

        return next(new AppError(error.message || 'AI service error', 503));
    }
});

// @desc    Delete chat
// @route   DELETE /api/v1/chat/:chatId
exports.deleteChat = asyncHandler(async (req, res, next) => {
    const chat = await Chat.findOneAndDelete({ _id: req.params.chatId, user: req.user.id });

    if (!chat) {
        return next(new AppError('Chat not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Chat deleted successfully',
    });
});

// @desc    Archive chat
// @route   PATCH /api/v1/chat/:chatId/archive
exports.archiveChat = asyncHandler(async (req, res, next) => {
    const chat = await Chat.findOneAndUpdate(
        { _id: req.params.chatId, user: req.user.id },
        { isArchived: true },
        { new: true }
    );

    if (!chat) {
        return next(new AppError('Chat not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { chat },
    });
});

// @desc    AI health check
// @route   GET /api/v1/chat/ai/health
exports.aiHealth = asyncHandler(async (req, res) => {
    const health = await ollamaService.healthCheck();
    res.status(200).json({
        status: 'success',
        data: health,
    });
});
