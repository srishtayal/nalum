const express = require("express");
const router = express.Router();
const Profile = require("../../models/user/profile.model");
const { protect } = require("../../middleware/auth");
const User = require("../../models/user/user.model");
// POST /profile
router.post("/", protect, async (req, res) => {
  try {
    // User ID from auth middleware
    const userId = req.user.user_id;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated." });
    }

    const {
      education = [],
      experience = [],
      skills = [],
      publications = [],
      honors = [],
      certifications = [],
      batch,
      branch,
      campus,
      social_media = {},
    } = req.body;

    // Validate required fields
    if (!batch || !branch || !campus) {
      return res
        .status(400)
        .json({ error: "Missing required fields: batch, branch, or campus." });
    }

    // Check for existing profile
    const existing = await Profile.findOne({ user: userId });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Profile already exists for this user." });
    }

    // Create and save the profile
    const profile = new Profile({
      user: userId,
      education,
      experience,
      skills,
      publications,
      honors,
      certifications,
      batch,
      branch,
      campus,
      social_media,
    });
    await profile.save();
    await User.findByIdAndUpdate(userId, { profileCompleted: true });
    res.status(201).json({ message: "Profile created successfully.", profile });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error." });
  }
});

module.exports = router;