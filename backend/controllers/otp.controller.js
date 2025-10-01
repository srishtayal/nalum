const otpSchema = require("../models/auth/otp.model.js");
const crypto = require("crypto");

// Create or update OTP
exports.create = async (email) => {
  try {
    const existing = await otpSchema.findOne({ email: email.toLowerCase() });

    // prevent spamming resend (e.g., 60 seconds cooldown)
    if (existing && (Date.now() - existing.last_sent_at.getTime()) < 60 * 1000) {
      return { error: true, message: "Please wait before requesting another OTP" };
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 5); // 5 min

    const doc = await otpSchema.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp, expires_at: expiresAt, last_sent_at: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return { error: false, data: doc };
  } catch (err) {
    return { error: true, message: err.message || "Error creating OTP" };
  }
};


exports.find = async (email, otp) => {
    try {
        const data = await otpSchema.findOne({
            email: email.toLowerCase(),
            otp: otp
        });
        if (!data) {
            return { error: true, message: "OTP not found" };
        }
        if (data.expires_at < new Date()) {
            return { error: true, message: "OTP expired" };
        }

        return { error: false, data: data };
    }
    catch (err) {
        return {
            error: true,
            message: err.message || "Error while searching for OTP"
        };
    }
};
exports.remove = async (email, otp) => {
    try {
        await otpSchema.deleteOne({
            email: email.toLowerCase(),
            otp: otp
        });
        return { error: false, message: "OTP removed successfully" };
    }
    catch (err) {
        return {
            error: true,
            message: err.message || "Error while removing OTP"
        };
    }
};
// For debugging purposes only
exports.debugsend = (email, otp) => {
    try {
        // Send OTP via email
        console.log(`Sending OTP ${otp} to email: ${email}`);
        return { error: false, message: "OTP sent successfully" };
    } catch (err) {
        return { error: true, message: err.message || "Error sending OTP email" };
    }
};