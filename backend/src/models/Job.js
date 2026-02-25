const mongoose = require('mongoose');

/**
 * Job Model — MongoDB-based Job Queue
 *
 * Replaces BullMQ + Redis. Uses atomic findOneAndUpdate
 * to claim jobs, preventing double-processing.
 */
const jobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
        index: true,
    },
    priority: {
        type: Number,
        default: 0, // Higher = higher priority
    },
    attempts: {
        type: Number,
        default: 0,
    },
    maxAttempts: {
        type: Number,
        default: 3,
    },
    result: mongoose.Schema.Types.Mixed,
    error: String,
    scheduledAt: {
        type: Date,
        default: Date.now,
    },
    startedAt: Date,
    completedAt: Date,
    lockedUntil: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

// Compound index for efficient job claiming
jobSchema.index({ status: 1, scheduledAt: 1, priority: -1 });
jobSchema.index({ lockedUntil: 1 });

module.exports = mongoose.model('Job', jobSchema);
