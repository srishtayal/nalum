const express = require("express");
const router = express.Router();
const Profile = require("../../models/user/profile.model");
const { protect } = require("../../middleware/auth");
const uploadProfilePicture = require("../../config/profilePicture.multer");
const fs = require("fs");
const path = require("path");

// POST /profile/picture - Upload or update profile picture
router.post("/picture", protect, uploadProfilePicture.single("profile_picture"), async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    // Find user's profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    // Delete old profile picture if exists
    if (profile.profile_picture) {
      const oldFilePath = path.join(__dirname, "../..", profile.profile_picture);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update profile with new picture path
    const newProfilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;
    profile.profile_picture = newProfilePicturePath;
    await profile.save();

    res.status(200).json({ 
      message: "Profile picture updated successfully.",
      profile_picture: newProfilePicturePath
    });
  } catch (err) {
    console.error("Profile picture upload error:", err);
    res.status(500).json({ error: err.message || "Internal server error." });
  }
});

// DELETE /profile/picture - Remove profile picture
router.delete("/picture", protect, async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    // Delete profile picture file if exists
    if (profile.profile_picture) {
      const filePath = path.join(__dirname, "../..", profile.profile_picture);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      profile.profile_picture = null;
      await profile.save();
    }

    res.status(200).json({ message: "Profile picture removed successfully." });
  } catch (err) {
    console.error("Profile picture deletion error:", err);
    res.status(500).json({ error: err.message || "Internal server error." });
  }
});

module.exports = router;
