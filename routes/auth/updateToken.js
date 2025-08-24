const express = require("express");
const router = express.Router();

const sessions = require("../../controllers/session.controller.js");

router.post("/", async (req, res) => {
  if (!req.body.refresh_token || !req.body.fingerprint) {
    return res.status(401).json({
      err: true,
      code: 400,
      message: "Required details are not provided",
    });
  }

  const { refresh_token, fingerprint } = req.body;

  let data = await sessions.updateAccessToken(refresh_token, fingerprint);

  if (data.error) {
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
});

module.exports = router;
