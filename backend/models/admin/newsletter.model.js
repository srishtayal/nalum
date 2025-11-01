const mongoose = require("mongoose");
const { Schema } = mongoose;

const NewsletterSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    file_url: {
      type: String,
      required: true,
    },
    file_name: {
      type: String,
      required: true,
    },
    file_size: {
      type: Number, // in bytes
      required: true,
    },
    uploaded_by: {
      type: String, // admin username
      required: true,
    },
    view_count: {
      type: Number,
      default: 0,
    },
    download_count: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    published_date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
NewsletterSchema.index({ is_active: 1, published_date: -1 });

const Newsletter = mongoose.model("Newsletter", NewsletterSchema);

module.exports = Newsletter;
