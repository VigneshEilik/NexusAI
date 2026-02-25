const Pipeline = require('../models/Pipeline');
const connectorRegistry = require('../connectors');
const aiInsightService = require('../services/aiInsightService');
const usageMeteringService = require('../services/usageMeteringService');
const ollamaService = require('../services/ollamaService');
const Report = require('../models/Report');
const queueService = require('../services/queueService');
const logger = require('../config/logger');

/**
 * Pipeline Worker
 *
 * Registers the 'pipeline-process' handler with the MongoDB queue.
 * Processing steps:
 *   1. Load pipeline + datasource from DB
 *   2. Instantiate the correct connector via the registry
 *   3. Execute connector (connect → fetch → validate → transform)
 *   4. Extract KPIs, trends, anomalies via AiInsightService
 *   5. Send structured JSON to Ollama for insight generation
 *   6. Persist report
 *   7. Track all usage
 */

// Register the handler
queueService.registerHandler('pipeline-process', async (jobData) => {
    const { pipelineId, workspaceId } = jobData;

    logger.info(`[PipelineWorker] Starting: ${pipelineId}`);

    // ── 1. Load pipeline + datasource ──
    const pipeline = await Pipeline.findById(pipelineId).populate('dataSource');
    if (!pipeline) throw new Error('Pipeline not found');

    const ds = pipeline.dataSource;

    // ── 2. Prepare connector config ──
    let connectorConfig = { ...ds.config };

    // For CSV stored as base64, decode it back to a Buffer
    if (ds.type === 'csv' && connectorConfig.data && typeof connectorConfig.data === 'string') {
        connectorConfig.data = Buffer.from(connectorConfig.data, 'base64');
    }

    // ── 3. Create connector via registry ──
    const connector = connectorRegistry.create(ds.type, connectorConfig);

    // ── 4. Execute connector pipeline ──
    const transformedData = await connector.execute();

    logger.info(`[PipelineWorker] Fetched ${transformedData.length} rows from "${ds.type}" connector`);

    // ── 5. Track rows processed ──
    await usageMeteringService.trackUsage(workspaceId, 'row_processed', transformedData.length, { pipelineId });

    // ── 6. Build insight payload (KPIs, trends, anomalies) ──
    const insightPayload = aiInsightService.buildInsightPayload(transformedData, {
        maxSampleRows: 5,
    });

    // ── 7. Send to Ollama ──
    const aiPrompt = pipeline.config?.aiPrompt || undefined;
    const { system, user } = aiInsightService.buildPrompt(insightPayload, aiPrompt);

    const aiResponse = await ollamaService.chat([
        { role: 'system', content: system },
        { role: 'user', content: user },
    ]);

    // Track AI request
    await usageMeteringService.trackUsage(workspaceId, 'ai_request', 1, { pipelineId });

    // ── 8. Persist report ──
    const report = await Report.create({
        workspace: workspaceId,
        pipeline: pipelineId,
        title: `Report: ${pipeline.name} — ${new Date().toLocaleDateString()}`,
        data: transformedData.slice(0, 200), // Sample; full data → GridFS/S3 in prod
        insights: {
            summary: aiResponse.content,
            kpis: insightPayload.kpis,
            trends: insightPayload.trends,
            anomalies: insightPayload.anomalies,
        },
        status: 'published',
    });

    // Track pipeline run
    await usageMeteringService.trackUsage(workspaceId, 'pipeline_run', 1, { pipelineId });

    // ── 9. Update pipeline status ──
    pipeline.lastRunAt = new Date();
    pipeline.status = 'active';
    await pipeline.save();

    logger.info(`[PipelineWorker] Completed: ${pipelineId} → Report ${report._id}`);
    return { reportId: report._id.toString() };
});

/**
 * Start the worker — call this after MongoDB is connected.
 * Typically invoked from server.js
 */
function startPipelineWorker() {
    queueService.startProcessing();
    logger.info('[PipelineWorker] MongoDB-based worker started');
}

module.exports = { startPipelineWorker };
