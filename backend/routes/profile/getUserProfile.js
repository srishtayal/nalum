const express = require("express");
const router = express.Router();
const Profile = require("../../models/user/profile.model");
const Connection = require("../../models/chat/connections.model");
const { protect } = require("../../middleware/auth");

// GET /profile/user/:userId - Get any user's profile by user ID
router.get("/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Find profile and populate user info
    const profile = await Profile.findOne({ user: userId }).populate(
      "user",
      "name email role"
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    // Add connection status
    let connectionStatus = "not_connected";

    // Check if viewing own profile
    const viewingOwnProfile = userId === req.user.user_id?.toString();

    if (!viewingOwnProfile && req.user && req.user.user_id) {
      // Query connection between current user and profile user
      const connection = await Connection.findOne({
        $or: [
          { requester: req.user.user_id, recipient: userId },
          { requester: userId, recipient: req.user.user_id },
        ],
      });

      if (connection) {
        connectionStatus = connection.status; // 'pending', 'accepted', 'rejected', 'blocked'
      }
    } else if (viewingOwnProfile) {
      connectionStatus = "self"; // viewing own profile
    }

    // Add connectionStatus to profile response
    const profileData = profile.toObject();
    profileData.connectionStatus = connectionStatus;

    res.status(200).json({ profile: profileData });
  } catch (err) {
    console.error("Get user profile error:", err);
    res.status(500).json({ error: err.message || "Internal server error." });
  }
});

module.exports = router;
