const express = require("express");
const router = express.Router();
const profileStatus = require("./profileStatus");
const createProfile = require("./createProfile");
const updateProfile = require("./updateProfile");
const getProfile = require("./getProfile");
const getUserProfile = require("./getUserProfile");
const searchProfile = require("./searchProfile");
const profilePicture = require("./profilePicture");
const { getSuggestions } = require("../../controllers/search.controller");
const { protect } = require("../../middleware/auth");

router.use("/create", createProfile);
router.use("/update", updateProfile);
router.use("/me", getProfile);
router.use("/user", getUserProfile);
router.use("/status", profileStatus);
router.get("/suggestions", protect, getSuggestions);
router.use("/search", searchProfile);
router.use("/", profilePicture); // Handles /profile/picture

module.exports = router;
