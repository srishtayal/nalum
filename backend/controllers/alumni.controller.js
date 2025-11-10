const axios = require("axios");
const { nanoid } = require("nanoid");
const VerificationCode = require("../models/verificationCode.model.js");
const User = require("../models/user/user.model.js");
const VerificationQueue = require("../models/verificationQueue.model.js");
exports.getVerificationStatus = async (req, res) => {
  try {
    const { user_id } = req.user;
    
    // Find the user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Return the verification status
    return res.status(200).json({
      success: true,
      verified_alumni: user.verified_alumni,
    });
  } catch (error) {
    console.error("Error fetching verification status:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching verification status",
    });
  }
};

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
    const { user_id } = req.user;

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

    // If no matches found, add to admin verification queue
    if (!matches || matches.length === 0) {
      // Check if user already has a pending request
      const existingRequest = await VerificationQueue.findOne({ user: user_id });
      
      if (!existingRequest) {
        await VerificationQueue.create({
          user: user_id,
          details_provided: {
            name,
            roll_no,
            batch,
            branch,
          },
        });
      }
    }

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

exports.getQueue = async (req, res) => {
  try {
    // Get all pending verification requests with user details
    const queue = await VerificationQueue.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      queue: queue,
    });
  } catch (error) {
    console.error("Error fetching verification queue:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the queue",
    });
  }
};

exports.approveFromQueue = async (req, res) => {
  try {
    const { userId } = req.params;

    // Update user's verification status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.verified_alumni = true;
    await user.save();

    // Remove from queue
    await VerificationQueue.deleteOne({ user: userId });

    return res.status(200).json({
      success: true,
      message: "User verification approved successfully",
    });
  } catch (error) {
    console.error("Error approving verification:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while approving verification",
    });
  }
};

exports.denyFromQueue = async (req, res) => {
  try {
    const { userId } = req.params;

    // Remove from queue
    const result = await VerificationQueue.deleteOne({ user: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Verification request not found in queue",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verification request denied and removed from queue",
    });
  } catch (error) {
    console.error("Error denying verification:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while denying verification",
    });
  }
};
