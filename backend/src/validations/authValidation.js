const Joi = require('joi');

const register = {
    body: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(128).required()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .message('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({ 'any.only': 'Passwords do not match' }),
    }),
};

const login = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
};

const updateProfile = {
    body: Joi.object({
        name: Joi.string().min(2).max(50),
        avatar: Joi.string().uri().allow(''),
        preferences: Joi.object({
            theme: Joi.string().valid('light', 'dark', 'system'),
            notifications: Joi.boolean(),
            language: Joi.string().max(5),
        }),
    }),
};

const changePassword = {
    body: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).max(128).required()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .message('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
        confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
            .messages({ 'any.only': 'Passwords do not match' }),
    }),
};

const forgotPassword = {
    body: Joi.object({
        email: Joi.string().email().required(),
    }),
};

module.exports = {
    register,
    login,
    updateProfile,
    changePassword,
    forgotPassword,
};
