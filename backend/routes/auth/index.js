const express = require("express");
const router = express.Router();

const signIn = require("./signIn");
const signUp = require("./signUp");
const verifyAccount = require("./verifyAccount");
const verifyToken = require("./verifyToken");
const updateToken = require("./updateToken");
const revokeToken = require("./revokeToken");
const requestOtp = require("./requestOtp");

router.use("/sign-in", signIn);
router.use("/sign-up", signUp);
router.use("/request-otp", requestOtp);
router.use("/verify-account", verifyAccount);
router.use("/verify-token", verifyToken);
router.use("/update-token", updateToken);
router.use("/revoke-token", revokeToken);

module.exports = router;
