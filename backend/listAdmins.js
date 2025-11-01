/**
 * List all admin users in the database
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user/user.model");

async function listAdmins() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://admin:admin@nalum.zpmllyv.mongodb.net/?retryWrites=true&w=majority&appName=Nalum"
    );
    console.log("✅ Connected to MongoDB\n");

    // Find all admin users
    const admins = await User.find({ role: "admin" })
      .select("name email role email_verified createdAt")
      .sort({ createdAt: 1 });

    console.log(`Found ${admins.length} admin user(s):\n`);
    console.log("=".repeat(80));

    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Verified: ${admin.email_verified ? "✅" : "❌"}`);
      console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`);
      console.log("-".repeat(80));
    });

    console.log("\n🔐 All admins use password: Admin@123");
    console.log("⚠️  Change these passwords in production!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

listAdmins();
