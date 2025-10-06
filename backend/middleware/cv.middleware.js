const User = require("../models/user/user.model");

const uploadCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    user.customCV = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await user.save();
    res.send("CV uploaded successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};

const updateCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    user.customCV = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await user.save();
    res.send("CV updated successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};

const deleteCV = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    user.customCV = undefined;
    await user.save();
    res.send("CV deleted successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};

module.exports = { uploadCV, updateCV, deleteCV };
