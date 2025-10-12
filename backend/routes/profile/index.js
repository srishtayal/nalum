const express = require("express");
const router = express.Router();
const profileStatus = require("./profileStatus");
const createProfile = require("./createProfile");

router.use("/create", createProfile);
router.use("/status", profileStatus);

module.exports = router;