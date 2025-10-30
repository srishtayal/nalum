const express = require("express");
const router = express.Router();

// Import all admin route modules
const authRoutes = require("./auth");
const verificationRoutes = require("./verification");
const userRoutes = require("./users");
const eventRoutes = require("./events");
const newsletterRoutes = require("./newsletters");
const statisticsRoutes = require("./statistics");

// Mount routes
router.use("/auth", authRoutes);
router.use("/verification", verificationRoutes);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/newsletters", newsletterRoutes);
router.use("/statistics", statisticsRoutes);

// Health check for admin routes
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin API is working",
  });
});

module.exports = router;
