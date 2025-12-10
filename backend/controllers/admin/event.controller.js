const Event = require("../../models/admin/event.model");
const User = require("../../models/user/user.model");
const { logAdminActivity } = require("../../middleware/adminAuth");

// Get all events (with filters)
exports.getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, event_type } = req.query;

    const query = {};
    if (status) query.status = status;
    if (event_type) query.event_type = event_type;

    const events = await Event.find(query)
      .populate("created_by", "name email role")
      .sort({ event_date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

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
      message: "An error occurred while fetching events",
    });
  }
};

// Get pending events
exports.getPendingEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const events = await Event.find({ status: "pending" })
      .populate("created_by", "name email role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Event.countDocuments({ status: "pending" });

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
    console.error("Error fetching pending events:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching pending events",
    });
  }
};

// Approve event
exports.approveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { notes } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending events can be approved",
      });
    }

    // Update event status
    event.status = "approved";
    event.reviewed_by = req.admin.email;
    event.reviewed_at = new Date();
    await event.save();

    // Log activity
    await logAdminActivity(
      req.admin.email,
      "approve_event",
      "event",
      eventId,
      {
        event_title: event.title,
        event_date: event.event_date,
        created_by: event.creator_name,
        notes: notes || "",
      },
      req.ip
    );

    // TODO: Send email notification to event creator

    res.status(200).json({
      success: true,
      message: "Event approved successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error approving event:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while approving event",
    });
  }
};

// Reject event
exports.rejectEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending events can be rejected",
      });
    }

    // Update event status
    event.status = "rejected";
    event.reviewed_by = req.admin.email;
    event.reviewed_at = new Date();
    event.rejection_reason = reason;
    await event.save();

    // Log activity
    await logAdminActivity(
      req.admin.email,
      "reject_event",
      "event",
      eventId,
      {
        event_title: event.title,
        event_date: event.event_date,
        created_by: event.creator_name,
        reason,
      },
      req.ip
    );

    // TODO: Send email notification to event creator

    res.status(200).json({
      success: true,
      message: "Event rejected successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error rejecting event:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while rejecting event",
    });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).populate(
      "created_by",
      "name email role"
    );

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
      message: "An error occurred while fetching event",
    });
  }
};

// Delete event (soft delete)
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Soft delete
    event.is_active = false;
    await event.save();

    // Log activity
    await logAdminActivity(
      req.admin.email,
      "delete_event",
      "event",
      eventId,
      {
        event_title: event.title,
      },
      req.ip
    );

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting event",
    });
  }
};
