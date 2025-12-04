const express = require("express");
const router = express.Router();
const pool = require("../../config/postgres");

// POST /alumni/verify - Verify alumni from PostgreSQL database
router.post("/verify", async (req, res) => {
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
    console.error("Error verifying alumni:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

module.exports = router;
