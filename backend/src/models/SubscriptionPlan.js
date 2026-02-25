const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
    name: {
        type: String, // 'free', 'starter', 'pro', 'enterprise'
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    limits: {
        maxUsers: { type: Number, default: 1 },
        maxPipelines: { type: Number, default: 3 },
        maxRowsPerMonth: { type: Number, default: 1000 },
        aiRequestsPerMonth: { type: Number, default: 50 }
    }
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
