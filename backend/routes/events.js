const express = require("express");
const router = express.Router();
const Event = require("../models/admin/event.model");
const Settings = require("../models/admin/settings.model");
const { protect } = require("../middleware/auth");

// Check if event hosting is allowed
router.get("/hosting-allowed", async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: "allow_event_hosting" });
    
    res.status(200).json({
      success: true,
      data: {
        allowed: setting ? setting.value : true // Default to true
      }
    });
  } catch (error) {
    console.error("Error checking hosting status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check hosting status"
    });
  }
});

// Create a new event (Alumni only)
router.post("/create", protect, async (req, res) => {
  try {
    // Check if hosting is allowed
    const hostingSetting = await Settings.findOne({ key: "allow_event_hosting" });
    if (hostingSetting && !hostingSetting.value) {
      return res.status(403).json({
        success: false,
        message: "Event hosting is currently disabled by administrators",
      });
    }

    const userId = req.user.user_id;
    const user = await require("../models/user/user.model").findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only alumni can create events
    if (user.role !== "alumni") {
      return res.status(403).json({
        success: false,
        message: "Only alumni can host events",
      });
    }

    const {
      title,
      description,
      event_date,
      event_time,
      location,
      event_type,
      image_url,
      registration_link,
      max_participants,
      contact_info,
    } = req.body;

    const event = new Event({
      title,
      description,
      event_date,
      event_time,
      location,
      event_type,
      image_url,
      registration_link,
      max_participants,
      contact_info,
      created_by: userId,
      creator_name: user.name,
      creator_email: user.email,
      status: "pending", // Awaiting admin approval
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: "Event submitted for approval",
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
    });
  }
});

// Get all approved events with pagination
router.get("/approved", async (req, res) => {
  try {
    const { page = 1, limit = 9, event_type } = req.query;

    const query = {
      status: "approved",
      is_active: true,
      event_date: { $gte: new Date() }, // Only future events
    };

    if (event_type && event_type !== "all") {
      query.event_type = event_type;
    }

    const events = await Event.find(query)
      .sort({ event_date: 1 }) // Upcoming events first
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("-liked_by"); // Don't send full liked_by array

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
});

// Get most liked events for carousel
router.get("/most-liked", async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const events = await Event.find({
      status: "approved",
      is_active: true,
      event_date: { $gte: new Date() },
    })
      .sort({ likes: -1, event_date: 1 })
      .limit(parseInt(limit))
      .select("-liked_by");

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching most liked events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch most liked events",
    });
  }
});

// Get single event details
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
    });
  }
});

// Like/Unlike event
router.post("/:eventId/like", protect, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.user_id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const alreadyLiked = event.liked_by.includes(userId);

    if (alreadyLiked) {
      // Unlike
      event.liked_by = event.liked_by.filter(id => id.toString() !== userId.toString());
      event.likes = Math.max(0, event.likes - 1);
    } else {
      // Like
      event.liked_by.push(userId);
      event.likes += 1;
    }

    await event.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likes: event.likes,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle like",
    });
  }
});

// Get user's own events
router.get("/my/events", protect, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const events = await Event.find({ created_by: userId })
      .sort({ createdAt: -1 })
      .select("-liked_by");

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your events",
    });
  }
});

// Update event (Owner only)
router.put("/update/:eventId", protect, async (req, res) => {
  try {
    // Check if hosting is allowed
    const hostingSetting = await Settings.findOne({ key: "allow_event_hosting" });
    if (hostingSetting && !hostingSetting.value) {
      return res.status(403).json({
        success: false,
        message: "Event hosting is currently disabled by administrators",
      });
    }

    const { eventId } = req.params;
    const userId = req.user.user_id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only event creator can update
    if (event.created_by.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own events",
      });
    }

    const {
      title,
      description,
      event_date,
      event_time,
      location,
      event_type,
      image_url,
      registration_link,
      max_participants,
      contact_info,
    } = req.body;

    // Update fields
    event.title = title;
    event.description = description;
    event.event_date = event_date;
    event.event_time = event_time;
    event.location = location;
    event.event_type = event_type;
    event.image_url = image_url;
    event.registration_link = registration_link;
    event.max_participants = max_participants;
    event.contact_info = contact_info;

    // If event was approved, set back to pending for re-approval
    if (event.status === "approved") {
      event.status = "pending";
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: event.status === "pending" ? "Event updated and submitted for re-approval" : "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
    });
  }
});

module.exports = router;
