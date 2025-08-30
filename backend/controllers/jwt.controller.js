const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'a47cf4099a5f214843bfb2ee5f7d89c4d66757883c02bd048824112c13d9f8bf';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30m';

// Generate JWT access token
const generateAccessToken = (payload) => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT access token
const verifyAccessToken = (token) => {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		throw new Error('Invalid or expired token');
	}
};

// Middleware to authenticate requests using JWT
const authenticateJWT = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		const token = authHeader.substring(7);
		try {
			const decoded = verifyAccessToken(token);
			req.user = decoded;
			next();
		} catch (error) {
			return res.status(403).json({ error: true, message: 'Invalid or expired access token' });
		}
	} else {
		return res.status(401).json({ error: true, message: 'Authorization header missing or malformed' });
	}
};

module.exports = {
	generateAccessToken,
	verifyAccessToken,
	authenticateJWT,
};