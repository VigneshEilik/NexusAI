const mongoose = require('mongoose');
const UsageLog = require('../models/UsageLog');
const Workspace = require('../models/Workspace');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const logger = require('../config/logger');

/**
 * Usage Metering Service
 *
 * Centralised service for recording and querying workspace usage.
 * Used by workers, services, and the checkPlanLimits middleware.
 */
class UsageMeteringService {

    /**
     * Record a usage event
     * @param {string} workspaceId
     * @param {'ai_request'|'row_processed'|'pipeline_run'} type
     * @param {number} quantity
     * @param {Object} metadata
     */
    async trackUsage(workspaceId, type, quantity = 1, metadata = {}) {
        try {
            await UsageLog.create({ workspace: workspaceId, type, quantity, metadata });
            logger.debug(`Usage tracked: ${type} x${quantity} for workspace ${workspaceId}`);
        } catch (error) {
            logger.error(`Failed to track usage: ${error.message}`);
            // Non-blocking — don't crash the pipeline for metering failures
        }
    }

    /**
     * Get usage summary for current billing period
     * @param {string} workspaceId
     * @returns {{ ai_request, row_processed, pipeline_run }}
     */
    async getCurrentUsage(workspaceId) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const results = await UsageLog.aggregate([
            {
                $match: {
                    workspace: new mongoose.Types.ObjectId(workspaceId),
                    createdAt: { $gte: startOfMonth },
                },
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$quantity' },
                },
            },
        ]);

        const usage = { ai_request: 0, row_processed: 0, pipeline_run: 0 };
        results.forEach(r => { usage[r._id] = r.total; });
        return usage;
    }

    /**
     * Get plan limits for a workspace
     */
    async getPlanLimits(workspaceId) {
        const workspace = await Workspace.findById(workspaceId).lean();
        if (!workspace) return null;

        const plan = await SubscriptionPlan.findOne({ name: workspace.subscriptionPlan }).lean();
        return plan ? plan.limits : null;
    }

    /**
     * Check if a workspace can perform an action
     * @returns {{ allowed: boolean, remaining: number, limit: number, used: number }}
     */
    async checkQuota(workspaceId, usageType) {
        const [usage, limits] = await Promise.all([
            this.getCurrentUsage(workspaceId),
            this.getPlanLimits(workspaceId),
        ]);

        if (!limits) return { allowed: true, remaining: Infinity, limit: Infinity, used: 0 };

        const limitMap = {
            ai_request: limits.aiRequestsPerMonth,
            row_processed: limits.maxRowsPerMonth,
            pipeline_run: limits.maxPipelines,
        };

        const limit = limitMap[usageType] || Infinity;
        const used = usage[usageType] || 0;

        return {
            allowed: used < limit,
            remaining: Math.max(0, limit - used),
            limit,
            used,
        };
    }

    /**
     * Get daily usage breakdown for charts (last 30 days)
     */
    async getDailyBreakdown(workspaceId, days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);

        return UsageLog.aggregate([
            {
                $match: {
                    workspace: new mongoose.Types.ObjectId(workspaceId),
                    createdAt: { $gte: since },
                },
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        type: '$type',
                    },
                    total: { $sum: '$quantity' },
                },
            },
            { $sort: { '_id.date': 1 } },
        ]);
    }
}

module.exports = new UsageMeteringService();
