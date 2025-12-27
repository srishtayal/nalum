const express = require("express");
const router = express.Router();
const Profile = require("../../models/user/profile.model");
const { protect } = require("../../middleware/auth");
const User = require("../../models/user/user.model");
const uploadProfilePicture = require("../../config/profilePicture.multer");
const { compressionPresets } = require("../../middleware/imageCompression");

// POST /profile - Create profile with optional profile picture
router.post("/", protect, uploadProfilePicture.single("profile_picture"), compressionPresets.profilePicture, async (req, res) => {
  try {
    // User ID from auth middleware
    const userId = req.user.user_id;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated." });
    }

    // Parse JSON fields from FormData
    let socialMedia = {};
    let skills = [];
    let experience = [];

    if (req.body.social_media) {
      try {
        socialMedia = JSON.parse(req.body.social_media);
      } catch (e) {
        socialMedia = req.body.social_media;
      }
    }

    if (req.body.skills) {
      try {
        skills = JSON.parse(req.body.skills);
      } catch (e) {
        skills = [];
      }
    }

    if (req.body.experience) {
      try {
        experience = JSON.parse(req.body.experience);
      } catch (e) {
        experience = [];
      }
    }

    const {
      batch,
      branch,
      campus,
      current_company,
      current_role,
    } = req.body;

    // Validate required fields
    if (!batch || !branch || !campus) {
      return res
        .status(400)
        .json({ error: "Missing required fields: batch, branch, or campus." });
    }

    // Validate campus enum
    const validCampuses = ["Main Campus", "East Campus", "West Campus"];
    if (!validCampuses.includes(campus)) {
      return res
        .status(400)
        .json({ error: `Invalid campus. Must be one of: ${validCampuses.join(", ")}` });
    }

    // Check for existing profile
    const existing = await Profile.findOne({ user: userId });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Profile already exists for this user." });
    }

    // Handle profile picture upload
    let profilePicturePath = null;
    if (req.file) {
      profilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;
    }

    // Create and save the profile
    const profile = new Profile({
      user: userId,
      batch,
      branch,
      campus,
      current_company,
      current_role,
      profile_picture: profilePicturePath,
      social_media: socialMedia,
      skills: skills,
      experience: experience,
    });
    
    await profile.save();
    await User.findByIdAndUpdate(userId, { profileCompleted: true });
    
    res.status(201).json({ message: "Profile created successfully.", profile });
  } catch (err) {
    console.error("Profile creation error:", err);
    res.status(500).json({ error: err.message || "Internal server error." });
  }
});

module.exports = router;