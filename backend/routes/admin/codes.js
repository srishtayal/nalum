const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../../middleware/adminAuth");
const {
  generateCodes,
  getAllCodes,
  getCodeStats,
  deleteExpiredCodes,
} = require("../../controllers/admin/codes.controller");

// All routes require admin authentication
router.use(protectAdmin);

/**
 * @route   POST /api/admin/codes/generate
 * @desc    Generate verification codes (max 5 per minute)
 * @access  Admin only
 */
router.post("/generate", generateCodes);

/**
 * @route   GET /api/admin/codes
 * @desc    Get all verification codes with filters
 * @access  Admin only
 */
router.get("/", getAllCodes);

/**
 * @route   GET /api/admin/codes/stats
 * @desc    Get code statistics
 * @access  Admin only
 */
router.get("/stats", getCodeStats);

/**
 * @route   DELETE /api/admin/codes/expired
 * @desc    Delete all expired codes (cleanup)
 * @access  Admin only
 */
router.delete("/expired", deleteExpiredCodes);

module.exports = router;
