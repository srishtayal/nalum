const express = require("express");
const router = express.Router();
const profileStatus = require("./profileStatus");
const createProfile = require("./createProfile");
const searchProfile = require("./searchProfile");

router.use("/create", createProfile);
router.use("/status", profileStatus);
router.use("/search", searchProfile);

module.exports = router;