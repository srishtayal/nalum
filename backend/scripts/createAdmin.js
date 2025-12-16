/**
 * Script to create an admin user in the database
 * Run: node scripts/createAdmin.js
 * 
 * This will create an admin user that can login through the regular /login page
 * and will be automatically redirected to the admin panel.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user/user.model');

// Database connection
const connectDB = async () => {
  try {
    // Use the same logic as database.config.js
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

// Create admin user
const createAdmin = async () => {
  try {
    // Get arguments from command line
    const args = process.argv.slice(2);
    const emailArg = args[0];
    const passwordArg = args[1];
    const nameArg = args[2];

    // Admin user details - Use args or defaults
    const adminData = {
      name: nameArg || 'Admin User',
      email: emailArg || 'admin@n.ac.in', // Using generic domain for admin or allowing any
      password: passwordArg || 'Admin@123',
      role: 'admin',
      email_verified: true, // Admin accounts are pre-verified
      profileCompleted: true, // Skip profile form for admins
      verified_alumni: true, // Admins don't need alumni verification, but set true to be safe
      banned: false,
    };

    console.log('\n🔍 Checking if admin already exists...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Role: ${existingAdmin.role}`);

      // Ask if they want to update the password
      console.log('\n💡 To update password, delete the existing user first or change the email in this script.');
      return;
    }

    console.log('✨ Creating new admin user...');

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create admin user
    const admin = new User({
      ...adminData,
      password: hashedPassword,
    });

    await admin.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Name:', adminData.name);
    console.log('🎭 Role:', adminData.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 IMPORTANT:');
    console.log('1. Login at: /login (NOT /admin-panel/login)');
    console.log('2. You will be automatically redirected to /admin-panel/dashboard');
    console.log('3. Change your password after first login!');
    console.log('4. Keep these credentials secure!');
    console.log('\n🔐 Security Note:');
    console.log('   Remember to change the password in this script or delete it');
    console.log('   after creating the admin to avoid security risks.');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    if (error.code === 11000) {
      console.error('   Duplicate key error - this email already exists');
    }
    process.exit(1);
  }
};

// Main execution
const main = async () => {
  console.log('🚀 Admin User Creation Script');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await connectDB();
  await createAdmin();

  console.log('\n✨ Script completed!');
  process.exit(0);
};

// Run the script
main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
