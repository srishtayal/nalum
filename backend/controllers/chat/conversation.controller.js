const Conversation = require('../../models/chat/conversations.model');
const Connection = require('../../models/chat/connections.model');
const redisClient = require('../../config/redis');

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

    // Get unread counts and compute otherParticipant
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        let unreadCount = 0;
        try {
          if (redisClient && redisClient.isOpen) {
            unreadCount = await redisClient.hGet(`unread:${userId}`, conv._id.toString()) || 0;
          }
        } catch (error) {
          console.warn('Redis read failed:', error.message);
        }
        
        // Find the other participant (not the current user)
        const otherParticipant = conv.participants.find(
          p => p._id.toString() !== userId.toString()
        );
        
        return {
          ...conv.toObject(),
          otherParticipant,
          unreadCount: parseInt(unreadCount)
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

    const unreadCount = await redisClient?.hGet(`unread:${userId}`, conversationId) || 0;

    res.json({
      conversation: {
        ...conversation.toObject(),
        unreadCount: parseInt(unreadCount)
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

    // Compute otherParticipant
    const otherParticipant = conversation.participants.find(
      p => p._id.toString() !== userId.toString()
    );

    res.status(conversation.isNew ? 201 : 200).json({
      success: true,
      message: conversation.isNew ? 'Conversation created' : 'Conversation exists',
      data: {
        ...conversation.toObject(),
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
      if (redisClient && redisClient.isOpen) {
        await redisClient.hDel(`unread:${userId}`, conversationId);
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
