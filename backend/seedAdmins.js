/**
 * Admin User Seeder
 * 
 * This script creates admin users in the database.
 * Run with: node seedAdmins.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user/user.model");

// Admin users to create
const adminUsers = [
  {
    name: "Super Admin",
    email: "superadmin@nalum.com",
    password: "Admin@123",
    role: "admin",
    email_verified: true,
    profileCompleted: true,
  },
  {
    name: "Admin One",
    email: "admin1@nalum.com",
    password: "Admin@123",
    role: "admin",
    email_verified: true,
    profileCompleted: true,
  },
  {
    name: "Moderator One",
    email: "moderator1@nalum.com",
    password: "Admin@123",
    role: "admin",
    email_verified: true,
    profileCompleted: true,
  },
  {
    name: "Moderator Two",
    email: "moderator2@nalum.com",
    password: "Admin@123",
    role: "admin",
    email_verified: true,
    profileCompleted: true,
  },
];

async function seedAdmins() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://admin:admin@nalum.zpmllyv.mongodb.net/?retryWrites=true&w=majority&appName=Nalum"
    );
    console.log("✅ Connected to MongoDB");

    let createdCount = 0;
    let skippedCount = 0;

    for (const adminData of adminUsers) {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminData.email });

      if (existingAdmin) {
        console.log(`⚠️  Admin already exists: ${adminData.email}`);
        skippedCount++;
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 10);

      // Create admin user
      const admin = await User.create({
        ...adminData,
        password: hashedPassword,
      });

      console.log(`✅ Created admin: ${admin.name} (${admin.email})`);
      createdCount++;
    }

    console.log("\n" + "=".repeat(50));
    console.log(`📊 Summary:`);
    console.log(`   Created: ${createdCount} admin(s)`);
    console.log(`   Skipped: ${skippedCount} (already exist)`);
    console.log("=".repeat(50));

    if (createdCount > 0) {
      console.log("\n🔐 Admin Credentials:");
      console.log("   Email: superadmin@nalum.com");
      console.log("   Email: admin1@nalum.com");
      console.log("   Email: moderator1@nalum.com");
      console.log("   Email: moderator2@nalum.com");
      console.log("   Password (all): Admin@123");
      console.log("\n⚠️  Change these passwords in production!");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admins:", error);
    process.exit(1);
  }
}

// Run the seeder
seedAdmins();
