const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const { startPipelineWorker } = require('./workers/pipelineWorker');
const queueService = require('./services/queueService');

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Connect to Redis (optional — used for caching)
        await connectRedis();

        // Start MongoDB-based pipeline worker
        startPipelineWorker();

        // Start server
        const server = app.listen(config.port, () => {
            logger.info(`🚀 NexusAI API Server running on port ${config.port} [${config.env}]`);
        });

        // Graceful shutdown
        const shutdown = async (signal) => {
            logger.info(`${signal} received. Shutting down gracefully...`);
            queueService.stopProcessing();
            server.close(() => {
                logger.info('Server closed');
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

        // Unhandled rejections
        process.on('unhandledRejection', (err) => {
            logger.error('UNHANDLED REJECTION:', err);
            server.close(() => process.exit(1));
        });

        // Uncaught exceptions
        process.on('uncaughtException', (err) => {
            logger.error('UNCAUGHT EXCEPTION:', err);
            server.close(() => process.exit(1));
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
