const mongoose = require("mongoose");
const { Schema } = mongoose;

const VerificationQueueSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    details_provided: {
      name: {
        type: String,
        required: true,
      },
      roll_no: {
        type: String,
      },
      batch: {
        type: String,
        required: true,
      },
      branch: {
        type: String,
        required: true,
      },
    },
    contact_info: {
      phone: {
        type: String,
      },
      alternate_email: {
        type: String,
      },
      linkedin: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const VerificationQueue = mongoose.model(
  "VerificationQueue",
  VerificationQueueSchema
);

module.exports = VerificationQueue;
