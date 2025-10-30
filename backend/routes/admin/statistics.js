const express = require("express");
const router = express.Router();
const statisticsController = require("../../controllers/admin/statistics.controller");
const { protectAdmin } = require("../../middleware/adminAuth");

// All routes are protected (admin only)
router.get("/dashboard", protectAdmin, statisticsController.getDashboardStats);
router.get("/registrations", protectAdmin, statisticsController.getRegistrationGraph);
router.get("/users", protectAdmin, statisticsController.getAllUsers);

module.exports = router;
