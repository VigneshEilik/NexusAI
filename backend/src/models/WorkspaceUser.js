const mongoose = require('mongoose');

const workspaceUserSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['owner', 'admin', 'member', 'viewer'],
        default: 'member'
    },
    status: {
        type: String,
        enum: ['active', 'invited', 'suspended'],
        default: 'active'
    }
}, { timestamps: true });

// Ensure a user has only one role per workspace
workspaceUserSchema.index({ workspace: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('WorkspaceUser', workspaceUserSchema);
