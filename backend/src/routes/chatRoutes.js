const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const chatValidation = require('../validations/chatValidation');
const { aiLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router.get('/ai/health', chatController.aiHealth);
router.get('/', chatController.getChats);
router.post('/', validate(chatValidation.createChat), chatController.createChat);
router.post('/message', aiLimiter, validate(chatValidation.sendMessage), chatController.sendMessage);
router.get('/:chatId', validate(chatValidation.getChatParams), chatController.getChat);
router.delete('/:chatId', validate(chatValidation.getChatParams), chatController.deleteChat);
router.patch('/:chatId/archive', validate(chatValidation.getChatParams), chatController.archiveChat);

module.exports = router;
