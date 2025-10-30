const mongoose = require("mongoose");
const { Schema } = mongoose;

const BanSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    banned_by: {
      type: String, // admin username
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      enum: ["24h", "7d", "30d", "365d", "permanent"],
      required: true,
    },
    ban_expires_at: {
      type: Date,
      default: null, // null for permanent bans
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    unbanned_at: {
      type: Date,
      default: null,
    },
    unbanned_by: {
      type: String, // admin username or "system" for auto-unban
      default: null,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
BanSchema.index({ user: 1, is_active: 1 });
BanSchema.index({ ban_expires_at: 1 });

const Ban = mongoose.model("Ban", BanSchema);

module.exports = Ban;
