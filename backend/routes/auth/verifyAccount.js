const express = require("express");
const router = express.Router();

const users = require("../../controllers/user.controller.js");
const otps = require("../../controllers/otp.controller.js");

router.post("/", async (req, res) => {
  if (!req.body.email || !req.body.code) {
    return res.status(401).json({
      err: true,
      code: 400,
      message: "Required credentials not provided",
    });
  }

  const { email, code } = req.body;

  let data = await otps.find(email);
  if (data.error) {
    return res.status(500).json(data);
  } else if (data.data == null) {
    return res
      .status(400)
      .json({ err: true, message: "No OTP Requested", code: 401 });
  }

  if (data.data.code != code) {
    return res
      .status(400)
      .json({ err: true, message: "Invalid OTP", code: 401 });
  }

  let userResponse = await users.update(email, { verified: true });

  return res
    .status(userResponse.error ? 500 : 200)
    .json(
      userResponse.error
        ? userResponse
        : { error: false, message: "User Verified Successfully" }
    );
});

module.exports = router;
