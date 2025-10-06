const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    skills: [String],

    experience: [
      {
        role: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
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
    education: [
      {
        degree: String,
        institution: String,
        duration: String,
      },
    ],

    honours: [
      {
        title: String,
        awarding_body: String,
        date: Date,
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        duration: String,
        technologies: [String],
      },
    ],

    publications: [
      {
        title: String,
        journal: String,
        date: Date,
        description: String,
      },
    ],

    social_media: {
      instagram: String,
      facebook: String,
      linkedin: String,
      github: String,
    },


    status: {
      type: String,
      enum: [
        "open_for_work",
        "open_to_recruit",
        "open to provide referral",
        "none",
      ],
      default: "none",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
