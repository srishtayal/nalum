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
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["student", "alumni"],
      required: true,
    },
    customCV: {
      data: Buffer,
      contentType: String,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
