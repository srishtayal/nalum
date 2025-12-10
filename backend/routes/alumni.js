const express = require("express");
const router = express.Router();
const alumniController = require("../controllers/alumni.controller");
const { protect, isAdmin } = require("../middleware/auth");
const pool = require("../config/postgres");

// PostgreSQL Alumni Verification (for manual check)
router.post("/verify-pg", async (req, res) => {
  try {
    const { name, roll_no, batch, branch } = req.body;

    let result;

    // If roll_no is provided, query by roll_no (unique identifier)
    if (roll_no && roll_no.trim() !== "") {
      result = await pool.query("SELECT * FROM alumni WHERE roll_no = $1", [
        roll_no,
      ]);
    } else {
      // Otherwise, query by combination of name, batch, and branch
      result = await pool.query(
        "SELECT * FROM alumni WHERE name = $1 AND batch = $2 AND branch = $3",
        [name, batch, branch]
      );
    }

    return res.status(200).json({
      success: true,
      matches: result.rows,
    });
  } catch (err) {
    console.error("Error verifying alumni from PostgreSQL:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Alumni verification routes (Note: already mounted at /alumni in index.js)
router.post("/verify-code", protect, alumniController.verifyCode);
router.get("/status", protect, alumniController.getVerificationStatus);

// Check manual verification details (calls microservice)
router.post("/check-manual", protect, alumniController.checkManualVerification);

// Confirm manual verification match
router.post("/confirm-match", protect, alumniController.confirmManualMatch);

// Admin-only routes for managing verification queue
// Note: Code generation has moved to /admin/codes/generate
router.get("/admin/queue", protect, isAdmin, alumniController.getQueue);
router.post("/admin/queue/:userId/approve", protect, isAdmin, alumniController.approveFromQueue);
router.post("/admin/queue/:userId/deny", protect, isAdmin, alumniController.denyFromQueue);

module.exports = router;
