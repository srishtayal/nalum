/**
 * Admin Configuration
 * 
 * NOTE: Admin authentication now uses the standard User model with role="admin"
 * Use the seedAdmins.js script to create admin users in the database.
 * 
 * This file is kept for backward compatibility and utility functions.
 */

const bcrypt = require("bcrypt");

// Default admin emails (for reference)
const DEFAULT_ADMIN_EMAILS = [
  "superadmin@nalum.com",
  "admin1@nalum.com",
  "admin2@nalum.com",
  "moderator1@nalum.com",
  "moderator2@nalum.com",
];

// Function to hash password (utility for creating new admins)
const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, 10);
};

// Function to verify password
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  DEFAULT_ADMIN_EMAILS,
  hashPassword,
  verifyPassword,
};
