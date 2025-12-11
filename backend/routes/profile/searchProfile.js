const express = require("express");
const router = express.Router();
const { searchProfiles } = require("../../controllers/search.controller");
const { protect } = require("../../middleware/auth");

router.get("/", protect, searchProfiles);

module.exports = router;