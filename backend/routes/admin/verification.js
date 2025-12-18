const express = require("express");
const router = express.Router();
const verificationController = require("../../controllers/admin/verification.controller");
const { protectAdmin } = require("../../middleware/adminAuth");

// All routes are protected (admin only)
router.get("/queue", protectAdmin, verificationController.getVerificationQueue);
router.post("/approve/:userId", protectAdmin, verificationController.approveVerification);
router.post("/reject/:userId", protectAdmin, verificationController.rejectVerification);
router.get("/stats", protectAdmin, verificationController.getVerificationStats);
router.post("/search-alumni-database", protectAdmin, verificationController.searchAlumniDatabase);
router.get("/all-alumni", protectAdmin, verificationController.getAllAlumni);

module.exports = router;
