const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Workspace name is required'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscriptionPlan: {
        type: String,
        enum: ['free', 'starter', 'pro', 'enterprise'],
        default: 'free'
    },
    settings: {
        timezone: { type: String, default: 'UTC' },
        currency: { type: String, default: 'USD' }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

workspaceSchema.index({ slug: 1 });

module.exports = mongoose.model('Workspace', workspaceSchema);
