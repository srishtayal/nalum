const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["post", "event", "user"],
      default: "post",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: function () {
        return this.type === "post";
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "Spam",
        "Inappropriate Content",
        "Harassment or Hate Speech",
        "Misinformation",
        "Violence or Dangerous Content",
        "Copyright Violation",
        "Other",
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "post rejected", "dismissed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

reportSchema.index({ postId: 1, userId: 1 }, { unique: true });
reportSchema.index({ type: 1 });
reportSchema.index({ status: 1 });

module.exports = mongoose.model("Report", reportSchema);
