const express = require("express");
const router = express.Router();
const alumniController = require("../controllers/alumni.controller");
const { protect } = require("../middleware/auth");

// Alumni verification route
router.post("/verify-code", protect, alumniController.verifyCode);

// Generate verification codes route (protected - will be admin-only in Phase 5)
router.post("/generate-codes", protect, alumniController.generateCodes);

module.exports = router;
