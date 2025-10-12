const mongoose = require("mongoose");

const currentYear = new Date().getFullYear();
function parseDuration(value) {
  if (value === undefined || value === null || value === "") return undefined;

  // already normalized object
  if (typeof value === "object") {
    const start = value.start ? Number(value.start) : undefined;
    const present = !!value.present || (String(value.end || "").toLowerCase() === "present");
    const endRaw = present ? null : (value.end !== undefined ? Number(value.end) : undefined);
    const end = endRaw === null ? null : isFinite(endRaw) ? endRaw : undefined;
    if (start && (present || end !== undefined)) {
      return { start, end, present };
    }
    return undefined;
  }

  if (typeof value === "number") {
    return { start: value, end: null, present: true };
  }

  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    // split on hyphen
    const parts = s.split("-").map((p) => p.trim());
    if (parts.length === 2) {
      const start = Number(parts[0]);
      const right = parts[1];
      if (right === "present") {
        if (!isFinite(start)) return undefined;
        return { start, end: null, present: true };
      }
      const end = Number(right);
      if (!isFinite(start) || !isFinite(end)) return undefined;
      return { start, end, present: false };
    }
    const single = Number(s);
    if (isFinite(single)) {
      return { start: single, end: null, present: true };
    }
  }
  return undefined;
}

const durationSchema = new mongoose.Schema(
  {
    start: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => Number.isInteger(v) && v >= 1900 && v <= currentYear + 5,
        message: (props) => `Invalid start year: ${props.value}`,
      },
    },
    end: {
      // null when present=true
      type: Number,
      required: false,
      validate: {
        validator: function (v) {
          // allow null for present
          if (v === null || v === undefined) return true;
          return Number.isInteger(v) && v >= 1900 && v <= currentYear + 5 && (!this.start || v >= this.start);
        },
        message: (props) => `Invalid end year: ${props.value}`,
      },
    },
    present: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// nice human readable virtual
durationSchema.virtual("display").get(function () {
  if (!this.start) return "";
  if (this.present) return `${this.start}-present`;
  if (this.end) return `${this.start}-${this.end}`;
  return String(this.start);
});

// profile schema with duration subdocuments for experience/education/projects
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
        duration: {
          type: durationSchema,
          set: parseDuration,
        },
      },
    ],
    batch: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
      lowercase: true,
    },
    campus: {
      type: String,
      required: true,
      enum: ["MAIN", "WEST", "EAST"],
    },
    education: [
      {
        degree: String,
        institution: String,
        duration: {
          type: durationSchema,
          set: parseDuration,
        },
      },
    ],

    honors: [
      {
        title: String
      },
    ],

    publications: [
      {
        title: String
      },
    ],
    certifications : [
      {
        title: String
      },
    ],
    social_media: {
      instagram: String,
      facebook: String,
      linkedin: String,
      github: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);