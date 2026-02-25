const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    type: {
        type: String,
        enum: ['ai_request', 'row_processed', 'pipeline_run'],
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

usageLogSchema.index({ workspace: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model('UsageLog', usageLogSchema);
