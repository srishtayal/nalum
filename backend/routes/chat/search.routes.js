const express = require('express');
const router = express.Router();
const searchController = require('../../controllers/chat/search.controller');
const { protect } = require('../../middleware/auth');

// All routes require authentication
router.use(protect);

// Search endpoints
router.get('/users', searchController.searchUsers);
router.get('/conversations', searchController.searchConversations);

module.exports = router;
