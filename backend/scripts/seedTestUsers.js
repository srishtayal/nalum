/**
 * Script to seed test users with various profile completion levels
 * Run: node scripts/seedTestUsers.js
 * 
 * This creates users with different edge cases:
 * - Users with minimal details
 * - Users with partial details
 * - Users with complete profiles
 * - Alumni vs Students
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

// Test users data
const testUsers = [
  // ALUMNI - Complete Profile
  {
    user: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gmail.com',
      password: 'Test@123',
      role: 'alumni',
      email_verified: true,
      profileCompleted: true,
      verified_alumni: true,
    },
    profile: {
      batch: '2020',
      branch: 'Computer Science Engineering',
      campus: 'Main Campus',
      current_company: 'Google',
      current_role: 'Senior Software Engineer',
      social_media: {
        linkedin: 'https://linkedin.com/in/rajeshkumar',
        github: 'https://github.com/rajeshkumar',
        twitter: 'https://twitter.com/rajeshkumar',
        personal_website: 'https://rajeshkumar.dev',
      },
      skills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker'],
      experience: [
        {
          company: 'Google',
          role: 'Senior Software Engineer',
          duration: '2022 - Present',
        },
        {
          company: 'Microsoft',
          role: 'Software Engineer',
          duration: '2020 - 2022',
        },
      ],
    },
  },

  // ALUMNI - Partial Profile (No social media, limited skills)
  {
    user: {
      name: 'Priya Sharma',
      email: 'priya.sharma@yahoo.com',
      password: 'Test@123',
      role: 'alumni',
      email_verified: true,
      profileCompleted: true,
      verified_alumni: true,
    },
    profile: {
      batch: '2019',
      branch: 'Electronics and Communication Engineering',
      campus: 'Main Campus',
      current_company: 'Amazon',
      current_role: 'Product Manager',
      social_media: {
        linkedin: 'https://linkedin.com/in/priyasharma',
      },
      skills: ['Product Management', 'Agile'],
      experience: [
        {
          company: 'Amazon',
          role: 'Product Manager',
          duration: '2021 - Present',
        },
      ],
    },
  },

  // ALUMNI - Minimal Profile (Only required fields)
  {
    user: {
      name: 'Amit Verma',
      email: 'amit.verma@outlook.com',
      password: 'Test@123',
      role: 'alumni',
      email_verified: true,
      profileCompleted: true,
      verified_alumni: true,
    },
    profile: {
      batch: '2018',
      branch: 'Mechanical Engineering',
      campus: 'West Campus',
      current_company: 'TCS',
      current_role: 'Consultant',
      social_media: {},
      skills: [],
      experience: [],
    },
  },

  // ALUMNI - No current position
  {
    user: {
      name: 'Sneha Gupta',
      email: 'sneha.gupta@gmail.com',
      password: 'Test@123',
      role: 'alumni',
      email_verified: true,
      profileCompleted: true,
      verified_alumni: true,
    },
    profile: {
      batch: '2021',
      branch: 'Information Technology',
      campus: 'East Campus',
      social_media: {
        linkedin: 'https://linkedin.com/in/snehagupta',
        github: 'https://github.com/snehagupta',
      },
      skills: ['Java', 'Spring Boot', 'MySQL'],
      experience: [
        {
          company: 'Infosys',
          role: 'Software Developer',
          duration: '2021 - 2023',
        },
      ],
    },
  },

  // STUDENT - Complete Profile
  {
    user: {
      name: 'Arjun Singh',
      email: 'arjun.singh@nsut.ac.in',
      password: 'Test@123',
      role: 'student',
      email_verified: true,
      profileCompleted: true,
    },
    profile: {
      batch: '2026',
      branch: 'Computer Science Engineering',
      campus: 'Main Campus',
      social_media: {
        linkedin: 'https://linkedin.com/in/arjunsingh',
        github: 'https://github.com/arjunsingh',
        personal_website: 'https://arjunsingh.tech',
      },
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science', 'C++'],
      experience: [
        {
          company: 'Tech Startup',
          role: 'ML Intern',
          duration: 'Summer 2024',
        },
      ],
    },
  },

  // STUDENT - Minimal Profile
  {
    user: {
      name: 'Neha Patel',
      email: 'neha.patel@nsut.ac.in',
      password: 'Test@123',
      role: 'student',
      email_verified: true,
      profileCompleted: true,
    },
    profile: {
      batch: '2027',
      branch: 'Electrical Engineering',
      campus: 'East Campus',
      social_media: {},
      skills: [],
      experience: [],
    },
  },

  // STUDENT - Partial Profile (Some social media, some skills)
  {
    user: {
      name: 'Karan Mehta',
      email: 'karan.mehta@nsut.ac.in',
      password: 'Test@123',
      role: 'student',
      email_verified: true,
      profileCompleted: true,
    },
    profile: {
      batch: '2025',
      branch: 'Computer Science Engineering',
      campus: 'West Campus',
      social_media: {
        github: 'https://github.com/karanmehta',
      },
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: [],
    },
  },

  // ALUMNI - Different Campus
  {
    user: {
      name: 'Vikram Rao',
      email: 'vikram.rao@gmail.com',
      password: 'Test@123',
      role: 'alumni',
      email_verified: true,
      profileCompleted: true,
      verified_alumni: true,
    },
    profile: {
      batch: '2017',
      branch: 'Instrumentation and Control Engineering',
      campus: 'Main Campus',
      current_company: 'Wipro',
      current_role: 'Project Lead',
      social_media: {
        linkedin: 'https://linkedin.com/in/vikramrao',
      },
      skills: ['IoT', 'Embedded Systems', 'C', 'Python'],
      experience: [
        {
          company: 'Wipro',
          role: 'Project Lead',
          duration: '2019 - Present',
        },
        {
          company: 'Siemens',
          role: 'Engineer',
          duration: '2017 - 2019',
        },
      ],
    },
  },

  // ALUMNI - Startup Founder
  {
    user: {
      name: 'Ananya Reddy',
      email: 'ananya.reddy@gmail.com',
      password: 'Test@123',
      role: 'alumni',
      email_verified: true,
      profileCompleted: true,
      verified_alumni: true,
    },
    profile: {
      batch: '2016',
      branch: 'Computer Science Engineering',
      campus: 'Main Campus',
      current_company: 'TechVenture (Own Startup)',
      current_role: 'Co-Founder & CEO',
      social_media: {
        linkedin: 'https://linkedin.com/in/ananyareddy',
        twitter: 'https://twitter.com/ananyareddy',
        personal_website: 'https://techventure.io',
      },
      skills: ['Entrepreneurship', 'Full Stack Development', 'Product Strategy', 'React', 'Node.js', 'MongoDB'],
      experience: [
        {
          company: 'TechVenture',
          role: 'Co-Founder & CEO',
          duration: '2020 - Present',
        },
        {
          company: 'Flipkart',
          role: 'Senior Developer',
          duration: '2016 - 2020',
        },
      ],
    },
  },

  // STUDENT - No profile completed (edge case)
  {
    user: {
      name: 'Rohit Joshi',
      email: 'rohit.joshi@nsut.ac.in',
      password: 'Test@123',
      role: 'student',
      email_verified: true,
      profileCompleted: false,
    },
    profile: null, // No profile created yet
  },
];

// Seed function
const seedUsers = async () => {
  try {
    console.log('🌱 Starting to seed test users...\n');

    for (const testUser of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: testUser.user.email });
      if (existingUser) {
        console.log(`⚠️  User ${testUser.user.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(testUser.user.password, 10);

      // Create user
      const user = await User.create({
        ...testUser.user,
        password: hashedPassword,
      });

      console.log(`✅ Created user: ${user.name} (${user.email}) - ${user.role}`);

      // Create profile if provided
      if (testUser.profile) {
        const profile = await Profile.create({
          user: user._id,
          ...testUser.profile,
        });
        console.log(`   📝 Created profile with ${profile.skills?.length || 0} skills, ${profile.experience?.length || 0} experiences`);
      } else {
        console.log(`   ⏭️  No profile created (testing incomplete signup)`);
      }

      console.log('');
    }

    console.log('✨ Seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Total users attempted: ${testUsers.length}`);
    console.log(`   Alumni: ${testUsers.filter(u => u.user.role === 'alumni').length}`);
    console.log(`   Students: ${testUsers.filter(u => u.user.role === 'student').length}`);
    console.log('\n💡 All test users have password: Test@123\n');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await seedUsers();
  await mongoose.connection.close();
  console.log('👋 Database connection closed');
  process.exit(0);
};

main();
