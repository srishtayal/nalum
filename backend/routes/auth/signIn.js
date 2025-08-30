const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const users = require("../../controllers/user.controller.js");
const sessions = require("../../controllers/session.controller.js");

router.post("/", async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.fingerprint) {
    return res.status(401).json({
      err: true,
      code: 401,
      message: "Required credentials not provided",
    });
  }

  const { email, password, fingerprint } = req.body;
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

  const sessionData = await sessions.create(
    email,
    fingerprint,
    data.data._id
  );

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
    data: rest,
  });
});

module.exports = router;
