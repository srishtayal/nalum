const Profile = require("../models/user/profile.model");

// Retrieve a single profile with userId
exports.findOne = async (req, res) => {
  try {
    const user = req.user.user_id;
    const profile = await Profile.findOne({ user }).populate("user");

    if (!profile) {
      return res.status(404).send({ message: "Profile not found" });
    }

    res.send(profile);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving the profile.",
    });
  }
};

// Update a profile with userId
exports.update = async (req, res) => {
  try {
    const user = req.user.user_id;
    const profile = await Profile.findOne({ user });

    if (!profile) {
      return res.status(404).send({ message: "Profile not found" });
    }

    const allowedUpdates = [
      "skills",
      "experience",
      "education",
      "honours",
      "projects",
      "publications",
      "social_media",
      "custom_cv",
      "status",
      "linkedin_auto_updates",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    Object.assign(profile, updates);

    const updatedProfile = await profile.save();

    res.send(updatedProfile);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while updating the profile.",
    });
  }
};
