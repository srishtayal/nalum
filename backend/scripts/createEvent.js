/**
 * Script to create events
 * Run: node scripts/createEvent.js
 *
 * This script allows you to:
 * - Create single events
 * - Seed multiple test events
 * - Create events with different statuses (pending, approved)
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("../models/admin/event.model");
const User = require("../models/user/user.model");

// Database connection
const connectDB = async () => {
  try {
    const mongoUri =
      process.env.NODE_ENV !== "production"
        ? process.env.MONGODB_URI_DEV
        : process.env.MONGODB_URI_PROD;

    if (!mongoUri) {
      throw new Error(
        "MongoDB URI not found. Check MONGODB_URI_DEV or MONGODB_URI_PROD in .env"
      );
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Sample events data
const sampleEvents = [
  {
    title: "Tech Innovation Workshop 2025",
    description:
      "Join us for an exciting workshop on the latest innovations in technology. Learn about AI, machine learning, and cloud computing from industry experts.",
    event_date: new Date("2025-01-15"),
    event_time: "10:00 AM",
    location: "Main Campus Auditorium, Building A",
    event_type: "workshop",
    status: "approved",
    max_participants: 100,
    registration_link: "https://example.com/register/tech-workshop",
    contact_info: {
      phone: "+1-234-567-8900",
      email: "tech.events@example.com",
      website: "https://example.com/events",
    },
  },
  {
    title: "Alumni Networking Meetup",
    description:
      "Connect with fellow alumni, share experiences, and build professional relationships. Light refreshments will be provided.",
    event_date: new Date("2025-01-20"),
    event_time: "6:00 PM",
    location: "City Convention Center, Hall 3",
    event_type: "meetup",
    status: "approved",
    max_participants: 50,
    registration_link: "https://example.com/register/alumni-meetup",
    contact_info: {
      phone: "+1-234-567-8901",
      email: "alumni@example.com",
    },
  },
  {
    title: "Data Science Seminar",
    description:
      "Explore the world of data science with hands-on sessions on data analysis, visualization, and predictive modeling.",
    event_date: new Date("2025-02-05"),
    event_time: "2:00 PM",
    location: "Online - Zoom Webinar",
    event_type: "seminar",
    status: "pending",
    max_participants: 200,
    registration_link: "https://example.com/register/data-science",
    contact_info: {
      email: "datasci@example.com",
      website: "https://datasci.example.com",
    },
  },
  {
    title: "International Tech Conference 2025",
    description:
      "A three-day conference featuring keynote speakers from around the world, covering topics in software engineering, cybersecurity, and digital transformation.",
    event_date: new Date("2025-03-10"),
    event_time: "9:00 AM",
    location: "International Conference Center",
    event_type: "conference",
    status: "approved",
    max_participants: 500,
    registration_link: "https://example.com/register/tech-conf",
    contact_info: {
      phone: "+1-234-567-8902",
      email: "conference@example.com",
      website: "https://techconf2025.com",
    },
  },
  {
    title: "Career Development Webinar",
    description:
      "Learn strategies for career advancement, resume building, and interview preparation from HR professionals and career coaches.",
    event_date: new Date("2025-02-15"),
    event_time: "5:00 PM",
    location: "Online - Microsoft Teams",
    event_type: "webinar",
    status: "approved",
    max_participants: 150,
    registration_link: "https://example.com/register/career-webinar",
    contact_info: {
      email: "careers@example.com",
    },
  },
];

// Create a single event
const createEvent = async (eventData, creatorEmail) => {
  try {
    // Find the creator user
    const creator = await User.findOne({ email: creatorEmail });

    if (!creator) {
      throw new Error(
        `User with email ${creatorEmail} not found. Please provide a valid user email.`
      );
    }

    // Prepare event object
    const event = new Event({
      ...eventData,
      created_by: creator._id,
      creator_name: creator.name,
      creator_email: creator.email,
    });

    await event.save();
    console.log(`✅ Event created: "${event.title}" (ID: ${event._id})`);
    return event;
  } catch (error) {
    console.error(`❌ Error creating event: ${error.message}`);
    throw error;
  }
};

// Seed multiple events
const seedEvents = async (creatorEmail) => {
  try {
    console.log("\n🌱 Starting to seed events...\n");

    // Find the creator user
    const creator = await User.findOne({ email: creatorEmail });

    if (!creator) {
      throw new Error(
        `User with email ${creatorEmail} not found. Please create a user first or use an existing user email.`
      );
    }

    console.log(`📧 Using creator: ${creator.name} (${creator.email})\n`);

    // Clear existing test events (optional - comment out if you want to keep existing events)
    // await Event.deleteMany({ creator_email: creator.email });
    // console.log('🗑️  Cleared existing events for this creator\n');

    const createdEvents = [];

    for (const eventData of sampleEvents) {
      try {
        const event = await createEvent(eventData, creatorEmail);
        createdEvents.push(event);
      } catch (error) {
        console.error(`Failed to create event: ${eventData.title}`);
      }
    }

    console.log(`\n✅ Successfully created ${createdEvents.length} events`);
    console.log("\n📊 Summary:");
    console.log(
      `   - Approved: ${
        createdEvents.filter((e) => e.status === "approved").length
      }`
    );
    console.log(
      `   - Pending: ${
        createdEvents.filter((e) => e.status === "pending").length
      }`
    );

    return createdEvents;
  } catch (error) {
    console.error(`❌ Error seeding events: ${error.message}`);
    throw error;
  }
};

// Create a custom event
const createCustomEvent = async () => {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) =>
    new Promise((resolve) => rl.question(query, resolve));

  try {
    console.log("\n📝 Create a Custom Event\n");

    const title = await question("Event Title: ");
    const description = await question("Description: ");
    const eventDateStr = await question("Event Date (YYYY-MM-DD): ");
    const eventTime = await question("Event Time (e.g., 10:00 AM): ");
    const location = await question("Location: ");
    const eventType =
      (await question(
        "Event Type (workshop/seminar/conference/meetup/webinar/other): "
      )) || "other";
    const maxParticipants = await question(
      "Max Participants (optional, press Enter to skip): "
    );
    const registrationLink = await question("Registration Link (optional): ");
    const contactEmail = await question("Contact Email (optional): ");
    const contactPhone = await question("Contact Phone (optional): ");
    const creatorEmail =
      (await question("Creator Email (press Enter for demo@gmail.com): ")) ||
      "demo@gmail.com";

    const eventData = {
      title,
      description,
      event_date: new Date(eventDateStr),
      event_time: eventTime,
      location,
      event_type: eventType,
      status: "pending",
      max_participants: maxParticipants ? parseInt(maxParticipants) : null,
      registration_link: registrationLink || "",
      contact_info: {
        email: contactEmail || "",
        phone: contactPhone || "",
      },
    };

    const event = await createEvent(eventData, creatorEmail);
    console.log("\n✅ Custom event created successfully!");
    console.log(JSON.stringify(event, null, 2));

    rl.close();
  } catch (error) {
    console.error(`❌ Error creating custom event: ${error.message}`);
    rl.close();
    throw error;
  }
};

// Main function
const main = async () => {
  await connectDB();

  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case "seed":
        // Seed sample events
        // Usage: node scripts/createEvent.js seed <creator-email>
        const creatorEmail = args[1] || "demo@gmail.com";
        console.log(`📧 Using creator email: ${creatorEmail}\n`);
        await seedEvents(creatorEmail);
        break;

      case "custom":
        // Create a custom event interactively
        // Usage: node scripts/createEvent.js custom
        await createCustomEvent();
        break;

      case "help":
      default:
        console.log(`
📚 Event Creation Script - Usage Guide

Commands:
  node scripts/createEvent.js seed [creator-email]
    - Seeds multiple sample events
    - Default creator email: demo@gmail.com
    - Example: node scripts/createEvent.js seed
    - Example with custom email: node scripts/createEvent.js seed user@example.com

  node scripts/createEvent.js custom
    - Create a custom event interactively
    - You'll be prompted for event details
    - Default creator email: demo@gmail.com

  node scripts/createEvent.js help
    - Show this help message

Note: Make sure the creator email exists in the database before running the script.
        `);
        break;
    }
  } catch (error) {
    console.error("❌ Script failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Database connection closed");
    process.exit(0);
  }
};

// Run the script
main();
