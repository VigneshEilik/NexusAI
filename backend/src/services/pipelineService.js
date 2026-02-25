const DataSource = require('../models/DataSource');
const Pipeline = require('../models/Pipeline');
const queueService = require('./queueService');
const logger = require('../config/logger');

/**
 * Pipeline Service
 *
 * Orchestrates data ingestion and hands off processing to the
 * MongoDB-based queue (no Redis dependency).
 */
class PipelineService {
    /**
     * Handle manual CSV upload and trigger background processing
     */
    async processManualCsv(workspaceId, userId, file, metadata) {
        // 1. Create a DataSource record
        const dataSource = await DataSource.create({
            workspace: workspaceId,
            name: metadata.title || file.originalname,
            type: 'csv',
            config: {
                data: file.buffer.toString('base64'), // Store as base64; use GridFS/S3 in prod
                fileName: file.originalname,
            },
        });

        // 2. Create a Pipeline record
        const pipeline = await Pipeline.create({
            workspace: workspaceId,
            name: `CSV Upload: ${dataSource.name}`,
            dataSource: dataSource._id,
            schedule: 'manual',
            status: 'running',
            config: {
                aiPrompt: metadata.question,
            },
        });

        // 3. Enqueue job in MongoDB queue
        await queueService.addJob('pipeline-process', {
            pipelineId: pipeline._id.toString(),
            workspaceId: workspaceId,
            userId: userId,
        }, {
            maxAttempts: 3,
        });

        logger.info(`[PipelineService] CSV queued: pipeline=${pipeline._id}, ds=${dataSource._id}`);
        return { pipeline, dataSource };
    }

    /**
     * Schedule a recurring pipeline
     */
    async schedulePipeline(workspaceId, pipelineId, schedule) {
        const pipeline = await Pipeline.findOneAndUpdate(
            { _id: pipelineId, workspace: workspaceId },
            { schedule, status: 'active' },
            { new: true }
        );

        if (!pipeline) throw new Error('Pipeline not found');

        // For recurring schedules, compute next run time
        if (schedule !== 'manual') {
            const nextRunAt = this._computeNextRun(schedule);
            pipeline.nextRunAt = nextRunAt;
            await pipeline.save();

            // Enqueue the first scheduled run
            await queueService.addJob('pipeline-process', {
                pipelineId: pipeline._id.toString(),
                workspaceId,
            }, {
                scheduledAt: nextRunAt,
            });
        }

        return pipeline;
    }

    /**
     * List pipelines for a workspace
     */
    async listPipelines(workspaceId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [pipelines, total] = await Promise.all([
            Pipeline.find({ workspace: workspaceId })
                .populate('dataSource', 'name type status')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Pipeline.countDocuments({ workspace: workspaceId }),
        ]);

        return {
            pipelines,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    }

    /**
     * Get a single pipeline
     */
    async getPipeline(workspaceId, pipelineId) {
        const pipeline = await Pipeline.findOne({ _id: pipelineId, workspace: workspaceId })
            .populate('dataSource')
            .lean();

        if (!pipeline) throw new Error('Pipeline not found');
        return pipeline;
    }

    _computeNextRun(schedule) {
        const now = new Date();
        switch (schedule) {
            case 'hourly':
                return new Date(now.getTime() + 60 * 60 * 1000);
            case 'daily':
                return new Date(now.getTime() + 24 * 60 * 60 * 1000);
            case 'weekly':
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            default:
                return null;
        }
    }
}

module.exports = new PipelineService();
