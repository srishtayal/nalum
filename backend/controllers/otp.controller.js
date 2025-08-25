const Otp = require("../models/auth/otp.model.js");

// Create or update OTP
exports.create = async (email, otp) => {
  try {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    const doc = await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { code: otp, expires_at: expiresAt },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return { error: false, data: doc };
  } catch (err) {
    return {
      error: true,
      message: err.message || "Some error occurred while saving the OTP.",
    };
  }
};

// Find OTP
exports.find = async (email) => {
  try {
    const data = await Otp.findOne({ email: email.toLowerCase() });
    if (!data) {
      return { error: true, message: "OTP not found" };
    }
    if (data.expires_at < new Date()) {
      return { error: true, message: "OTP expired" };
    }
    return { error: false, data: data };
  } catch (err) {
    return {
      error: true,
      message: err.message || "Error while searching for OTP",
    };
  }
};
