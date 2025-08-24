const express = require("express");
const router = express.Router();

const users = require("../../controllers/user.controller.js");
const otps = require("../../controllers/otp.controller.js");
const mailer = require("../../mail/transporter.js");

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: true,
      code: 400,
      message: "Email is required",
    });
  }

  const userResponse = await users.findOne(email);
  if (userResponse.error) {
    return res.status(500).json(userResponse);
  }
  if (!userResponse.data) {
    return res.status(404).json({
      error: true,
      message: "No user exists with this email",
      code: 404,
    });
  }

  const OTP = Math.floor(100000 + Math.random() * 900000); // 6-digit code
  const otpResponse = await otps.create(email, OTP);

  if (otpResponse.error) {
    return res.status(500).json(otpResponse);
  }

  const mailResponse = await mailer.sendMail(
    email,
    "OTP to Verify Your Account",
    `Your OTP is ${OTP}`,
    `<p>Your OTP is <b>${OTP}</b></p>`
  );
  console.log(OTP); //! for debugging purpose only
  return res
    .status(mailResponse.error ? 500 : 200)
    .json(
      mailResponse.error
        ? mailResponse
        : { error: false, message: "OTP sent to email." }
    );
});

module.exports = router;
