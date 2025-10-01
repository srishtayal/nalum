const express = require("express");
const router = express.Router();
const otpController = require("../../controllers/otp.controller.js");
const mailer = require("../../mail/transporter.js");
const user = require("../../controllers/user.controller.js");

router.post("/" , async (req, res) => {
    const { email, otp } = req.body;
    if(!email || !otp) {
        return res.status(400).json({error: true,code:400,message: "Email and OTP are required"});
    }
    const user = await user.findOne(email);
    if(user.error) {
        return res.status(500).json({error: true,code:500,message: "Internal server error"});
    }
    if(!user.data) {
        return res.status(404).json({error: true,code:404,message: "User not found"});
    }
    if(user.data.email_verified) {
        return res.status(400).json({error: true,code:400,message: "Account already verified"});
    }
    const otpData = await otpController.find(email, otp);
    if(otpData.error) {
        return res.status(400).json({error: true,code:400,message: otpData.message || "Invalid OTP"});
    }
    // Mark user as verified
    const updateResponse = await user.update(email, {email_verified: true});
    if(updateResponse.error) {
        return res.status(500).json({error: true,code:500,message: updateResponse.message || "Error verifying account"});
    }
    // Optionally, delete the OTP after successful verification
    await otpController.remove(email, otp);
    return res.status(200).json({error: false,code:200,message: "Account verified successfully"});
}) 

module.exports = router;