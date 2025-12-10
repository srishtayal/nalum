const Session = require("../models/auth/session.model.js");
const { generateAccessToken } = require("./jwt.controller.js");

// Create session with JWT access token (always creates a new session)
exports.create = async (email, user_id) => {
	if (!email || !user_id) {
		return { error: true, message: "Credentials are required" };
	}
	try {
		const session = new Session({
			email: email.toLowerCase(),
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
		return {
			error: false,
			data: { ...raw, access_token: accessToken },
		};
	} catch (err) {
		return { error: true, message: err.message };
	}
};

// Get existing session by email or create a new one if none exists
exports.getOrCreate = async (email, user_id) => {
	if (!email || !user_id) {
		return { error: true, message: "Credentials are required" };
	}
	try {
		const lower = email.toLowerCase();
		const existing = await Session.findOne({ email: lower });
		if (existing) {
			const raw = existing.toObject();
			const accessToken = generateAccessToken({
				user_id: user_id,
				email: email,
				session_id: raw._id,
			});
			return { error: false, data: { ...raw, access_token: accessToken } };
		}

		// no existing session; create a fresh one
		const session = new Session({
			email: lower,
			user_id,
		});
		const data = await session.save();
		const raw = data.toObject();
		const accessToken = generateAccessToken({
			user_id: user_id,
			email: email,
			session_id: raw._id,
		});
		return { error: false, data: { ...raw, access_token: accessToken } };
	} catch (err) {
		return { error: true, message: err.message };
	}
};

// Validate Access Token (now JWT)
exports.validateAccessToken = async (access_token) => {
	if (!access_token) {
		return { error: true, message: "Some details are missing" };
	}
	try {
		const { verifyAccessToken } = require("./jwt.controller.js");
		const decoded = verifyAccessToken(access_token);
		// Check if session exists
		const data = await Session.findOne({ _id: decoded.session_id });
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
exports.updateAccessToken = async (refresh_token) => {
	if (!refresh_token) {
		return { error: true, message: "Some details are missing" };
	}
	try {
		const data = await Session.findOne({ refresh_token });
		if (!data) {
			return { error: true, exists: false };
		}
		if (data.refresh_token_expires_at < new Date()) {
			return { error: true, exists: true, expired: true };
		}
		// Create new session with new refresh token
		const newSession = await exports.create(data.email, data.user_id);
		// Delete old session
		await Session.deleteOne({ refresh_token });
		return newSession;
	} catch (err) {
		return { error: true, message: err.message };
	}
};

// Delete session
exports.delete = async (refresh_token) => {
  if (!refresh_token) {
    return { error: true, message: "Some details are missing" };
  }
  try {
    const result = await Session.deleteOne({ refresh_token });
    if (result.deletedCount === 0) {
      return { error: true, message: "Session not found" };
    }
    return { error: false, message: "Session deleted successfully" };
  } catch (err) {
    return { error: true, message: err.message };
  }
};
