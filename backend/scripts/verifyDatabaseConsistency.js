require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user/user.model");
const Profile = require("../models/user/profile.model");

const expectedData = [
  {
    id: 1,
    name: "Rahul Kumar",
    roll_no: "CS2020001",
    batch: "2020",
    branch: "Computer Science Engineering",
  },
  {
    id: 2,
    name: "Rahul Kumar",
    roll_no: "CS2020089",
    batch: "2020",
    branch: "Computer Science Engineering",
  },
  {
    id: 3,
    name: "Priya Sharma",
    roll_no: "EC2021045",
    batch: "2021",
    branch: "Electrical Engineering",
  },
  {
    id: 4,
    name: "Priya Sharma",
    roll_no: "ME2021032",
    batch: "2021",
    branch: "Mechanical Engineering",
  },
  {
    id: 5,
    name: "Amit Patel",
    roll_no: "CS2019056",
    batch: "2019",
    branch: "Computer Science Engineering",
  },
  {
    id: 6,
    name: "Sneha Reddy",
    roll_no: "EE2020078",
    batch: "2020",
    branch: "Electrical Engineering",
  },
  {
    id: 7,
    name: "Vikram Singh",
    roll_no: "ME2018023",
    batch: "2018",
    branch: "Mechanical Engineering",
  },
  {
    id: 8,
    name: "Ananya Iyer",
    roll_no: "CS2021067",
    batch: "2021",
    branch: "Computer Science Engineering",
  },
  {
    id: 9,
    name: "Rohit Verma",
    roll_no: "EC2019044",
    batch: "2019",
    branch: "Electronics and Communication Engineering",
  },
  {
    id: 10,
    name: "Neha Gupta",
    roll_no: "CS2022015",
    batch: "2022",
    branch: "Computer Science Engineering",
  },
];

async function verifyDatabase() {
  try {
    const DB_URI = process.env.MONGODB_URI_DEV;
    await mongoose.connect(DB_URI);
    console.log("Connected to database\n");

    // Get all users (excluding Saumy Bhargava)
    const users = await User.find({
      name: { $ne: "Saumy Bhargava" },
    }).sort({ name: 1 });

    console.log(`Found ${users.length} users (excluding Saumy Bhargava)\n`);

    // Get all profiles
    const profiles = await Profile.find().populate("user");

    console.log("=== DATABASE VERIFICATION ===\n");

    let issues = [];
    let correctCount = 0;

    for (let expected of expectedData) {
      // Find matching user by name
      const matchingUsers = users.filter((u) => u.name === expected.name);

      if (matchingUsers.length === 0) {
        issues.push(
          `MISSING: ${expected.name} (${expected.roll_no}) - No user found in database`
        );
        continue;
      }

      // For each matching user, check if there's a profile
      let foundMatch = false;
      for (let user of matchingUsers) {
        const profile = profiles.find(
          (p) => p.user._id.toString() === user._id.toString()
        );

        if (profile) {
          // Check if profile data matches
          const batchMatch = profile.batch === expected.batch;
          const branchMatch = profile.branch === expected.branch;

          if (batchMatch && branchMatch) {
            foundMatch = true;
            correctCount++;
            console.log(
              `✓ ${expected.name} - Batch ${expected.batch}, ${expected.branch}`
            );
            break;
          } else {
            issues.push(
              `MISMATCH: ${expected.name} - Expected batch ${expected.batch}, branch ${expected.branch} but found batch ${profile.batch}, branch ${profile.branch}`
            );
          }
        }
      }

      if (!foundMatch && matchingUsers.length > 0) {
        issues.push(
          `INCOMPLETE: ${expected.name} (${expected.roll_no}) - User exists but profile data doesn't match expected values`
        );
      }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Correct entries: ${correctCount}/${expectedData.length}`);
    console.log(`Issues found: ${issues.length}\n`);

    if (issues.length > 0) {
      console.log("=== ISSUES ===");
      issues.forEach((issue) => console.log(`❌ ${issue}`));
    }

    // Show all users in database
    console.log("\n=== ALL USERS IN DATABASE ===");
    for (let user of users) {
      const profile = profiles.find(
        (p) => p.user._id.toString() === user._id.toString()
      );
      if (profile) {
        console.log(
          `- ${user.name} (${user.email}) - Batch ${profile.batch}, ${profile.branch}`
        );
      } else {
        console.log(`- ${user.name} (${user.email}) - NO PROFILE`);
      }
    }

    // Check for Saumy Bhargava entries
    const saumyUsers = await User.find({ name: "Saumy Bhargava" });
    console.log(`\n=== SAUMY BHARGAVA ENTRIES ===`);
    console.log(`Found ${saumyUsers.length} entries (should be 2)`);
    for (let user of saumyUsers) {
      const profile = await Profile.findOne({ user: user._id });
      if (profile) {
        console.log(
          `- ${user.email} - Batch ${profile.batch}, ${profile.branch}`
        );
      } else {
        console.log(`- ${user.email} - NO PROFILE`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from database");
  }
}

verifyDatabase();
