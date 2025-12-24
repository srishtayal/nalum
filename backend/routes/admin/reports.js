const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../../middleware/adminAuth");
const {
  getReports,
  getPostReports,
  dismissReport,
  rejectPostFromReport,
} = require("../../controllers/report.controller");

// Admin routes for managing reports
router.get("/", protectAdmin, getReports);
router.get("/post/:postId", protectAdmin, getPostReports);
router.post("/:reportId/dismiss", protectAdmin, dismissReport);
router.post("/:reportId/reject", protectAdmin, rejectPostFromReport);

module.exports = router;
