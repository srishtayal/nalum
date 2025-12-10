const axios = require("axios");
const User = require("../models/user/user.model");

exports.uploadCv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const parserResponse = await axios.post("http://localhost:8000/parse", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.json(parserResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error parsing the CV." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const profileData = req.body;

    const user = await User.findByIdAndUpdate(userId, { profile: profileData, profileCompleted: true }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Profile updated successfully.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating the profile." });
  }
};

exports.getProfileStatus = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ profileCompleted: user.profileCompleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting profile status." });
  }
};