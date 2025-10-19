const mongoose = require("mongoose");

const VerificationCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    is_used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const VerificationCode = mongoose.model(
  "VerificationCode",
  VerificationCodeSchema
);

module.exports = VerificationCode;
