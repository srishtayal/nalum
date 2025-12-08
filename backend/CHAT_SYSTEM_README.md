# Chat System Implementation

## Overview
A complete real-time chat system for the NALUM alumni platform with WebSocket support, MongoDB storage, and Redis caching.

## Features
- ✅ Connection management (send/accept/reject/block requests)
- ✅ Real-time messaging with Socket.io
- ✅ Conversation management
- ✅ Read receipts and typing indicators
- ✅ User online status tracking
- ✅ Message search functionality
- ✅ Rate limiting and spam prevention
- ✅ Horizontal scaling support with Redis adapter

## Tech Stack
- **MongoDB**: Persistent storage for connections, conversations, and messages
- **Redis**: Real-time data (online status, typing indicators, unread counts)
- **Socket.io**: WebSocket connections for real-time communication
- **Express**: REST API endpoints

## API Endpoints

### Connection Management
```
POST   /chat/connections/request      - Send connection request
POST   /chat/connections/respond      - Accept/Reject request
GET    /chat/connections              - Get all connections
GET    /chat/connections/pending      - Get pending requests
DELETE /chat/connections/:id          - Remove connection
POST   /chat/connections/:id/block    - Block user
```

### Conversations
```
GET    /chat/conversations                    - Get all conversations
GET    /chat/conversations/:id                - Get single conversation
POST   /chat/conversations                    - Create/Get conversation
DELETE /chat/conversations/:id                - Archive conversation
PUT    /chat/conversations/:id/read           - Mark as read
```

### Messages
```
GET    /chat/messages/:conversationId         - Get messages
POST   /chat/messages                         - Send message
PUT    /chat/messages/:id/read                - Mark message as read
DELETE /chat/messages/:id                     - Delete message
```

### Search
```
GET    /chat/search/users?q={query}           - Search users to connect
GET    /chat/search/conversations?q={query}   - Search in conversations
```

## WebSocket Events

### Client → Server
```javascript
// Join conversation
socket.emit('conversation:join', conversationId)

// Send message
socket.emit('message:send', { conversationId, content })

// Typing indicators
socket.emit('typing:start', { conversationId })
socket.emit('typing:stop', { conversationId })

// Read receipt
socket.emit('message:read', { conversationId, messageId })
```

### Server → Client
```javascript
// New message
socket.on('message:new', ({ conversationId, message }) => {})

// Message sent confirmation
socket.on('message:sent', ({ conversationId, message }) => {})

// Message read
socket.on('message:read', ({ conversationId, userId, messageId }) => {})

// Typing indicator
socket.on('typing:indicator', ({ conversationId, userId, isTyping }) => {})

// User online/offline
socket.on('user:online', ({ userId }) => {})
socket.on('user:offline', ({ userId }) => {})

// Errors
socket.on('message:error', ({ error }) => {})
```

## Authentication

### REST API
All REST endpoints require Bearer token:
```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

### WebSocket
Socket.io requires token in handshake:
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});
```

## Environment Variables

Add to `.env`:
```
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
```

## Redis Data Structures

### User Online Status
```
Key: user:online:{userId}
Type: String with TTL (30 seconds)
```

### Typing Indicators
```
Key: typing:{conversationId}:{userId}
Type: String with TTL (3 seconds)
```

### Unread Counts
```
Key: unread:{userId}
Type: Hash (conversationId → count)
```

### Recent Conversations Cache
```
Key: recent:chats:{userId}
Type: Sorted Set (score: timestamp)
```

### Rate Limiting
```
Key: ratelimit:message:{userId}
Type: String with TTL (60 seconds)
Limit: 50 messages per minute
```

## Database Collections

### Connections
Stores connection requests between users with status tracking.

### Conversations
Groups messages between connected users with last message preview.

### Messages
Individual chat messages with read receipts and soft delete support.

## Usage Examples

