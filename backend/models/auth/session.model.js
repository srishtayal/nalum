const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const sessionSchema = new mongoose.Schema(
  {
    access_token: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^\S+@\S+\.\S+$/.test(v),
        message: "Invalid email format",
      },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    refresh_token: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    fingerprint: {
      type: String,
      required: true,
    },
    refresh_token_expires_at: {
  type: Date,
  required: true,
  default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
  expires: 0, // auto-delete right when this date is passed
},
access_token_expires_at: {
  type: Date,
  required: true,
  default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
  expires: 0,
}
}, { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
