const express = require("express");
const router = express.Router();
const alumniController = require("../controllers/alumni.controller");
const { protect, isAdmin } = require("../middleware/auth");

// Alumni verification routes (Note: already mounted at /alumni in index.js)
router.post("/verify-code", protect, alumniController.verifyCode);
router.get("/status", protect, alumniController.getVerificationStatus);

// Check manual verification details (calls microservice)
router.post("/check-manual", protect, alumniController.checkManualVerification);

// Confirm manual verification match
router.post("/confirm-match", protect, alumniController.confirmManualMatch);

// Admin-only routes for managing verification queue
// These are accessible via /alumni/admin/* (e.g., /alumni/admin/generate-codes)
router.post("/admin/generate-codes", protect, isAdmin, alumniController.generateCodes);
router.get("/admin/queue", protect, isAdmin, alumniController.getQueue);
router.post("/admin/queue/:userId/approve", protect, isAdmin, alumniController.approveFromQueue);
router.post("/admin/queue/:userId/deny", protect, isAdmin, alumniController.denyFromQueue);

module.exports = router;
