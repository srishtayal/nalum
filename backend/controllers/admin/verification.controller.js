const VerificationQueue = require("../../models/verificationQueue.model");
const User = require("../../models/user/user.model");
const { logAdminActivity } = require("../../middleware/adminAuth");

// Get all pending verifications
exports.getVerificationQueue = async (req, res) => {
  try {
    console.log("[VerificationController] getVerificationQueue called");
    console.log("[VerificationController] Query params:", req.query);
    console.log("[VerificationController] Admin user:", req.user?.email);
    
    const { page = 1, limit = 10, status = "pending" } = req.query;

    const queue = await VerificationQueue.find()
      .populate("user", "name email role createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    console.log("[VerificationController] Found queue items:", queue.length);
    console.log("[VerificationController] Queue data:", JSON.stringify(queue, null, 2));

    const total = await VerificationQueue.countDocuments();
    console.log("[VerificationController] Total queue items:", total);

    res.status(200).json({
      success: true,
      data: queue,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[VerificationController] Error fetching verification queue:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching verification queue",
    });
  }
};

// Approve verification
exports.approveVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { notes } = req.body;

    // Find the verification request
    const verificationRequest = await VerificationQueue.findOne({
      user: userId,
    });

    if (!verificationRequest) {
      return res.status(404).json({
        success: false,
        message: "Verification request not found",
      });
    }

    // Find and update the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user's alumni verification status
    user.verified_alumni = true;
    await user.save();

    // Remove from queue
    await VerificationQueue.findByIdAndDelete(verificationRequest._id);

    // Log activity
    await logAdminActivity(
      req.admin.email,
      "approve_verification",
      "user",
      userId,
      {
        user_name: user.name,
        user_email: user.email,
        notes: notes || "",
      },
      req.ip
    );

    res.status(200).json({
      success: true,
      message: "Verification approved successfully",
    });
  } catch (error) {
    console.error("Error approving verification:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while approving verification",
    });
  }
};

// Reject verification
exports.rejectVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    // Find the verification request
    const verificationRequest = await VerificationQueue.findOne({
      user: userId,
    });

    if (!verificationRequest) {
      return res.status(404).json({
        success: false,
        message: "Verification request not found",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove from queue
    await VerificationQueue.findByIdAndDelete(verificationRequest._id);

    // Log activity
    await logAdminActivity(
      req.admin.email,
      "reject_verification",
      "user",
      userId,
      {
        user_name: user.name,
        user_email: user.email,
        reason,
      },
      req.ip
    );

    // TODO: Send email notification to user about rejection

    res.status(200).json({
      success: true,
      message: "Verification rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting verification:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while rejecting verification",
    });
  }
};

// Get verification statistics
exports.getVerificationStats = async (req, res) => {
  try {
    const totalPending = await VerificationQueue.countDocuments();
    const totalVerified = await User.countDocuments({ verified_alumni: true });
    const totalUnverified = await User.countDocuments({
      role: "alumni",
      verified_alumni: false,
    });

    res.status(200).json({
      success: true,
      stats: {
        pending: totalPending,
        verified: totalVerified,
        unverified: totalUnverified,
      },
    });
  } catch (error) {
    console.error("Error fetching verification stats:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching statistics",
    });
  }
};
