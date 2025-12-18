const Message = require('../../models/chat/messages.model');
const Conversation = require('../../models/chat/conversations.model');

// Get messages for a conversation
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.some(p => p.toString() === userId.toString())) {
      return res.status(403).json({ error: 'Not authorized to view these messages' });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({
      conversation: conversationId,
      deleted: false
    })
      .populate('sender', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({
      conversation: conversationId,
      deleted: false
    });

    res.json({
      success: true,
      data: messages.reverse(), // Reverse to show oldest first
      hasMore: page * limit < total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

// Send message (HTTP endpoint, also available via WebSocket)
exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ error: 'Conversation ID and content are required' });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content cannot be empty' });
    }

    if (content.length > 5000) {
      return res.status(400).json({ error: 'Message too long (max 5000 characters)' });
    }

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.some(p => p.toString() === userId.toString())) {
      return res.status(403).json({ error: 'Not authorized to send messages in this conversation' });
    }

    // Create message
    const message = new Message({
      conversation: conversationId,
      sender: userId,
      content: content.trim(),
      messageType: 'text',
      readBy: [{ user: userId, readAt: new Date() }]
    });

    await message.save();

    // Update conversation last message
    conversation.lastMessage = {
      content: content.substring(0, 500),
      sender: userId,
      timestamp: new Date()
    };
    await conversation.save();

    await message.populate('sender', 'name email profilePicture');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Mark message as read
exports.markMessageRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Verify user is part of conversation
    const conversation = await Conversation.findById(message.conversation);
    if (!conversation || !conversation.participants.some(p => p.toString() === userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Check if already read
    const alreadyRead = message.readBy.some(r => r.user.toString() === userId);
    if (!alreadyRead) {
      message.readBy.push({ user: userId, readAt: new Date() });
      await message.save();
    }

    res.json({ message: 'Message marked as read' });

  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

// Delete message (soft delete)
exports.deleteMessage = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only sender can delete their message
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    message.deleted = true;
    await message.save();

    // Notify conversation participants via socket
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${message.conversation}`).emit('message:deleted', {
        messageId: message._id,
        conversationId: message.conversation
      });
    }

    res.json({ message: 'Message deleted successfully' });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
