const express = require("express");
const router = express.Router();

const sessions = require("../../controllers/session.controller.js");

router.post("/", async (req, res) => {
  if (!req.body.refresh_token) {
    return res.status(401).json({
      err: true,
      code: 400,
      message: "Required details are not provided",
    });
  }

  const { refresh_token } = req.body;

  let data = await sessions.delete(refresh_token);

  if (data.error) {
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
});

module.exports = router;
