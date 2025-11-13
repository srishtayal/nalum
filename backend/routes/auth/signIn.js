const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const users = require("../../controllers/user.controller.js");
const sessions = require("../../controllers/session.controller.js");

router.post("/", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).json({
      err: true,
      code: 401,
      message: "Required credentials not provided",
    });
  }

  const { email, password } = req.body;
  let data = await users.findOne(email);

  if (data.error) {
    return res.status(500).json({
      err: true,
      code: 500,
      message: "Internal server error",
    });
  } else if (data.data == null) {
    return res.status(401).json({
      err: true,
      code: 401,
      message: "No User",
    });
  }
  if (data.data.email_verified === false) {
    return res.status(401).json({
      err: true,
      code: 401,
      message: "Email not verified",
    });
  }
  
  // Check student verification timeout (30 days)
  if (data.data.role === "student" && data.data.isStudentVerificationExpired()) {
    return res.status(403).json({
      err: true,
      code: 403,
      message: "Your email verification has expired. Please verify your @nsut.ac.in email again.",
      verification_expired: true,
    });
  }
  
  let matched;

  try {
    matched = await bcrypt.compare(password, data.data.password);
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }

  if (!matched) {
    return res.status(401).json({
      err: true,
      code: 401,
      user: "Unauthorized: Incorrect Password",
    });
  }

  const sessionData = await sessions.getOrCreate(email, data.data._id);

  if (sessionData.error) {
    return res.status(500).json(sessionData);
  }

  const { refresh_token, ...rest } = sessionData.data;
  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  return res.status(200).json({
    error: false,
    data: {
      ...rest,
      user: {
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        email_verified: data.data.email_verified,
        profileCompleted: data.data.profileCompleted,
        verified_alumni: data.data.verified_alumni,
      },
    },
  });
});

module.exports = router;
