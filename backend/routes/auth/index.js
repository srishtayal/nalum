const express = require("express");
const router = express.Router();

const signIn = require("./signIn");
const signUp = require("./signUp");
const verifyAccount = require("./verifyAccount");
const verifyToken = require("./verifyToken");
const updateToken = require("./updateToken");
const revokeToken = require("./revokeToken");
const forgetPassword = require("./forgetPassword");
const resetPassword = require("./resetPassword");

router.use("/sign-in", signIn);
router.use("/sign-up", signUp);
router.use("/verify-account", verifyAccount);
router.use("/verify-token", verifyToken);
router.use("/update-token", updateToken);
router.use("/revoke-token", revokeToken);
router.use("/forget-password", forgetPassword);
router.use("/reset-password", resetPassword);
module.exports = router;