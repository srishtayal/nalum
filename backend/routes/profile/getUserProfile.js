const express = require("express");
const router = express.Router();
const Profile = require("../../models/user/profile.model");
const { protect } = require("../../middleware/auth");

// GET /profile/user/:userId - Get any user's profile by user ID
router.get("/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Find profile and populate user info
    const profile = await Profile.findOne({ user: userId }).populate("user", "name email role");
    
    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }
    
    res.status(200).json({ profile });
  } catch (err) {
    console.error("Get user profile error:", err);
    res.status(500).json({ error: err.message || "Internal server error." });
  }
});

module.exports = router;
