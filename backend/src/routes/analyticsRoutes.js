const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for CSV uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    },
});

router.use(protect);

router.get('/dashboard/stats', analyticsController.getDashboardStats);
router.post('/upload', upload.single('file'), analyticsController.uploadAndAnalyze);
router.get('/', analyticsController.getAnalytics);
router.get('/:id', analyticsController.getAnalyticsById);
router.delete('/:id', analyticsController.deleteAnalytics);

module.exports = router;
