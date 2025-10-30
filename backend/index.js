require("dotenv").config();
console.log("Starting backend server...");
const express = require("express");

const app = express();
const authRoutes = require("./routes/auth/index.js");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/database.config.js");
const profileRoutes = require("./routes/profile/index.js");
const pdfParser = require("./routes/parser.js");
const alumniRoutes = require("./routes/alumni.js");
const adminRoutes = require("./routes/admin/index.js");
const { checkBanned } = require("./middleware/checkBanned.js");
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(cors({
  origin: ['https://nalum.vercel.app', 'http://localhost:8080'],
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

dbConnect();

// Apply checkBanned middleware to protected routes (not to auth or admin routes)
app.use("/auth", authRoutes);
app.use("/profile", checkBanned, profileRoutes);
app.use("/parser", checkBanned, pdfParser);
app.use("/alumni", checkBanned, alumniRoutes);

// Admin routes (no checkBanned needed)
app.use("/admin", adminRoutes);

// Serve static files for newsletter uploads
app.use("/uploads", express.static("uploads"));

// a sample api call to check if the backend is working
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is working!" });
});

// listening to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
