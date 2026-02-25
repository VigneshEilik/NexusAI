const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    pipeline: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pipeline'
    },
    title: String,
    data: mongoose.Schema.Types.Mixed,
    insights: {
        summary: String,
        kpis: mongoose.Schema.Types.Mixed,
        trends: Array,
        anomalies: Array
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    }
}, { timestamps: true });

reportSchema.index({ workspace: 1 });

module.exports = mongoose.model('Report', reportSchema);
