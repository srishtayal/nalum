const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const users = require("../../controllers/user.controller.js");
const verificationTokens = require("../../controllers/verificationToken.controller.js");
const mailer = require("../../mail/transporter.js");

router.post("/", async (req, res) => {
  const {
    email,
    password,
    name,
    batch,
    branch,
    campus,
    phone_number,
  } = req.body;

  // ? Validate required fields
  if (
    !email ||
    !password ||
    !name ||
    !batch ||
    !branch ||
    !campus ||
    !phone_number
  ) {
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
      code: 401,
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
    email_verified: false,
  });

  if (userResponse.error) {
    return res.status(500).json(userResponse);
  }

  // ? Create verification token
  const tokenResponse = await verificationTokens.create(email);

  if (tokenResponse.error) {
    return res.status(500).json(tokenResponse);
  }

  const verificationLink = `http://localhost:8080/verify-account?email=${email}&token=${tokenResponse.data.token}`;

  const mailResponse = await mailer.sendMail(
    email,
    "Verify Your Account",
    `Click the following link to verify your account: ${verificationLink}`,
    `<p>Click the following link to verify your account: <a href="${verificationLink}">${verificationLink}</a></p>`
  );

  return res
    .status(mailResponse.error ? 500 : 200)
    .json(
      mailResponse.error
        ? mailResponse
        : { error: false, message: "Verification link sent to email." }
    );
});

module.exports = router;
