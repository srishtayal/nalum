const redisClient = require('../../config/redis');

async function handleTypingStart(socket, data) {
  try {
    const { conversationId } = data;
    const userId = socket.userId;

    if (!conversationId) {
      return;
    }

    // Set typing indicator in Redis with 3 second TTL (skip if Redis not available)
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.setEx(`typing:${conversationId}:${userId}`, 3, 'typing');
      } catch (error) {
        console.warn('Redis typing indicator failed:', error.message);
      }
    }

    // Emit to conversation room (excluding sender)
    socket.to(`conversation:${conversationId}`).emit('typing:indicator', {
      conversationId,
      userId,
      isTyping: true
    });

  } catch (error) {
    console.error('Typing start error:', error);
  }
}

async function handleTypingStop(socket, data) {
  try {
    const { conversationId } = data;
    const userId = socket.userId;

    if (!conversationId) {
      return;
    }

    // Remove typing indicator from Redis (skip if Redis not available)
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.del(`typing:${conversationId}:${userId}`);
      } catch (error) {
        console.warn('Redis typing indicator cleanup failed:', error.message);
      }
    }

    // Emit to conversation room (excluding sender)
    socket.to(`conversation:${conversationId}`).emit('typing:indicator', {
      conversationId,
      userId,
      isTyping: false
    });

  } catch (error) {
    console.error('Typing stop error:', error);
  }
}

module.exports = {
  handleTypingStart,
  handleTypingStop
};
