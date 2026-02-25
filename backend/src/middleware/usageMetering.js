const mongoose = require('mongoose');
const UsageLog = require('../models/UsageLog');
const Workspace = require('../models/Workspace');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');

/**
 * Middleware to check if workspace has remaining quota for an action
 * @param {string} usageType - 'ai_request', 'row_processed', or 'pipeline_run'
 */
const checkPlanLimits = (usageType) => {
    return asyncHandler(async (req, res, next) => {
        const workspaceId = req.workspaceId;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return next(new AppError('Workspace not found', 404));

        const plan = await SubscriptionPlan.findOne({ name: workspace.subscriptionPlan });
        if (!plan) return next(new AppError('Subscription plan not found', 500));

        // Get current month's usage
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const currentUsage = await UsageLog.aggregate([
            {
                $match: {
                    workspace: new mongoose.Types.ObjectId(workspaceId),
                    type: usageType,
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$quantity' }
                }
            }
        ]);

        const totalUsed = currentUsage.length > 0 ? currentUsage[0].total : 0;
        const limitMap = {
            'ai_request': plan.limits.aiRequestsPerMonth,
            'row_processed': plan.limits.maxRowsPerMonth,
            'pipeline_run': plan.limits.maxPipelines
        };

        const limit = limitMap[usageType];

        if (totalUsed >= limit) {
            return next(new AppError(`Workspace has reached the ${usageType} limit for the current month. Please upgrade your plan.`, 403));
        }

        next();
    });
};

module.exports = { checkPlanLimits };
