const express = require("express");
const router = express.Router();
const eventController = require("../../controllers/admin/event.controller");
const { protectAdmin } = require("../../middleware/adminAuth");

// All routes are protected (admin only)
router.get("/all", protectAdmin, eventController.getAllEvents);
router.get("/pending", protectAdmin, eventController.getPendingEvents);
router.get("/:eventId", protectAdmin, eventController.getEventById);
router.post("/approve/:eventId", protectAdmin, eventController.approveEvent);
router.post("/reject/:eventId", protectAdmin, eventController.rejectEvent);
router.delete("/:eventId", protectAdmin, eventController.deleteEvent);

module.exports = router;
