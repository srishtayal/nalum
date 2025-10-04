console.log("Starting backend server...");
const express = require("express");

const app = express();
const authRoutes = require("./routes/auth/index.js");
const profileRoutes = require("./routes/profile.js");
const cors = require("cors");
const helmet = require("helmet");

const dbConnect = require("./config/database.config.js");

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);


// listening to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});