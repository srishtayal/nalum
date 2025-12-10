const express = require("express");
const router = express.Router();

// Import all admin route modules
// Note: Admin auth is now handled through /auth/sign-in (unified login)
// Admin users are just regular users with role: 'admin'
const verificationRoutes = require("./verification");
const userRoutes = require("./users");
const eventRoutes = require("./events");
const newsletterRoutes = require("./newsletters");
const statisticsRoutes = require("./statistics");
const codeRoutes = require("./codes");

// Mount routes
router.use("/verification", verificationRoutes);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/newsletters", newsletterRoutes);
router.use("/statistics", statisticsRoutes);
router.use("/codes", codeRoutes);

// Health check for admin routes
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin API is working",
  });
});

module.exports = router;
