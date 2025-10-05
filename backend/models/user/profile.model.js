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
      snapchat: String,
      github: String,
    },

    custom_cv: {
      type: String, // file path or URL
      default: null,
    },

    status: {
      type: String,
      enum: [
        "open for work",
        "open to recruit",
        "open to provide referral",
        "none",
      ],
      default: "none",
    },

    linkedin_auto_updates: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
