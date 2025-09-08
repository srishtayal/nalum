const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const users = require("../../controllers/user.controller.js");
const mailer = require("../../mail/transporter.js");
const JWT_SECRET = require("../../config/jwt.config.js").JWT_SECRET;
router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  const data = await users.findOne(email);

  // Always return 200 to prevent email enumeration
  if (data.error || !data.data) {
    return res.json({
      error: false,
      message: "If this email exists, a reset link has been sent.",
    });
  }

  // Generate JWT (expires in 15 min)
  const token = jwt.sign(
    { email },
    JWT_SECRET,
    { expiresIn: "5m" }
  );

  const verificationLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await mailer.sendMail(
    email,
    "Reset Your Password",
    `Click to reset: ${verificationLink}`,
    `<p>Click here: <a href="${verificationLink}">${verificationLink}</a></p>`
  );

  return res.json({
    error: false,
    message: "If this email exists, a reset link has been sent.",
  });
});

module.exports = router;
