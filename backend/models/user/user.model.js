const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    batch: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    campus: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\d{10}$/.test(v), // adjust regex as needed
        message: "Invalid phone number",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    referral_code: {
      type: String,
      default: null,
    },
    identity_proof: {
      type: String, // store file path / cloud URL
      default: null,
    },
    email_verified: {
      type: Boolean,
      default: false, // set true after email verification
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
