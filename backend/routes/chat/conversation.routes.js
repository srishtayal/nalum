const express = require('express');
const router = express.Router();
const conversationController = require('../../controllers/chat/conversation.controller');
const { protect } = require('../../middleware/auth');

// All routes require authentication
router.use(protect);

// Conversation management
router.get('/', conversationController.getConversations);
router.get('/:conversationId', conversationController.getConversation);
router.post('/', conversationController.createConversation);
router.delete('/:conversationId', conversationController.archiveConversation);
router.put('/:conversationId/read', conversationController.markConversationRead);

module.exports = router;
