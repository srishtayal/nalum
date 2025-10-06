const express = require("express");
const router = express.Router();
const sessions = require("../../controllers/session.controller.js");

router.post("/", async (req, res) => {
  // get cookie
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    return res.status(401).json({
      err: true,
      code: 401,
      message: "No refresh token provided",
    });
  }

  const data = await sessions.updateAccessToken(refresh_token);
  if (data.error) {
    return res.status(400).json(data);
  }

  // store refresh token in httpOnly cookie only and don't expose it in the response
  const { refresh_token: new_refresh_token, ...rest } = data.data;
  res.cookie("refresh_token", new_refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  return res.status(200).json({ error: false, data: rest });
});

module.exports = router;
