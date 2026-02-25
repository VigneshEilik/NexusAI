const mongoose = require('mongoose');

const pipelineSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dataSource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DataSource',
        required: true
    },
    schedule: {
        type: String,
        enum: ['manual', 'hourly', 'daily', 'weekly'],
        default: 'manual'
    },
    lastRunAt: Date,
    nextRunAt: Date,
    status: {
        type: String,
        enum: ['active', 'paused', 'running', 'failed'],
        default: 'active'
    },
    config: {
        aiPrompt: String,
        transformationRules: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

pipelineSchema.index({ workspace: 1 });
pipelineSchema.index({ nextRunAt: 1, status: 1 });

module.exports = mongoose.model('Pipeline', pipelineSchema);
