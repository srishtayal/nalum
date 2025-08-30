module.exports = {
	JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30m',
};
