const express = require("express");
const router = express.Router();
const adminAuthController = require("../../controllers/admin/adminAuth.controller");
const { protectAdmin } = require("../../middleware/adminAuth");

// Public routes
router.post("/login", adminAuthController.login);

// Protected routes
router.post("/logout", protectAdmin, adminAuthController.logout);
router.get("/me", protectAdmin, adminAuthController.getCurrentAdmin);

module.exports = router;
