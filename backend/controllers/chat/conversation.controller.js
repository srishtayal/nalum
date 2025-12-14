const Conversation = require('../../models/chat/conversations.model');
const Connection = require('../../models/chat/connections.model');
const Message = require('../../models/chat/messages.model');
const Profile = require('../../models/user/profile.model');
const redisClient = require('../../config/redis.config'); // Fixed import to match previous fix

// Get all conversations
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({
      participants: userId,
      [`archived.${userId}`]: { $ne: true }
    })
      .populate('participants', 'name email profilePicture')
      .populate('lastMessage.sender', 'name')
      .sort({ 'lastMessage.timestamp': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get all participant IDs to fetch profiles
    const participantIds = [...new Set(conversations.flatMap(c => c.participants.map(p => p._id)))];

    // Fetch profiles for all participants
    const profiles = await Profile.find({ user: { $in: participantIds } })
      .select('user profile_picture');

    const profileMap = profiles.reduce((acc, profile) => {
      acc[profile.user.toString()] = profile.profile_picture;
      return acc;
    }, {});

    // Get unread counts and compute otherParticipant with profile picture
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        // Count unread messages directly from MongoDB for accuracy
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: userId },
          'readBy.user': { $ne: userId },
          deleted: { $ne: true } // Exclude deleted messages
        });

        // Attach profile pictures to participants
        const participantsWithPics = conv.participants.map(p => ({
          ...p.toObject(),
          profile_picture: profileMap[p._id.toString()]
        }));

        // Find the other participant (not the current user)
        const otherParticipant = participantsWithPics.find(
          p => p._id.toString() !== userId.toString()
        );

        return {
          ...conv.toObject(),
          participants: participantsWithPics,
          otherParticipant,
          unreadCount
        };
      })
    );

    const total = await Conversation.countDocuments({
      participants: userId,
      [`archived.${userId}`]: { $ne: true }
    });

    res.json({
      success: true,
      data: conversationsWithUnread,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to retrieve conversations' });
  }
};

// Get single conversation
exports.getConversation = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'name email profilePicture')
      .populate('lastMessage.sender', 'name');

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).json({ error: 'Not authorized to view this conversation' });
    }

    const unreadCount = await Message.countDocuments({
      conversation: conversationId,
      sender: { $ne: userId },
      'readBy.user': { $ne: userId }
    });

    // Fetch profiles for participants
    const profiles = await Profile.find({
      user: { $in: conversation.participants.map(p => p._id) }
    }).select('user profile_picture');

    const profileMap = profiles.reduce((acc, profile) => {
      acc[profile.user.toString()] = profile.profile_picture;
      return acc;
    }, {});

    const participantsWithPics = conversation.participants.map(p => ({
      ...p.toObject(),
      profile_picture: profileMap[p._id.toString()]
    }));

    // Find other participant for consistent response structure
    const otherParticipant = participantsWithPics.find(
      p => p._id.toString() !== userId.toString()
    );

    res.json({
      conversation: {
        ...conversation.toObject(),
        participants: participantsWithPics,
        otherParticipant, // Add this for easier frontend consumption
        unreadCount: unreadCount
      }
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to retrieve conversation' });
  }
};

// Create or get conversation with user
exports.createConversation = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required' });
    }

    if (userId === participantId) {
      return res.status(400).json({ error: 'Cannot create conversation with yourself' });
    }

    // Check if users are connected
    const connection = await Connection.findOne({
      $or: [
        { requester: userId, recipient: participantId, status: 'accepted' },
        { requester: participantId, recipient: userId, status: 'accepted' }
      ]
    });

    if (!connection) {
      return res.status(403).json({ error: 'Users must be connected to start a conversation' });
    }

    // Sort participants for consistent querying
    const participants = [userId, participantId].sort();

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: participants, $size: 2 }
    });

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants
      });
      await conversation.save();
    }

    await conversation.populate('participants', 'name email profilePicture');

    // Fetch profiles for participants
    const profiles = await Profile.find({
      user: { $in: conversation.participants.map(p => p._id) }
    }).select('user profile_picture');

    const profileMap = profiles.reduce((acc, profile) => {
      acc[profile.user.toString()] = profile.profile_picture;
      return acc;
    }, {});

    const participantsWithPics = conversation.participants.map(p => ({
      ...p.toObject(),
      profile_picture: profileMap[p._id.toString()]
    }));

    // Compute otherParticipant
    const otherParticipant = participantsWithPics.find(
      p => p._id.toString() !== userId.toString()
    );

    res.status(conversation.isNew ? 201 : 200).json({
      success: true,
      message: conversation.isNew ? 'Conversation created' : 'Conversation exists',
      data: {
        ...conversation.toObject(),
        participants: participantsWithPics,
        otherParticipant
      }
    });

  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

// Archive conversation
exports.archiveConversation = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.some(p => p.toString() === userId)) {
      return res.status(403).json({ error: 'Not authorized to archive this conversation' });
    }

    conversation.archived.set(userId, true);
    await conversation.save();

    res.json({ message: 'Conversation archived successfully' });

  } catch (error) {
    console.error('Archive conversation error:', error);
    res.status(500).json({ error: 'Failed to archive conversation' });
  }
};

// Mark conversation as read
exports.markConversationRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.some(p => p.toString() === userId)) {
      return res.status(403).json({ error: 'Not authorized to update this conversation' });
    }

    conversation.lastReadBy.set(userId, new Date());
    await conversation.save();

    // Clear unread count in Redis
    try {
      const client = redisClient.getRedisClient();
      if (client && client.isOpen) {
        await client.hDel(`unread:${userId}`, conversationId);
      }
    } catch (error) {
      console.warn('Redis update failed:', error.message);
    }

    res.json({ message: 'Conversation marked as read' });

  } catch (error) {
    console.error('Mark conversation read error:', error);
    res.status(500).json({ error: 'Failed to mark conversation as read' });
  }
};
