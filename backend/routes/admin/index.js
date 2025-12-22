const express = require("express");
const router = express.Router();

// Import all admin route modules
// Note: Admin auth is now handled through /auth/sign-in (unified login)
// Admin users are just regular users with role: 'admin'
const verificationRoutes = require("./verification");
const verificationController = require("../../controllers/admin/verification.controller");
const { protectAdmin } = require("../../middleware/adminAuth");
const userRoutes = require("./users");
const eventRoutes = require("./events");
const postsRoutes = require("./posts");
const newsletterRoutes = require("./newsletters");
const statisticsRoutes = require("./statistics");
const codeRoutes = require("./codes");
const alumniDatabaseRoutes = require("./alumniDatabase");

// Mount routes
router.use("/verification", verificationRoutes);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/posts", postsRoutes);
router.use("/newsletters", newsletterRoutes);
router.use("/statistics", statisticsRoutes);
router.use("/codes", codeRoutes);
router.use("/alumni-database", alumniDatabaseRoutes);

// Direct route for frontend expectation: /admin/search-alumni-database
router.post("/search-alumni-database", protectAdmin, verificationController.searchAlumniDatabase);
router.get("/all-alumni", protectAdmin, verificationController.getAllAlumni);

// Health check for admin routes
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin API is working",
  });
});

module.exports = router;
