const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/chat/message.controller');
const { protect } = require('../../middleware/auth');

// All routes require authentication
router.use(protect);

// Message management
router.get('/:conversationId', messageController.getMessages);
router.post('/', messageController.sendMessage);
router.put('/:messageId/read', messageController.markMessageRead);
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;
