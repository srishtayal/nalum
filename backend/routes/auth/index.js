const express = require("express");
const router = express.Router();
const { rateLimiters } = require("../../middleware/rateLimiter");

const signIn = require("./signIn");
const signUp = require("./signUp");
const refresh = require("./refresh"); 
const revokeToken = require("./revokeToken");
const logout = require("./logout");
const forgetPassword = require("./forgetPassword");
const resetPassword = require("./resetPassword");
const sendVerificationLink = require("./sendVerificationLink");
const sendOTP = require("./sendOTP");
const verifyAccountUsingLink = require("./verifyAccountUsingLink");
const verifyAccountUsingOTP = require("./verifyAccountUsingOTP");

// define routes with rate limiting

// Auth routes - stricter limits
router.use("/sign-in", rateLimiters.auth, signIn);
router.use("/sign-up", rateLimiters.auth, signUp);
router.use("/refresh", refresh); // No rate limit on refresh
router.use("/revoke-token", revokeToken);
router.use("/logout", logout);

// Email routes - very strict limits to prevent abuse
router.use("/forget-password", rateLimiters.email, forgetPassword);
router.use("/reset-password", rateLimiters.auth, resetPassword);
router.use("/send-verification-link", rateLimiters.email, sendVerificationLink);
router.use("/send-otp", rateLimiters.email, sendOTP);

// Verification routes - moderate limits
router.use("/verify-account-link", rateLimiters.api, verifyAccountUsingLink);
router.use("/verify-account-otp", rateLimiters.auth, verifyAccountUsingOTP);

module.exports = router;