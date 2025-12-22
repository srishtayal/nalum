const express = require("express");
const router = express.Router();
const alumniDatabaseController = require("../../controllers/admin/alumniDatabase.controller");
const { protectAdmin } = require("../../middleware/adminAuth");

// All routes are protected (admin only)
router.get("/batches", protectAdmin, alumniDatabaseController.getAlumniBatches);
router.get("/batch/:batch", protectAdmin, alumniDatabaseController.getAlumniByBatch);
router.post("/search", protectAdmin, alumniDatabaseController.searchAlumniDatabase);

module.exports = router;
