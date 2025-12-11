const express = require("express");
const router = express.Router();
const connectionController = require("../../controllers/chat/connection.controller");
const { protect } = require("../../middleware/auth");

// All routes require authentication
router.use(protect);

// Connection management
router.post("/request", connectionController.sendConnectionRequest);
router.post("/respond", connectionController.respondToConnection);
router.get("/", connectionController.getConnections);
router.get("/pending", connectionController.getPendingRequests);
router.get("/sent", connectionController.getSentRequests);
router.delete(
  "/cancel/:recipientId",
  connectionController.cancelConnectionRequest
);
router.delete("/:connectionId", connectionController.removeConnection);
router.post("/:connectionId/block", connectionController.blockUser);

module.exports = router;
