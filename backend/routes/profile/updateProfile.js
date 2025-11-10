const express = require("express");
const router = express.Router();
const Profile = require("../../models/user/profile.model");
const { protect } = require("../../middleware/auth");

// PUT /profile/update - Update existing profile
router.put("/", protect, async (req, res) => {
  try {
    // User ID from auth middleware
    const userId = req.user.user_id;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated." });
    }

    const {
      batch,
      branch,
      campus,
      current_company,
      current_role,
      social_media,
      skills,
      experience,
    } = req.body;

    // Validate required fields if provided
    if (batch !== undefined || branch !== undefined || campus !== undefined) {
      if (!batch || !branch || !campus) {
        return res
          .status(400)
          .json({ error: "If updating academic info, batch, branch, and campus are all required." });
      }
    }

    // Validate campus enum if provided
    if (campus) {
      const validCampuses = ["Dwarka", "East Campus", "Ambedkar Institute"];
      if (!validCampuses.includes(campus)) {
        return res
          .status(400)
          .json({ error: `Invalid campus. Must be one of: ${validCampuses.join(", ")}` });
      }
    }

    // Find existing profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res
        .status(404)
        .json({ error: "Profile not found. Please create a profile first." });
    }

    // Update fields
    if (batch !== undefined) profile.batch = batch;
    if (branch !== undefined) profile.branch = branch;
    if (campus !== undefined) profile.campus = campus;
    if (current_company !== undefined) profile.current_company = current_company;
    if (current_role !== undefined) profile.current_role = current_role;
    if (social_media !== undefined) profile.social_media = { ...profile.social_media, ...social_media };
    if (skills !== undefined) profile.skills = skills;
    if (experience !== undefined) profile.experience = experience;

    await profile.save();
    
    res.status(200).json({ message: "Profile updated successfully.", profile });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: err.message || "Internal server error." });
  }
});

module.exports = router;
