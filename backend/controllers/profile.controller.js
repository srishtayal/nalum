const Profile = require("../models/user/profile.model");

// Helper to resolve user id from request
function resolveUserId(req) {
  return (
    req.params?.userId ||
    req.body?.userId ||
    (req.user && (req.user.user_id || req.user.id || req.user._id)) ||
    null
  );
}

// Retrieve a single profile (by token or params)
exports.findOne = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return res.status(400).send({ message: "User id is required" });
    }

    const profile = await Profile.findOne({ user: userId }).populate("user", "-password");

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

// Update a profile (by token or params)
exports.update = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return res.status(400).send({ message: "User id is required" });
    }

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).send({ message: "Profile not found" });
    }

    const allowedUpdates = [
      "name",
      "batch",
      "branch",
      "campus",
      "skills",
      "experience",
      "education",
      "honours",
      "projects",
      "publications",
      "social_media",
      "custom_cv",
      "status",
    ];

    for (const key of allowedUpdates) {
      if (req.body[key] === undefined) continue;

      if (key === "social_media") {
        // Merge existing social_media object with provided fields
        profile.social_media = {
          ...profile.social_media,
          ...req.body.social_media,
        };
      } else {
        profile[key] = req.body[key];
      }
    }

    const updatedProfile = await profile.save();

    // avoid returning user password
    await updatedProfile.populate("user", "-password").execPopulate?.();

    res.send(updatedProfile);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while updating the profile.",
    });
  }
};
