const express = require("express");
const router = express.Router();

const signIn = require("./signIn");
const signUp = require("./signUp");
const refresh = require("./refresh"); 
const revokeToken = require("./revokeToken");
const forgetPassword = require("./forgetPassword");
const resetPassword = require("./resetPassword");
const sendVerificationLink = require("./sendVerificationLink");
const sendOTP = require("./sendOTP");
const verifyAccountUsingLink = require("./verifyAccountUsingLink");
const verifyAccountUsingOTP = require("./verifyAccountUsingOTP");

// define routes 

router.use("/sign-in", signIn);
router.use("/sign-up", signUp);
router.use("/refresh", refresh);
router.use("/revoke-token", revokeToken);
router.use("/forget-password", forgetPassword);
router.use("/reset-password", resetPassword);
router.use("/send-verification-link", sendVerificationLink);
router.use("/send-otp", sendOTP);
router.use("/verify-account-link", verifyAccountUsingLink);
router.use("/verify-account-otp", verifyAccountUsingOTP);
module.exports = router;