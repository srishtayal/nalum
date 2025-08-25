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
    code: {
      type: Number,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 1000 * 60 * 30), // 30 min
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
