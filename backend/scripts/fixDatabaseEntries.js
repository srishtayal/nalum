require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user/user.model");
const Profile = require("../models/user/profile.model");

const correctData = [
  {
    name: "Rahul Kumar",
    email: "alumni1@gmail.com",
    batch: "2020",
    branch: "Computer Science Engineering",
    campus: "Main Campus",
  },
  {
    name: "Rahul Kumar",
    email: "alumni2@gmail.com",
    batch: "2020",
    branch: "Computer Science Engineering",
    campus: "Main Campus",
  },
  {
    name: "Priya Sharma",
    email: "alumni3@gmail.com",
    batch: "2021",
    branch: "Electrical Engineering",
    campus: "Main Campus",
  },
  {
    name: "Priya Sharma",
    email: "alumni4@gmail.com",
    batch: "2021",
    branch: "Mechanical Engineering",
    campus: "Main Campus",
  },
  {
    name: "Amit Patel",
    email: "alumni5@gmail.com",
    batch: "2019",
    branch: "Computer Science Engineering",
    campus: "Main Campus",
  },
  {
    name: "Sneha Reddy",
    email: "alumni6@gmail.com",
    batch: "2020",
    branch: "Electrical Engineering",
    campus: "Main Campus",
  },
  {
    name: "Vikram Singh",
    email: "alumni7@gmail.com",
    batch: "2018",
    branch: "Mechanical Engineering",
    campus: "Main Campus",
  },
  {
    name: "Ananya Iyer",
    email: "alumni8@gmail.com",
    batch: "2021",
    branch: "Computer Science Engineering",
    campus: "Main Campus",
  },
  {
    name: "Rohit Verma",
    email: "alumni9@gmail.com",
    batch: "2019",
    branch: "Electronics and Communication Engineering",
    campus: "Main Campus",
  },
  {
    name: "Neha Gupta",
    email: "alumni10@gmail.com",
    batch: "2022",
    branch: "Computer Science Engineering",
    campus: "Main Campus",
  },
];

async function fixDatabase() {
  try {
    const DB_URI = process.env.MONGODB_URI_DEV;
    await mongoose.connect(DB_URI);
    console.log("Connected to database\n");

    console.log("=== FIXING DATABASE ENTRIES ===\n");

    let successCount = 0;
    let failCount = 0;

    for (let entry of correctData) {
      try {
        // Find user by email
        const user = await User.findOne({ email: entry.email });

        if (!user) {
          console.log(`❌ User not found: ${entry.email}`);
          failCount++;
          continue;
        }

        // Update user name if needed
        if (user.name !== entry.name) {
          user.name = entry.name;
          await user.save();
          console.log(`✓ Updated user name for ${entry.email}: ${entry.name}`);
        }

        // Find or create profile
        let profile = await Profile.findOne({ user: user._id });

        if (!profile) {
          // Create new profile
          profile = new Profile({
            user: user._id,
            batch: entry.batch,
            branch: entry.branch,
            campus: entry.campus,
          });
          await profile.save();
          console.log(`✓ Created profile for ${entry.name} (${entry.email})`);
        } else {
          // Update existing profile
          let updated = false;

          if (profile.batch !== entry.batch) {
            profile.batch = entry.batch;
            updated = true;
          }

          if (profile.branch !== entry.branch) {
            profile.branch = entry.branch;
            updated = true;
          }

          if (profile.campus !== entry.campus) {
            profile.campus = entry.campus;
            updated = true;
          }

          if (updated) {
            await profile.save();
            console.log(
              `✓ Updated profile for ${entry.name} (${entry.email}): Batch ${entry.batch}, ${entry.branch}`
            );
          } else {
            console.log(
              `✓ Profile already correct for ${entry.name} (${entry.email})`
            );
          }
        }

        successCount++;
      } catch (error) {
        console.log(`❌ Error updating ${entry.email}: ${error.message}`);
        failCount++;
      }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Successfully fixed: ${successCount}/${correctData.length}`);
    console.log(`Failed: ${failCount}`);

    // Verify the changes
    console.log(`\n=== VERIFICATION ===`);
    for (let entry of correctData) {
      const user = await User.findOne({ email: entry.email });
      if (user) {
        const profile = await Profile.findOne({ user: user._id });
        if (profile) {
          const correct =
            profile.batch === entry.batch && profile.branch === entry.branch;
          console.log(
            `${correct ? "✓" : "❌"} ${entry.name} (${entry.email}) - Batch ${
              profile.batch
            }, ${profile.branch}`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from database");
  }
}

fixDatabase();
