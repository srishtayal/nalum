require('dotenv').config();
const mongoose = require("mongoose");

const DB_URI =
  process.env.NODE_ENV !== 'production'
    ? process.env.MONGODB_URI_DEV
    : process.env.MONGODB_URI_PROD;

async function connectDB() {
  try {
    await mongoose.connect(DB_URI);

    console.log(
      `Connected to ${process.env.NODE_ENV !== 'production' ? 'Development' : 'Production'} Database`
    );
  } catch (err) {
    console.error(`Error connecting to ${process.env.NODE_ENV !== 'production' ? 'Development' : 'Production'} Database:`, err);
    process.exit(1); // Exit process if DB fails to connect
  }
}

module.exports = connectDB;
