const mongoose = require('mongoose');

const dataSourceSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['csv', 'google_sheets', 'postgres', 'rest_api'],
        required: true
    },
    config: {
        // Dynamic config based on type
        // For CSV, might be a file URL or path
        // For others, host/port/creds (encrypted)
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'error', 'disconnected'],
        default: 'active'
    },
    lastSyncAt: Date
}, { timestamps: true });

dataSourceSchema.index({ workspace: 1 });

module.exports = mongoose.model('DataSource', dataSourceSchema);
