const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    tokens: {
        prompt: Number,
        completion: Number,
    },
});

const chatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            default: 'New Chat',
            maxlength: 200,
        },
        messages: [messageSchema],
        model: {
            type: String,
            default: 'llama3',
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        metadata: {
            totalTokens: { type: Number, default: 0 },
            messageCount: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
chatSchema.index({ user: 1, createdAt: -1 });
chatSchema.index({ user: 1, isArchived: 1 });
chatSchema.index({ title: 'text' });

// Update metadata before saving
chatSchema.pre('save', function (next) {
    this.metadata.messageCount = this.messages.length;
    next();
});

module.exports = mongoose.model('Chat', chatSchema);
