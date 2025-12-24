const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { protectAdmin } = require('../middleware/adminAuth');
const { checkBanned } = require('../middleware/checkBanned');
const uploadGivingImage = require('../config/givingImage.multer');
const {
  createGiving,
  getMyGiving,
  getAllGiving,
  updateGivingStatus,
  respondToGiving,
} = require('../controllers/giving.controller');

// User routes (Alumni only - checked in controller)
router.post('/', protect, checkBanned, uploadGivingImage.array('images', 2), createGiving);
router.get('/my', protect, getMyGiving);

// Admin routes
router.get('/all', protectAdmin, getAllGiving);
router.put('/:id/viewed', protectAdmin, updateGivingStatus);
router.put('/:id/respond', protectAdmin, respondToGiving);

module.exports = router;
