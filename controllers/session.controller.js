const Session = require("../models/auth/session.model.js"); // Mongoose model
const { v4: uuidv4 } = require("uuid");

// Create session
exports.create = async (email, fingerprint, user_id) => {
  if (!email || !fingerprint || !user_id) {
    return { error: true, message: "Credentials are required" };
  }

  try {
    const session = new Session({
      email: email.toLowerCase(),
      fingerprint,
      user_id,
    });

    const data = await session.save();
    const raw = data.toObject();
    delete raw.fingerprint; // hide fingerprint in response

    return { error: false, data: raw };
  } catch (err) {
    return { error: true, message: err.message };
  }
};

// Delete session
exports.delete = async (refresh_token, fingerprint) => {
  if (!refresh_token || !fingerprint) {
    return { error: true, message: "Refresh token and Fingerprint are required" };
  }

  try {
    await Session.deleteOne({ refresh_token, fingerprint });
    return { error: false };
  } catch (err) {
    return { error: true, message: err.message };
  }
};

// Validate Access Token
exports.validateAccessToken = async (access_token, fingerprint) => {
  if (!access_token || !fingerprint) {
    return { error: true, message: "Some details are missing" };
  }

  try {
    const data = await Session.findOne({ access_token, fingerprint });

    if (!data) {
      return { error: true, exists: false };
    }

    if (data.access_token_expires_at < new Date()) {
      return { error: false, exists: true, expired: true };
    }

    return {
      error: false,
      exists: true,
      expired: false,
      user_id: data.user_id,
    };
  } catch (err) {
    return {
      error: true,
      message: err.message || "Error while searching for access token.",
    };
  }
};

// Update Access Token
exports.updateAccessToken = async (refresh_token, fingerprint) => {
  if (!refresh_token || !fingerprint) {
    return { error: true, message: "Some details are missing" };
  }

  try {
    const data = await Session.findOne({ refresh_token, fingerprint });

    if (!data) {
      return { error: true, exists: false };
    }

    if (data.refresh_token_expires_at < new Date()) {
      return { error: true, exists: true, expired: true };
    }

    // delete old session
    await Session.deleteOne({ refresh_token, fingerprint });

    // create new session
    return await this.create(data.email, fingerprint, data.user_id);
  } catch (err) {
    return {
      error: true,
      message: err.message || "Error while updating the access token.",
    };
  }
};
