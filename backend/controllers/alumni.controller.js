const axios = require("axios");
const { nanoid } = require("nanoid");
const VerificationCode = require("../models/verificationCode.model.js");
const User = require("../models/user/user.model.js");

exports.verifyCode = async (req, res) => {
  try {
    const { code } = req.body;
    const { user_id } = req.user;

    // Check if code is provided
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required",
      });
    }

    // Find the user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is already verified
    if (user.verified_alumni) {
      return res.status(400).json({
        success: false,
        message: "User is already verified",
      });
    }

    // Find the verification code
    const verificationCode = await VerificationCode.findOne({
      code: code,
      is_used: false,
    });

    if (!verificationCode) {
      return res.status(404).json({
        success: false,
        message: "Verification code is invalid or has already been used",
      });
    }

    // Mark the code as used
    verificationCode.is_used = true;
    await verificationCode.save();

    // Update user's alumni verification status
    user.verified_alumni = true;
    await user.save();

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Alumni status verified successfully",
    });
  } catch (error) {
    console.error("Error verifying alumni code:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying the code",
    });
  }
};

exports.generateCodes = async (req, res) => {
  try {
    const count = req.body.count || 1;

    // Generate the specified number of unique codes
    const codesToInsert = [];
    for (let i = 0; i < count; i++) {
      const code = nanoid(10);
      codesToInsert.push({ code });
    }

    // Insert all codes in a single operation
    const newCodes = await VerificationCode.insertMany(codesToInsert);

    return res.status(201).json({
      success: true,
      message: `${count} codes generated successfully`,
      codes: newCodes,
    });
  } catch (error) {
    console.error("Error generating verification codes:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating codes",
    });
  }
};

exports.checkManualVerification = async (req, res) => {
  try {
    const { name, roll_no, batch, branch } = req.body;

    // Get the microservice URL from environment variable
    const serviceUrl = process.env.ALUMNI_VERIFY_SERVICE_URL;
    const endpoint = `${serviceUrl}/alumni/verify`;

    // Call the alumni verification microservice
    const response = await axios.post(endpoint, {
      name,
      roll_no,
      batch,
      branch,
    });

    // Extract matches from the microservice response
    const matches = response.data.matches;

    return res.status(200).json({
      success: true,
      matches: matches,
    });
  } catch (error) {
    console.error("Error checking manual verification:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking manual verification",
    });
  }
};

exports.confirmManualMatch = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { roll_no } = req.body;

    // Check if roll_no is provided
    if (!roll_no) {
      return res.status(400).json({
        success: false,
        message: "Roll number of the selected match is required",
      });
    }

    // Find the user and update their verification status
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user's alumni verification status
    user.verified_alumni = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User successfully verified.",
    });
  } catch (error) {
    console.error("Error confirming manual match:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while confirming verification",
    });
  }
};
