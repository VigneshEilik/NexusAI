const pipelineService = require('../services/pipelineService');
const queueService = require('../services/queueService');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * @desc    Upload CSV and trigger background pipeline
 * @route   POST /api/v1/pipelines/upload-csv
 * @access  Private (Workspace Member)
 */
exports.uploadCsv = asyncHandler(async (req, res, next) => {
    const { title, question } = req.body;

    if (!req.file) {
        return next(new AppError('No CSV file uploaded', 400));
    }

    const result = await pipelineService.processManualCsv(
        req.workspaceId,
        req.user.id,
        req.file,
        { title, question }
    );

    res.status(202).json({
        status: 'success',
        message: 'CSV processing started in background',
        data: result,
    });
});

/**
 * @desc    List pipelines for a workspace
 * @route   GET /api/v1/pipelines
 * @access  Private (Workspace Member)
 */
exports.listPipelines = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await pipelineService.listPipelines(req.workspaceId, page, limit);

    res.status(200).json({
        status: 'success',
        data: result,
    });
});

/**
 * @desc    Get a single pipeline
 * @route   GET /api/v1/pipelines/:pipelineId
 * @access  Private (Workspace Member)
 */
exports.getPipeline = asyncHandler(async (req, res, next) => {
    const pipeline = await pipelineService.getPipeline(req.workspaceId, req.params.pipelineId);

    res.status(200).json({
        status: 'success',
        data: { pipeline },
    });
});

/**
 * @desc    Get queue stats (admin)
 * @route   GET /api/v1/pipelines/queue/stats
 * @access  Private (Workspace Admin)
 */
exports.getQueueStats = asyncHandler(async (req, res) => {
    const stats = await queueService.getStats();

    res.status(200).json({
        status: 'success',
        data: { stats },
    });
});
