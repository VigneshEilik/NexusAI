const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            status: 'error',
            message: message || 'Too many requests from this IP, please try again later.',
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// General API limiter
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100);

// Auth routes limiter (more restrictive)
const authLimiter = createRateLimiter(
    15 * 60 * 1000,
    20,
    'Too many login attempts, please try again after 15 minutes.'
);

// AI chat limiter
const aiLimiter = createRateLimiter(
    60 * 1000,
    10,
    'AI request limit reached. Please wait a moment before trying again.'
);

module.exports = { apiLimiter, authLimiter, aiLimiter, createRateLimiter };
