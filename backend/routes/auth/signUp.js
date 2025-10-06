const express = require("express");
const bcrypt = require("bcrypt");
const userController = require("../../controllers/user.controller");
const { validateSignup } = require("../../middleware/validation");
const router = express.Router();

const upload = require("../../config/multer.config");

// Signup route with validation and multer middleware
router.post("/", upload.single("custom_cv"), validateSignup, async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      name,
      batch,
      branch,
      campus,
      skills,
      experience,
      education,
      honours,
      projects,
      publications,
      social_media,
      status
    } = req.body;

    // Check if user already exists
    const existingUserResult = await userController.findOne(email);
    if (!existingUserResult.error && existingUserResult.data) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Prepare user data with hashed password
    const userData = {
      email,
      password: hashedPassword,
      role,
      name,
      batch,
      branch,
      campus,
      skills,
      experience,
      education,
      honours,
      projects,
      publications,
      social_media,
      status
    };

    if (req.file) {
      userData.customCV = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }


    // Create user and profile
    const result = await userController.create(userData);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = result.data.user.toObject();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: userWithoutPassword,
        profile: result.data.profile
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
});

module.exports = router;
