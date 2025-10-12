const express = require("express");
const router = express.Router();
const User = require("../../models/user/user.model");
const { protect } = require("../../middleware/auth");

router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.user_id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ profileCompleted: user.profileCompleted });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;