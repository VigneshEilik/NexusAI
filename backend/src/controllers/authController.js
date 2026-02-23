const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const config = require('../config');
const logger = require('../config/logger');

const signToken = (id) => {
    return jwt.sign({ id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

const signRefreshToken = (id) => {
    return jwt.sign({ id }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
    });
};

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + config.jwt.cookieExpiresIn * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'lax',
    };

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;
    user.refreshToken = undefined;

    res.status(statusCode).json({
        status: 'success',
        data: {
            token,
            refreshToken,
            user,
        },
    });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Email already in use', 400));
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    logger.info(`New user registered: ${email}`);
    createSendToken(user, 201, req, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError('Invalid email or password', 401));
    }

    if (!user.isActive) {
        return next(new AppError('Your account has been deactivated', 401));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    logger.info(`User logged in: ${email}`);
    createSendToken(user, 200, req, res);
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
exports.logout = asyncHandler(async (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
    });
});

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh-token
exports.refreshToken = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError('Refresh token is required', 400));
    }

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
        return next(new AppError('User not found', 401));
    }

    createSendToken(user, 200, req, res);
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

// @desc    Update profile
// @route   PATCH /api/v1/auth/profile
exports.updateProfile = asyncHandler(async (req, res) => {
    const { name, avatar, preferences } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

// @desc    Change password
// @route   PATCH /api/v1/auth/change-password
exports.changePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
        return next(new AppError('Current password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    logger.info(`User changed password: ${user.email}`);
    createSendToken(user, 200, req, res);
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('No user found with that email address', 404));
    }

    // In production, generate reset token and send email
    // For now, return a success message
    res.status(200).json({
        status: 'success',
        message: 'Password reset instructions sent to email',
    });
});
