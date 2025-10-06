console.log("Starting backend server...");
const express = require("express");

const app = express();
const authRoutes = require("./routes/auth/index.js");
const profileRoutes = require("./routes/profile.js");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/database.config.js");

app.use(cors({
  origin: 'http://nalum-p4wh.onrender.com',
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

dbConnect();

app.use("/auth", authRoutes);
const cvRoutes = require("./routes/cv.js");
app.use("/profile", profileRoutes);
app.use("/cv", cvRoutes);
// a sample api call to check if the backend is working
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is working!" });
});

// listening to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});