### 1. Send Connection Request
```javascript
POST /chat/connections/request
{
  "recipientId": "user123",
  "requestMessage": "Hi, let's connect!"
}
```

### 2. Accept Connection
```javascript
POST /chat/connections/respond
{
  "connectionId": "conn123",
  "action": "accept"
}
```

### 3. Start Conversation
```javascript
POST /chat/conversations
{
  "participantId": "user123"
}
```

### 4. Connect to Socket.io
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') }
});

socket.on('connect', () => {
  console.log('Connected to chat server');
  socket.emit('conversation:join', conversationId);
});

socket.on('message:new', (data) => {
  console.log('New message:', data.message);
});
```

### 5. Send Message via Socket
```javascript
socket.emit('message:send', {
  conversationId: 'conv123',
  content: 'Hello!'
});
```

### 6. Typing Indicator
```javascript
// Start typing
socket.emit('typing:start', { conversationId: 'conv123' });

// Stop typing after user stops
setTimeout(() => {
  socket.emit('typing:stop', { conversationId: 'conv123' });
}, 3000);
```

## Performance Considerations

### Pagination
All list endpoints support pagination:
```
GET /chat/conversations?page=1&limit=20
GET /chat/messages/:conversationId?page=1&limit=50
```

### Indexing
MongoDB indexes optimize queries:
- Compound unique index on connections
- Conversation participants index
- Message conversation + timestamp index

### Caching
Redis caches frequently accessed data:
- Online user status
- Unread message counts
- Recent conversations list

### Rate Limiting
Prevents spam and abuse:
- 50 messages per minute per user
- Auto-reset with Redis TTL

## Scaling

### Horizontal Scaling
Redis adapter enables multiple backend instances:
```javascript
// Automatically configured in chatSocket.js
const { createAdapter } = require('@socket.io/redis-adapter');
io.adapter(createAdapter(pubClient, subClient));
```

### Load Balancing
Deploy multiple instances behind a load balancer. Redis ensures WebSocket messages route correctly across instances.

## Security

- JWT authentication for all endpoints and WebSocket connections
- Connection verification (users must be connected to chat)
- Rate limiting to prevent spam
- Input validation (max message length: 5000 chars)
- Soft delete for data retention

## Testing

### Test REST API
```bash
# Send connection request
curl -X POST http://localhost:5000/chat/connections/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"recipientId":"USER_ID"}'

# Get conversations
curl http://localhost:5000/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test WebSocket
Use the Socket.io client library or tools like Socket.io Tester Chrome extension.

## Troubleshooting

### Redis Connection Issues
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start Redis if needed
redis-server
```

### Socket.io Connection Issues
- Verify FRONTEND_URL is correct in .env
- Check JWT token is valid
- Ensure CORS settings allow your frontend origin

### Message Not Sending
- Verify users are connected (connection status: 'accepted')
- Check rate limiting (max 50 messages/minute)
- Ensure conversation exists

## File Structure
```
backend/
├── models/chat/
│   ├── connection.model.js
│   ├── conversation.model.js
│   └── message.model.js
├── controllers/chat/
│   ├── connection.controller.js
│   ├── conversation.controller.js
│   ├── message.controller.js
│   └── search.controller.js
├── routes/chat/
│   ├── connection.routes.js
│   ├── conversation.routes.js
│   ├── message.routes.js
│   ├── search.routes.js
│   └── index.js
├── sockets/
│   ├── chatSocket.js
│   └── handlers/
│       ├── messageHandlers.js
│       └── typingHandlers.js
├── config/
│   ├── redis.js
│   └── redis.config.js
└── middleware/
    └── auth.middleware.js
```

## Next Steps

1. Start Redis server: `redis-server`
2. Start backend: `npm run dev`
3. Test health endpoint: `curl http://localhost:5000/health`
4. Connect via Socket.io client
5. Send test messages

## Support

For issues or questions, refer to the main project documentation or create an issue in the repository.
