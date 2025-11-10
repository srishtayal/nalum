const express = require("express");
const router = express.Router();
const Profile = require("../../models/user/profile.model");
const { protect } = require("../../middleware/auth");

// GET /profile/me - Get current user's profile
router.get("/", protect, async (req, res) => {
  try {
    // User ID from auth middleware
    const userId = req.user.user_id;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated." });
    }

    // Find profile and populate user info
    const profile = await Profile.findOne({ user: userId }).populate("user", "name email role");
    
    if (!profile) {
      return res
        .status(404)
        .json({ error: "Profile not found." });
    }
    
    res.status(200).json({ profile });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: err.message || "Internal server error." });
  }
});

module.exports = router;
