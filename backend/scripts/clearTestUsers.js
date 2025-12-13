/**
 * Script to clear test users from the database
 * Run: node scripts/clearTestUsers.js
 * 
 * This removes all test users created by seedTestUsers.js
 * BE CAREFUL: This will delete users and their profiles!
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user/user.model');
const Profile = require('../models/user/profile.model');

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.NODE_ENV !== 'production'
      ? process.env.MONGODB_URI_DEV
      : process.env.MONGODB_URI_PROD;
    
    if (!mongoUri) {
      throw new Error('MongoDB URI not found. Check MONGODB_URI_DEV or MONGODB_URI_PROD in .env');
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Test user emails to delete
const testUserEmails = [
  'rajesh.kumar@gmail.com',
  'priya.sharma@yahoo.com',
  'amit.verma@outlook.com',
  'sneha.gupta@gmail.com',
  'arjun.singh@nsut.ac.in',
  'neha.patel@nsut.ac.in',
  'karan.mehta@nsut.ac.in',
  'vikram.rao@gmail.com',
  'ananya.reddy@gmail.com',
  'rohit.joshi@nsut.ac.in',
];

// Clear function
const clearTestUsers = async () => {
  try {
    console.log('🗑️  Starting to clear test users...\n');

    for (const email of testUserEmails) {
      const user = await User.findOne({ email });
      
      if (!user) {
        console.log(`⚠️  User ${email} not found, skipping...`);
        continue;
      }

      // Delete associated profile
      const deletedProfile = await Profile.findOneAndDelete({ user: user._id });
      if (deletedProfile) {
        console.log(`   🗑️  Deleted profile for ${email}`);
      }

      // Delete user
      await User.findByIdAndDelete(user._id);
      console.log(`✅ Deleted user: ${user.name} (${email})`);
    }

    console.log('\n✨ Cleanup completed successfully!\n');

  } catch (error) {
    console.error('❌ Error clearing users:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await clearTestUsers();
  await mongoose.connection.close();
  console.log('👋 Database connection closed');
  process.exit(0);
};

main();
