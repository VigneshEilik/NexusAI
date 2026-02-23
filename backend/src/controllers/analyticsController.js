const { Analytics } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const ollamaService = require('../services/ollamaService');
const csv = require('csv-parser');
const { Readable } = require('stream');
const logger = require('../config/logger');

// @desc    Upload CSV and get AI analysis
// @route   POST /api/v1/analytics/upload
exports.uploadAndAnalyze = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload a CSV file', 400));
    }

    const startTime = Date.now();
    const rows = [];
    const columns = [];

    // Parse CSV
    await new Promise((resolve, reject) => {
        const stream = Readable.from(req.file.buffer.toString());
        stream
            .pipe(csv())
            .on('headers', (headers) => columns.push(...headers))
            .on('data', (row) => rows.push(row))
            .on('end', resolve)
            .on('error', reject);
    });

    if (rows.length === 0) {
        return next(new AppError('CSV file is empty', 400));
    }

    // Create analytics record
    const analytics = await Analytics.create({
        user: req.user.id,
        title: req.body.title || req.file.originalname,
        description: req.body.description,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        rowCount: rows.length,
        columnCount: columns.length,
        columns,
        status: 'processing',
    });

    // Generate data summary for AI
    const sampleRows = rows.slice(0, 10);
    const csvSummary = `
Columns: ${columns.join(', ')}
Total Rows: ${rows.length}
Sample Data (first 10 rows):
${sampleRows.map((r) => JSON.stringify(r)).join('\n')}

Column Statistics:
${columns
            .map((col) => {
                const values = rows.map((r) => r[col]).filter(Boolean);
                const numericValues = values.map(Number).filter((n) => !isNaN(n));
                if (numericValues.length > 0) {
                    return `${col}: min=${Math.min(...numericValues)}, max=${Math.max(...numericValues)}, avg=${(numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(2)}`;
                }
                return `${col}: ${values.length} non-empty values, ${new Set(values).size} unique`;
            })
            .join('\n')}`;

    try {
        const aiResponse = await ollamaService.analyzeData(csvSummary, req.body.question);

        analytics.insights = {
            summary: aiResponse.content,
            recommendations: [],
            statistics: {
                rowCount: rows.length,
                columnCount: columns.length,
                columns: columns.map((col) => {
                    const values = rows.map((r) => r[col]).filter(Boolean);
                    const numericValues = values.map(Number).filter((n) => !isNaN(n));
                    return {
                        name: col,
                        type: numericValues.length > values.length / 2 ? 'numeric' : 'categorical',
                        uniqueCount: new Set(values).size,
                        nullCount: rows.length - values.length,
                    };
                }),
            },
        };
        analytics.status = 'completed';
        analytics.processingTime = Date.now() - startTime;
        await analytics.save();

        logger.info(`Analytics completed for user ${req.user.id}: ${analytics._id}`);
    } catch (error) {
        analytics.status = 'failed';
        analytics.processingTime = Date.now() - startTime;
        await analytics.save();
        logger.error('Analytics AI error:', error.message);
    }

    res.status(201).json({
        status: 'success',
        data: { analytics },
    });
});

// @desc    Get all analytics for user
// @route   GET /api/v1/analytics
exports.getAnalytics = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const analytics = await Analytics.find({ user: req.user.id })
        .select('-insights.statistics')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Analytics.countDocuments({ user: req.user.id });

    res.status(200).json({
        status: 'success',
        data: {
            analytics,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        },
    });
});

// @desc    Get single analytics
// @route   GET /api/v1/analytics/:id
exports.getAnalyticsById = asyncHandler(async (req, res, next) => {
    const analytics = await Analytics.findOne({ _id: req.params.id, user: req.user.id });

    if (!analytics) {
        return next(new AppError('Analytics not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { analytics },
    });
});

// @desc    Delete analytics
// @route   DELETE /api/v1/analytics/:id
exports.deleteAnalytics = asyncHandler(async (req, res, next) => {
    const analytics = await Analytics.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!analytics) {
        return next(new AppError('Analytics not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Analytics deleted successfully',
    });
});

// @desc    Get dashboard stats
// @route   GET /api/v1/analytics/dashboard/stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
    const totalAnalytics = await Analytics.countDocuments({ user: req.user.id });
    const completedAnalytics = await Analytics.countDocuments({ user: req.user.id, status: 'completed' });
    const recentAnalytics = await Analytics.find({ user: req.user.id })
        .select('title status createdAt processingTime')
        .sort({ createdAt: -1 })
        .limit(5);

    res.status(200).json({
        status: 'success',
        data: {
            stats: {
                totalAnalytics,
                completedAnalytics,
                successRate: totalAnalytics > 0 ? ((completedAnalytics / totalAnalytics) * 100).toFixed(1) : 0,
            },
            recentAnalytics,
        },
    });
});
