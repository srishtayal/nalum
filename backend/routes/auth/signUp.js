const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const users = require("../../controllers/user.controller.js");
const sessions = require("../../controllers/session.controller.js");

router.post("/", async (req, res) => {
  const {
    email,
    password,
    fingerprint,
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
    !fingerprint ||
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
  // ? Create session
  const sessionData = await sessions.create(
    email,
    fingerprint,
    userResponse.data._id
  );

  if (sessionData.error) {
    return res.status(500).json(sessionData);
  }

  // merge user + session data
  const { refresh_token, ...sessionInfo } = sessionData.data;
  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  return res.status(200).json({
    error: false,
    data: {
      ...sessionInfo,
      email_verified: userResponse.data.email_verified, // include explicitly
      name: userResponse.data.name,
      batch: userResponse.data.batch,
      branch: userResponse.data.branch,
      campus: userResponse.data.campus,
      phone_number: userResponse.data.phone_number,
    },
  });
});

module.exports = router;
