const express = require('express');
const router = express.Router();
const multer = require('multer');
const pipelineController = require('../controllers/pipelineController');
const { protect } = require('../middleware/auth');
const { validateWorkspaceAccess } = require('../middleware/multiTenant');
const { checkPlanLimits } = require('../middleware/usageMetering');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    },
});

router.use(protect);

// Upload CSV → triggers background pipeline
router.post(
    '/upload-csv',
    validateWorkspaceAccess(),
    checkPlanLimits('pipeline_run'),
    upload.single('file'),
    pipelineController.uploadCsv
);

// List pipelines for workspace
router.get(
    '/',
    validateWorkspaceAccess(),
    pipelineController.listPipelines
);

// Get single pipeline
router.get(
    '/:pipelineId',
    validateWorkspaceAccess(),
    pipelineController.getPipeline
);

// Queue stats (admin only)
router.get(
    '/queue/stats',
    validateWorkspaceAccess(['owner', 'admin']),
    pipelineController.getQueueStats
);

module.exports = router;
