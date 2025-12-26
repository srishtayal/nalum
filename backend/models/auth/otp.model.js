const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^\S+@\S+\.\S+$/.test(v),
        message: "Invalid email format",
      },
    },
    otp: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
    },
    last_sent_at: { 
        type: Date, 
        default: Date.now 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", otpSchema);
