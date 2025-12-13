const User = require("../../models/user/user.model");
const Connection = require("../../models/chat/connections.model");
const Conversation = require("../../models/chat/conversations.model");
const Message = require("../../models/chat/messages.model");

// Search users to connect with
exports.searchUsers = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const skip = (page - 1) * limit;

    // Search by name or email
    const searchRegex = new RegExp(q.trim(), "i");
    const users = await User.find({
      _id: { $ne: userId },
      role: { $ne: "admin" },
      $or: [{ name: searchRegex }, { email: searchRegex }],
    })
      .select("name email profilePicture")
      .skip(skip)
      .limit(parseInt(limit));

    // Get connection status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const connection = await Connection.findOne({
          $or: [
            { requester: userId, recipient: user._id },
            { requester: user._id, recipient: userId },
          ],
        });

        return {
          ...user.toObject(),
          connectionStatus: connection ? connection.status : "none",
          connectionId: connection ? connection._id : null,
        };
      })
    );

    const total = await User.countDocuments({
      _id: { $ne: userId },
      role: { $ne: "admin" },
      $or: [{ name: searchRegex }, { email: searchRegex }],
    });

    res.json({
      success: true,
      data: usersWithStatus,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
};

// Search in conversations
exports.searchConversations = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(q.trim(), "i");

    // Get user's conversations
    const conversations = await Conversation.find({
      participants: userId,
    }).select("_id");

    const conversationIds = conversations.map((c) => c._id);

    // Search messages in these conversations
    const messages = await Message.find({
      conversation: { $in: conversationIds },
      content: searchRegex,
      deleted: false,
    })
      .populate("sender", "name email profilePicture")
      .populate("conversation")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Populate conversation participants
    for (let message of messages) {
      await message.conversation.populate(
        "participants",
        "name email profilePicture"
      );
    }

    const total = await Message.countDocuments({
      conversation: { $in: conversationIds },
      content: searchRegex,
      deleted: false,
    });

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search conversations error:", error);
    res.status(500).json({ error: "Failed to search conversations" });
  }
};
