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
    role,
  } = req.body;

  // ? Validate required fields
  if (
    !email ||
    !password ||
    !name ||
    !batch ||
    !branch ||
    !campus ||
    !phone_number ||
    !role
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
    role,
  });

  if (userResponse.error) {
    return res.status(500).json(userResponse);
  }
  return res.status(201).json({
    error: false,
    code: 201,
    message: "User created successfully",
    data: userResponse.data,
  });
});

module.exports = router;
