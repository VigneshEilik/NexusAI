const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const chatRoutes = require('./chatRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const adminRoutes = require('./adminRoutes');
const workspaceRoutes = require('./workspaceRoutes');
const pipelineRoutes = require('./pipelineRoutes');

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/pipelines', pipelineRoutes);

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'NexusAI API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

module.exports = router;
