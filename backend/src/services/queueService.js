const Job = require('../models/Job');
const logger = require('../config/logger');

/**
 * MongoDB Queue Service
 *
 * A lightweight, MongoDB-native job queue that replaces BullMQ + Redis.
 * Uses atomic findOneAndUpdate to claim jobs, preventing race conditions.
 *
 * Usage:
 *   await queueService.addJob('pipeline-process', { pipelineId, workspaceId });
 *   queueService.registerHandler('pipeline-process', async (jobData) => { ... });
 *   queueService.startProcessing();
 */
class QueueService {
    constructor() {
        this._handlers = new Map();
        this._polling = false;
        this._pollIntervalMs = 3000; // Check for jobs every 3 seconds
        this._lockDurationMs = 5 * 60 * 1000; // 5-minute lock per job
        this._pollTimer = null;
    }

    /**
     * Add a job to the queue
     * @param {string} name - Job name (e.g. 'pipeline-process')
     * @param {Object} data - Job payload
     * @param {Object} options - { priority, maxAttempts, scheduledAt }
     * @returns {Promise<Object>} The created job document
     */
    async addJob(name, data, options = {}) {
        const job = await Job.create({
            name,
            data,
            priority: options.priority || 0,
            maxAttempts: options.maxAttempts || 3,
            scheduledAt: options.scheduledAt || new Date(),
        });

        logger.info(`[Queue] Job added: ${name} (${job._id})`);
        return job;
    }

    /**
     * Register a handler function for a job type
     * @param {string} name - Job name to handle
     * @param {Function} handler - async function(jobData) => result
     */
    registerHandler(name, handler) {
        this._handlers.set(name, handler);
        logger.info(`[Queue] Handler registered: ${name}`);
    }

    /**
     * Start polling MongoDB for pending jobs
     */
    startProcessing() {
        if (this._polling) return;
        this._polling = true;
        logger.info(`[Queue] Started processing (poll every ${this._pollIntervalMs}ms)`);
        this._poll();
    }

    /**
     * Stop the polling loop
     */
    stopProcessing() {
        this._polling = false;
        if (this._pollTimer) {
            clearTimeout(this._pollTimer);
            this._pollTimer = null;
        }
        logger.info('[Queue] Stopped processing');
    }

    /**
     * Internal poll loop
     */
    async _poll() {
        if (!this._polling) return;

        try {
            // Also release stale locked jobs (crashed workers)
            await this._releaseStaleJobs();

            // Try to claim and process one job
            const processed = await this._claimAndProcess();

            // If we processed a job, immediately check for more (no delay)
            if (processed) {
                setImmediate(() => this._poll());
                return;
            }
        } catch (err) {
            logger.error(`[Queue] Poll error: ${err.message}`);
        }

        // No job found — wait before polling again
        this._pollTimer = setTimeout(() => this._poll(), this._pollIntervalMs);
    }

    /**
     * Atomically claim the next pending job and process it
     * @returns {boolean} true if a job was processed
     */
    async _claimAndProcess() {
        const now = new Date();

        // Atomic claim: find a pending job and lock it in one operation
        const job = await Job.findOneAndUpdate(
            {
                status: 'pending',
                scheduledAt: { $lte: now },
                $or: [
                    { lockedUntil: null },
                    { lockedUntil: { $lte: now } },
                ],
            },
            {
                $set: {
                    status: 'processing',
                    startedAt: now,
                    lockedUntil: new Date(now.getTime() + this._lockDurationMs),
                },
                $inc: { attempts: 1 },
            },
            {
                new: true,
                sort: { priority: -1, scheduledAt: 1 }, // Highest priority, oldest first
            }
        );

        if (!job) return false;

        const handler = this._handlers.get(job.name);
        if (!handler) {
            logger.warn(`[Queue] No handler for job type: ${job.name}`);
            await Job.findByIdAndUpdate(job._id, {
                status: 'failed',
                error: `No handler registered for "${job.name}"`,
                completedAt: new Date(),
            });
            return true;
        }

        try {
            logger.info(`[Queue] Processing job: ${job.name} (${job._id}), attempt ${job.attempts}`);
            const result = await handler(job.data);

            await Job.findByIdAndUpdate(job._id, {
                status: 'completed',
                result,
                completedAt: new Date(),
                lockedUntil: null,
            });

            logger.info(`[Queue] Job completed: ${job.name} (${job._id})`);
        } catch (err) {
            logger.error(`[Queue] Job failed: ${job.name} (${job._id}): ${err.message}`);

            if (job.attempts >= job.maxAttempts) {
                await Job.findByIdAndUpdate(job._id, {
                    status: 'failed',
                    error: err.message,
                    completedAt: new Date(),
                    lockedUntil: null,
                });
            } else {
                // Retry with exponential backoff
                const backoffMs = Math.pow(2, job.attempts) * 1000;
                await Job.findByIdAndUpdate(job._id, {
                    status: 'pending',
                    error: err.message,
                    lockedUntil: null,
                    scheduledAt: new Date(Date.now() + backoffMs),
                });
                logger.info(`[Queue] Job ${job._id} scheduled for retry in ${backoffMs}ms`);
            }
        }

        return true;
    }

    /**
     * Release jobs that were locked but never completed (worker crashed)
     */
    async _releaseStaleJobs() {
        const result = await Job.updateMany(
            {
                status: 'processing',
                lockedUntil: { $lte: new Date() },
            },
            {
                $set: { status: 'pending', lockedUntil: null },
            }
        );

        if (result.modifiedCount > 0) {
            logger.warn(`[Queue] Released ${result.modifiedCount} stale job(s)`);
        }
    }

    /**
     * Get queue stats for monitoring
     */
    async getStats() {
        const [pending, processing, completed, failed] = await Promise.all([
            Job.countDocuments({ status: 'pending' }),
            Job.countDocuments({ status: 'processing' }),
            Job.countDocuments({ status: 'completed' }),
            Job.countDocuments({ status: 'failed' }),
        ]);

        return { pending, processing, completed, failed, total: pending + processing + completed + failed };
    }
}

// Singleton
module.exports = new QueueService();
