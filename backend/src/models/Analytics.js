const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            maxlength: 200,
        },
        description: {
            type: String,
            maxlength: 500,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileSize: Number,
        rowCount: Number,
        columnCount: Number,
        columns: [String],
        insights: {
            summary: String,
            recommendations: [String],
            statistics: mongoose.Schema.Types.Mixed,
            charts: [
                {
                    type: { type: String },
                    title: String,
                    data: mongoose.Schema.Types.Mixed,
                },
            ],
        },
        status: {
            type: String,
            enum: ['processing', 'completed', 'failed'],
            default: 'processing',
        },
        processingTime: Number,
    },
    {
        timestamps: true,
    }
);

analyticsSchema.index({ user: 1, createdAt: -1 });
analyticsSchema.index({ status: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
