const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const users = require("../../controllers/user.controller.js");
const otps = require("../../controllers/otp.controller.js");
const mailer = require("../../mail/transporter.js");
const sessions = require("../../controllers/session.controller.js");

router.post("/", async (req, res) => {
  const { email, password, fingerprint, name, batch, branch, campus, phone_number } = req.body;

  // ? Validate required fields
  if (!email || !password || !fingerprint || !name || !batch || !branch || !campus || !phone_number) {
    return res.status(400).json({
      error: true,
      code: 400,
      message: "All required fields must be provided",
    });
  }

  // ? Check if user already exists
  let data = await users.findOne(email);
  if (data.error) {
    return res.status(500).json({
      error: true,
      code: 500,
      message: "Internal server error",
    });
  } else if (data.data != null) {
    return res.status(400).json({ 
      error: true, 
      message: "User already exists", 
      code: 401 
    });
  }

  // ? Hash password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }

  // ? Create user with full data
  let userResponse = await users.create({
    email,
    password: hashedPassword,
    name,
    batch,
    branch,
    campus,
    phone_number,
  });

  if (userResponse.error) {
    return res.status(500).json(userResponse);
  }

  // ? Generate OTP
  const OTP = Math.floor(100000 + Math.random() * 900000);
  const otpResponse = await otps.create(email, OTP);

  if (otpResponse.error) {
    return res.status(500).json(otpResponse);
  }

  // ? Send verification mail
  const mailResponse = await mailer.sendMail(
    email,
    "OTP to Verify Your Account",
    `Your OTP is ${OTP}`,
    `<p>Your OTP is ${OTP}</p>`
  );

  if (mailResponse.error) {
    return res.status(500).json(mailResponse);
  }

  // ? Create session
  const sessionData = await sessions.create(
  email,
  fingerprint,
  userResponse.data._id   // <-- FIXED
);

return res.status(sessionData.error ? 500 : 200).json(sessionData);

});

module.exports = router;
