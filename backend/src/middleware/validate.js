const AppError = require('../utils/AppError');

/**
 * Joi validation middleware factory
 * @param {Object} schema - Joi schema object with optional body, params, query keys
 */
const validate = (schema) => (req, res, next) => {
    const validationErrors = [];

    ['params', 'query', 'body'].forEach((key) => {
        if (schema[key]) {
            const { error, value } = schema[key].validate(req[key], {
                abortEarly: false,
                stripUnknown: true,
                allowUnknown: false,
            });

            if (error) {
                validationErrors.push(
                    ...error.details.map((detail) => ({
                        field: detail.path.join('.'),
                        message: detail.message.replace(/['"]/g, ''),
                    }))
                );
            } else {
                req[key] = value;
            }
        }
    });

    if (validationErrors.length > 0) {
        const message = validationErrors.map((e) => `${e.field}: ${e.message}`).join('; ');
        return next(new AppError(message, 400));
    }

    next();
};

module.exports = validate;
