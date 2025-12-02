/* Seed script to add a single VerificationCode document

Run from /backend with:
  node scripts/seedVerificationCode.js

This script uses the existing db connector in /config/database.config.js
*/

require('dotenv').config();
const connectDB = require('../config/database.config');
const VerificationCode = require('../models/verificationCode.model');

async function seed() {
  try {
    await connectDB();

    // 10-word code string (space separated words)
    const code = '1231231231';

    // Check for existing code
    const existing = await VerificationCode.findOne({ code });
    if (existing) {
      console.log('Verification code already exists:', existing.code);
      process.exit(0);
    }

    const doc = await VerificationCode.create({ code });
    console.log('Inserted verification code:', doc.code);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding verification code:', err);
    process.exit(1);
  }
}

seed();
