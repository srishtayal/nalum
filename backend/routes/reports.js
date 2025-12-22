const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  submitReport,
  checkUserReport,
} = require("../controllers/report.controller");

// User routes for reporting
router.post("/post/:postId", protect, submitReport);
router.get("/post/:postId/check", protect, checkUserReport);

module.exports = router;
