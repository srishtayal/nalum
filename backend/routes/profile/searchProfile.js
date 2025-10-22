const express = require("express");
const router = express.Router();
const { searchProfiles } = require("../../controllers/search.controller");

router.get("/", searchProfiles);

module.exports = router;
