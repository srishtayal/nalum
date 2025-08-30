const Session = require("../models/auth/session.model.js");
const { generateAccessToken } = require("./jwt.controller.js");

// Create session with JWT access token
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
		// Generate JWT access token
		const accessToken = generateAccessToken({
			user_id: user_id,
			email: email,
			session_id: raw._id,
		});
		delete raw.fingerprint; // hide fingerprint in response
		return {
			error: false,
			data: { ...raw, access_token: accessToken },
		};
	} catch (err) {
		return { error: true, message: err.message };
	}
};

// Validate Access Token (now JWT)
exports.validateAccessToken = async (access_token, fingerprint) => {
	if (!access_token || !fingerprint) {
		return { error: true, message: "Some details are missing" };
	}
	try {
		const { verifyAccessToken } = require("./jwt.controller.js");
		const decoded = verifyAccessToken(access_token);
		// Check if session exists and matches fingerprint
		const data = await Session.findOne({ _id: decoded.session_id, fingerprint });
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
			decoded,
		};
	} catch (err) {
		return { error: true, message: err.message };
	}
};

// Update Access Token (refresh flow)
exports.updateAccessToken = async (refresh_token, fingerprint) => {
	if (!refresh_token || !fingerprint) {
		return { error: true, message: "Some details are missing" };
	}
	try {
		const data = await Session.findOne({ refresh_token, fingerprint });
		if (!data) {
			return { error: true, exists: false };
		}
		if (refresh_token_expires_at < new Date()) {
			return { error: true, exists: true, expired: true };
		}
		// Delete old session
		await Session.deleteOne({ refresh_token, fingerprint });
		// Create new session with new refresh token
		const newSession = await exports.create(data.email, fingerprint, data.user_id);
		return newSession;
	} catch (err) {
		return { error: true, message: err.message };
	}
};

// Delete session
exports.delete = async (refresh_token, fingerprint) => {
  if (!refresh_token || !fingerprint) {
    return { error: true, message: "Some details are missing" };
  }
  try {
    const result = await Session.deleteOne({ refresh_token, fingerprint });
    if (result.deletedCount === 0) {
      return { error: true, message: "Session not found" };
    }
    return { error: false, message: "Session deleted successfully" };
  } catch (err) {
    return { error: true, message: err.message };
  }
};