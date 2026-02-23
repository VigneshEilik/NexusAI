const Joi = require('joi');

const sendMessage = {
    body: Joi.object({
        message: Joi.string().min(1).max(10000).required(),
        chatId: Joi.string().hex().length(24),
        model: Joi.string().max(50),
    }),
};

const createChat = {
    body: Joi.object({
        title: Joi.string().max(200),
        model: Joi.string().max(50),
    }),
};

const getChatParams = {
    params: Joi.object({
        chatId: Joi.string().hex().length(24).required(),
    }),
};

module.exports = {
    sendMessage,
    createChat,
    getChatParams,
};
