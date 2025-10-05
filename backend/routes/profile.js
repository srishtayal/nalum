

const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const { protect } = require("../middleware/auth");

// Retrieve a single profile with userId
router.get("/", protect, profileController.findOne);

// Update a profile with userId
router.put("/", protect, profileController.update);

module.exports = router;
