const { nanoid } = require("nanoid");
const VerificationCode = require("../../models/verificationCode.model");

/**
 * Generate verification codes (max 5 per minute per admin)
 */
exports.generateCodes = async (req, res) => {
  try {
    const { count = 1 } = req.body;
    const adminId = req.admin._id;

    // Validate count
    if (count < 1 || count > 5) {
      return res.status(400).json({
        success: false,
        message: "You can generate between 1 and 5 codes at a time",
      });
    }

    // Check rate limit
    const withinLimit = await VerificationCode.checkRateLimit(adminId);
    if (!withinLimit) {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded. Maximum 5 codes can be generated per minute.",
      });
    }

    // Generate codes
    const codes = [];
    for (let i = 0; i < count; i++) {
      const code = nanoid(10); // 10-character code
      const verificationCode = await VerificationCode.create({
        code,
        generated_by: adminId,
      });
      codes.push({
        code: verificationCode.code,
        expires_at: verificationCode.expires_at,
        id: verificationCode._id,
      });
    }

    res.status(201).json({
      success: true,
      message: `Successfully generated ${count} verification code(s)`,
      data: codes,
    });
  } catch (error) {
    console.error("Error generating verification codes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate verification codes",
      error: error.message,
    });
  }
};

/**
 * Get all generated codes with filters
 */
exports.getAllCodes = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = "all" } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    
    // Filter by status
    if (status === "active") {
      filter = { is_used: false, expires_at: { $gt: new Date() } };
    } else if (status === "used") {
      filter = { is_used: true };
    } else if (status === "expired") {
      filter = { is_used: false, expires_at: { $lte: new Date() } };
    }

    const codes = await VerificationCode.find(filter)
      .populate("generated_by", "name email")
      .populate("used_by", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await VerificationCode.countDocuments(filter);

    res.json({
      success: true,
      data: codes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching verification codes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch verification codes",
      error: error.message,
    });
  }
};

/**
 * Get code statistics
 */
exports.getCodeStats = async (req, res) => {
  try {
    const now = new Date();
    
    const [total, active, used, expired] = await Promise.all([
      VerificationCode.countDocuments(),
      VerificationCode.countDocuments({ is_used: false, expires_at: { $gt: now } }),
      VerificationCode.countDocuments({ is_used: true }),
      VerificationCode.countDocuments({ is_used: false, expires_at: { $lte: now } }),
    ]);

    res.json({
      success: true,
      stats: {
        total,
        active,
        used,
        expired,
      },
    });
  } catch (error) {
    console.error("Error fetching code statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch code statistics",
      error: error.message,
    });
  }
};

/**
 * Delete expired codes (cleanup)
 */
exports.deleteExpiredCodes = async (req, res) => {
  try {
    const result = await VerificationCode.deleteMany({
      is_used: false,
      expires_at: { $lte: new Date() },
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} expired codes`,
      deleted: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting expired codes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete expired codes",
      error: error.message,
    });
  }
};
