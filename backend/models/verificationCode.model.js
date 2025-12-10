const mongoose = require("mongoose");

const VerificationCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      length: 10,
    },
    generated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    used_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  is_used: {
      type: Boolean,
      default: false,
    },
    used_at: {
      type: Date,
      default: null,
    },
    expires_at: {
      type: Date,
      required: true,
      default: function() {
        // Codes expire after 7 days
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        return expiryDate;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
VerificationCodeSchema.index({ code: 1 });
VerificationCodeSchema.index({ is_used: 1, expires_at: 1 });
VerificationCodeSchema.index({ generated_by: 1, createdAt: -1 });

// Method to check if code is valid
VerificationCodeSchema.methods.isValid = function() {
  return !this.is_used && new Date() < this.expires_at;
};

// Static method to check rate limit (max 5 codes per minute per admin)
VerificationCodeSchema.statics.checkRateLimit = async function(adminId) {
  const oneMinuteAgo = new Date();
  oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
  
  const recentCodesCount = await this.countDocuments({
    generated_by: adminId,
    createdAt: { $gte: oneMinuteAgo },
  });
  
  return recentCodesCount < 5;
};

const VerificationCode = mongoose.model(
  "VerificationCode",
  VerificationCodeSchema
);

module.exports = VerificationCode;
