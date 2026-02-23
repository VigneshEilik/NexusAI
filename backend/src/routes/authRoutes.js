const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const authValidation = require('../validations/authValidation');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, validate(authValidation.register), authController.register);
router.post('/login', authLimiter, validate(authValidation.login), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authLimiter, validate(authValidation.forgotPassword), authController.forgotPassword);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.patch('/profile', validate(authValidation.updateProfile), authController.updateProfile);
router.patch('/change-password', validate(authValidation.changePassword), authController.changePassword);

module.exports = router;
