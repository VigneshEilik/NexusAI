const { User } = require('../models');
const { Chat } = require('../models');
const { Analytics } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all users (admin)
// @route   GET /api/v1/admin/users
exports.getUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';

    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }
    if (role) filter.role = role;

    const users = await User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
        status: 'success',
        data: {
            users,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        },
    });
});

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/stats
exports.getStats = asyncHandler(async (req, res) => {
    const [totalUsers, activeUsers, totalChats, totalAnalytics] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        Chat.countDocuments(),
        Analytics.countDocuments(),
    ]);

    const usersByPlan = await User.aggregate([
        { $group: { _id: '$subscription.plan', count: { $sum: 1 } } },
    ]);

    const usersByRole = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const recentUsers = await User.find()
        .select('name email role createdAt subscription.plan')
        .sort({ createdAt: -1 })
        .limit(10);

    res.status(200).json({
        status: 'success',
        data: {
            totalUsers,
            activeUsers,
            totalChats,
            totalAnalytics,
            usersByPlan,
            usersByRole,
            recentUsers,
        },
    });
});

// @desc    Update user role (admin)
// @route   PATCH /api/v1/admin/users/:id/role
exports.updateUserRole = asyncHandler(async (req, res, next) => {
    const { role } = req.body;

    if (!['user', 'admin', 'superadmin'].includes(role)) {
        return next(new AppError('Invalid role', 400));
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

// @desc    Toggle user active status (admin)
// @route   PATCH /api/v1/admin/users/:id/toggle-active
exports.toggleUserActive = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

// @desc    Delete user (admin)
// @route   DELETE /api/v1/admin/users/:id
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Also delete user's chats and analytics
    await Promise.all([
        Chat.deleteMany({ user: req.params.id }),
        Analytics.deleteMany({ user: req.params.id }),
    ]);

    res.status(200).json({
        status: 'success',
        message: 'User and associated data deleted',
    });
});
