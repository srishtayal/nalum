# Alumni Chat Feature - Comprehensive Design Document

## 📋 Project Context Analysis

Based on the codebase scan, here's what we're working with:

### Current Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui components
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **State Management**: React Context API + TanStack Query (React Query)
- **Current Features**: Authentication, Profile Management, Alumni Directory, Admin Dashboard
- **User Roles**: Student, Alumni, Admin

### Key Observations
1. ✅ MongoDB already in use with Mongoose ODM
2. ❌ No WebSocket/Socket.io implementation yet
3. ✅ JWT-based authentication already implemented
4. ✅ Express middleware architecture in place
5. ✅ CORS configured for frontend-backend communication

---

## 🎯 Feature Requirements

### Core Functionality
1. **Message Request System** (Like LinkedIn/Instagram)
   - Alumni can send message requests to other alumni
   - Recipient can Accept/Reject requests
   - Only accepted connections can exchange messages
   
2. **Real-time Messaging**
   - Instant message delivery using WebSockets
   - Message read receipts
   - Typing indicators
   - Online/Offline status

3. **User Experience**
   - Chat list showing all conversations
   - Individual chat windows
   - Search conversations
   - Unread message count
   - Message notifications

---

## 🏗️ Architecture Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Chat Component │  │ Socket.io    │  │ React Query     │ │
│  │ (UI Layer)     │◄─┤ Client       │◄─┤ (HTTP Requests) │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ WebSocket + HTTP
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                    BACKEND (Node.js/Express)                   │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ REST API       │  │ Socket.io    │  │ Redis PubSub    │  │
│  │ Routes         │  │ Server       │◄─┤ (Multi-instance)│  │
│  └────────────────┘  └──────────────┘  └─────────────────┘  │
│           │                   │                               │
│           ▼                   ▼                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              MongoDB (Persistent Storage)                │ │
│  │  - Conversations    - Messages    - Connections          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              ▲                                │
│                              │                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │         Redis (In-Memory Cache & Real-time Data)         │ │
│  │  - User Online Status    - Typing Indicators             │ │
│  │  - Temporary Session Data - Rate Limiting                │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema Design (MongoDB)

### 1. Connections Collection
Manages connection requests and states between alumni.

```javascript
const connectionSchema = new mongoose.Schema({
  // Participants
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Connection state
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending',
    required: true
  },
  
  // Timestamps for status changes
  requestedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  respondedAt: {
    type: Date,
    default: null
  },
  
  // Optional: Request message
  requestMessage: {
    type: String,
    maxlength: 200,
    default: null
  }
}, { 
  timestamps: true 
});

// Compound index to prevent duplicate connections
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Index for efficient queries
connectionSchema.index({ status: 1, recipient: 1 });
connectionSchema.index({ status: 1, requester: 1 });
```

**WHY THIS DESIGN:**
- **Compound Unique Index**: Prevents duplicate connection requests
- **Status-based queries**: Fast retrieval of pending/accepted connections
- **Bidirectional tracking**: We can query either as requester or recipient
- **Storage efficiency**: Minimal fields, ASCII text only (~50-100 bytes per document)

### 2. Conversations Collection
Represents chat threads between connected users.

```javascript
const conversationSchema = new mongoose.Schema({
  // Participants (sorted for consistent querying)
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  
  // Last message preview
  lastMessage: {
    content: {
      type: String,
      maxlength: 500
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  
  // Read tracking
  lastReadBy: {
    type: Map,
    of: Date,
    default: {}
  },
  
  // Soft delete (if user archives conversation)
  archived: {
    type: Map,
    of: Boolean,
    default: {}
  }
}, { 
  timestamps: true 
});

// Compound index for finding conversations between two users
conversationSchema.index({ participants: 1 });

// Index for sorting by last message
conversationSchema.index({ 'lastMessage.timestamp': -1 });
```

**WHY THIS DESIGN:**
- **Participants array**: Always sorted to enable efficient lookups
- **lastMessage denormalization**: Avoid expensive queries to display chat list
- **Map for read tracking**: Per-user read timestamps without additional collections
- **Archived Map**: Per-user archive status (one user can archive, other can't see it)
- **Storage**: ~200-300 bytes per conversation

### 3. Messages Collection
Stores all chat messages.

```javascript
const messageSchema = new mongoose.Schema({
  // Reference to conversation
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },
  
  // Sender
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Message content (ASCII only as per requirement)
  content: {
    type: String,
    required: true,
    maxlength: 5000,  // Reasonable limit for messages
    trim: true
  },
  
  // Message type (extensible for future features)
  messageType: {
    type: String,
    enum: ['text', 'system'],  // Can add 'image', 'file' later
    default: 'text'
  },
  
  // Read tracking
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Soft delete
  deleted: {
    type: Boolean,
    default: false
  },
  
  // Timestamp (using createdAt from timestamps)
}, { 
  timestamps: true 
});

// Compound indexes for efficient queries
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ conversation: 1, deleted: 1, createdAt: -1 });
```

**WHY THIS DESIGN:**
- **Conversation reference**: Groups messages efficiently
- **Chronological ordering**: createdAt index for pagination
- **Read receipts**: Track who read which message and when
- **Soft delete**: Users can delete messages without losing data
- **ASCII content**: As per requirement, maxlength 5000 chars
- **Storage estimation**: 
  - Average message: ~200-500 bytes
  - 5000 users × 1000 messages average = 5M messages
  - Total: ~2.5 GB for messages alone (well within 120GB limit)

---

## 🔴 Redis Design & Usage

### Why Redis for Chat?

Redis is **essential** for a real-time chat system because:

1. **Speed**: In-memory operations (sub-millisecond latency)
2. **Pub/Sub**: Native support for real-time message broadcasting
3. **Session Management**: Fast user status lookups
4. **Scalability**: Horizontal scaling with Socket.io adapter
5. **TTL Support**: Auto-expiring data (typing indicators, temp cache)

### Redis Data Structures & Use Cases

#### 1. User Online Status
```javascript
// Key: user:online:{userId}
// Type: String with TTL
// Value: timestamp of last activity
// TTL: 30 seconds

SET user:online:507f1f77bcf86cd799439011 "2024-12-06T14:00:00.000Z" EX 30

// Check if user is online
EXISTS user:online:507f1f77bcf86cd799439011  // Returns 1 if online, 0 if offline
```

**WHY**: 
- TTL auto-expires stale connections
- Fast lookups for online status indicators
- Reduces MongoDB queries

#### 2. Typing Indicators
```javascript
// Key: typing:{conversationId}:{userId}
// Type: String with TTL
// Value: "typing"
// TTL: 3 seconds

SETEX typing:conv123:user456 3 "typing"

// Check who's typing in a conversation
KEYS typing:conv123:*
```

**WHY**:
- Auto-expires after 3 seconds (user stopped typing)
- Temporary data, no need for persistence
- Fast broadcast to conversation participants

#### 3. Unread Message Counter (Cache)
```javascript
// Key: unread:{userId}
// Type: Hash
// Fields: conversationId -> unread count

HINCRBY unread:user123 conv456 1  // Increment unread for conversation
HGET unread:user123 conv456       // Get unread count
HDEL unread:user123 conv456       // Mark as read
```

**WHY**:
- Fast unread count updates
- Reduces MongoDB aggregation queries
- Synced with MongoDB periodically

#### 4. Socket.io Adapter (Multi-instance support)
```javascript
// Redis Pub/Sub for Socket.io
// Enables multiple backend servers to communicate

const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

**WHY**:
- Horizontal scaling: Multiple backend instances can share WebSocket connections
- Message routing: Ensures messages reach correct Socket.io server
- Load balancing: Distribute WebSocket connections across servers

#### 5. Rate Limiting
```javascript
// Key: ratelimit:message:{userId}
// Type: String (counter) with TTL
// Limit: 50 messages per minute

INCR ratelimit:message:user123
EXPIRE ratelimit:message:user123 60

// Check if user exceeded limit
GET ratelimit:message:user123  // If > 50, reject
```

**WHY**:
- Prevent spam/abuse
- Protect backend from overload
- Auto-resets every minute

#### 6. Recently Active Conversations Cache
```javascript
// Key: recent:chats:{userId}
// Type: Sorted Set (ZSET)
// Score: timestamp, Member: conversationId

ZADD recent:chats:user123 1701878400 conv456
ZADD recent:chats:user123 1701878350 conv789

// Get top 20 recent conversations
ZREVRANGE recent:chats:user123 0 19 WITHSCORES
```

**WHY**:
- Fast retrieval of chat list
- Sorted by last activity
- Reduces MongoDB queries for chat list

---

## 🔌 WebSocket (Socket.io) Implementation

### Server-Side Setup

```javascript
// backend/sockets/chatSocket.js

const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    
    // Mark user as online
    await redisClient.setEx(`user:online:${userId}`, 30, Date.now().toString());
    
    // Join user to their personal room
    socket.join(`user:${userId}`);
    
    // Broadcast online status to connections
    socket.broadcast.emit('user:online', { userId });
    
    // Periodically update online status (heartbeat)
    const heartbeat = setInterval(async () => {
      await redisClient.setEx(`user:online:${userId}`, 30, Date.now().toString());
    }, 15000);  // Every 15 seconds

    // Handle incoming messages
    socket.on('message:send', async (data) => {
      // Handle in messageHandler (see below)
    });

    // Typing indicator
    socket.on('typing:start', async ({ conversationId }) => {
      await redisClient.setEx(`typing:${conversationId}:${userId}`, 3, 'typing');
      socket.to(`conversation:${conversationId}`).emit('typing:indicator', {
        conversationId,
        userId,
        isTyping: true
      });
    });

    socket.on('typing:stop', async ({ conversationId }) => {
      await redisClient.del(`typing:${conversationId}:${userId}`);
      socket.to(`conversation:${conversationId}`).emit('typing:indicator', {
        conversationId,
        userId,
        isTyping: false
      });
    });

    // Disconnect
    socket.on('disconnect', async () => {
      clearInterval(heartbeat);
      await redisClient.del(`user:online:${userId}`);
      socket.broadcast.emit('user:offline', { userId });
    });
  });

  return io;
}

module.exports = { initializeSocket };
```

**WHY THIS DESIGN:**
- **JWT Authentication**: Secure WebSocket connections
- **Personal rooms**: Each user has a room for targeted messages
- **Heartbeat mechanism**: Keep online status updated
- **Redis integration**: Fast status updates
- **Namespace isolation**: Clean event organization

---

## 📡 API Endpoints Design

### Connection Management APIs

```
POST   /api/chat/connections/request      - Send connection request
POST   /api/chat/connections/respond      - Accept/Reject request
GET    /api/chat/connections              - Get all connections (accepted/pending)
GET    /api/chat/connections/pending      - Get pending requests
DELETE /api/chat/connections/:id          - Remove connection
POST   /api/chat/connections/:id/block    - Block user
```

### Conversation APIs

```
GET    /api/chat/conversations                    - Get all conversations (paginated)
GET    /api/chat/conversations/:id                - Get single conversation details
POST   /api/chat/conversations                    - Create/Get conversation with user
DELETE /api/chat/conversations/:id                - Archive conversation
PUT    /api/chat/conversations/:id/read           - Mark conversation as read
```

### Message APIs

```
GET    /api/chat/messages/:conversationId         - Get messages (paginated)
POST   /api/chat/messages                         - Send message (also via WebSocket)
PUT    /api/chat/messages/:id/read                - Mark message as read
DELETE /api/chat/messages/:id                     - Delete message
```

### Search & Discovery

```
GET    /api/chat/search/users?q={query}           - Search alumni to connect with
GET    /api/chat/search/conversations?q={query}   - Search in conversations
```

---

## 🎨 Frontend Component Structure

```
frontend/src/pages/dashboard/
├── chat/
│   ├── ChatPage.tsx                  # Main chat container
│   ├── components/
│   │   ├── ChatList.tsx              # List of conversations (left sidebar)
│   │   ├── ChatWindow.tsx            # Active chat area
│   │   ├── MessageInput.tsx          # Text input + send button
│   │   ├── MessageBubble.tsx         # Individual message component
│   │   ├── ConnectionRequests.tsx    # Pending requests UI
│   │   ├── UserSearch.tsx            # Search alumni to connect
│   │   ├── OnlineStatus.tsx          # Online/offline indicator
│   │   └── TypingIndicator.tsx       # "User is typing..."
│   ├── hooks/
│   │   ├── useSocket.ts              # Socket.io connection hook
│   │   ├── useMessages.ts            # Message management
│   │   ├── useConnections.ts         # Connection state management
│   │   └── useTypingIndicator.ts     # Typing indicator logic
│   └── context/
│       └── ChatContext.tsx           # Global chat state
```

### Key React Hooks

#### useSocket.ts
```typescript
// Custom hook for Socket.io connection
export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const newSocket = io(BACKEND_URL, {
      auth: { token: user.token },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  return { socket, isConnected };
};
```

#### useMessages.ts
```typescript
// React Query + Socket.io integration
export const useMessages = (conversationId: string) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // Fetch messages with pagination
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: ({ pageParam = 0 }) => 
      fetchMessages(conversationId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Listen for new messages via Socket.io
  useEffect(() => {
    if (!socket) return;

    socket.on('message:new', (message) => {
      queryClient.setQueryData(['messages', conversationId], (old) => {
        // Add new message to cache
      });
    });

    return () => {
      socket.off('message:new');
    };
  }, [socket, conversationId]);

  return { messages: data?.pages.flat(), fetchNextPage, hasNextPage };
};
```

---

## 🚀 Implementation Roadmap

### Phase 1: Backend Foundation (Week 1)
1. ✅ Install dependencies: `socket.io`, `redis`, `@socket.io/redis-adapter`
2. ✅ Set up Redis connection and configuration
3. ✅ Create MongoDB schemas (Connections, Conversations, Messages)
4. ✅ Implement REST API for connection management
5. ✅ Add middleware for connection verification

### Phase 2: WebSocket Integration (Week 1-2)
1. ✅ Initialize Socket.io server with authentication
2. ✅ Implement Socket.io Redis adapter for scaling
3. ✅ Create event handlers (message:send, typing, etc.)
4. ✅ Test WebSocket connections and message flow
5. ✅ Implement online status tracking in Redis

### Phase 3: Frontend UI (Week 2)
1. ✅ Create chat page layout with shadcn/ui components
2. ✅ Implement ChatList component (conversation list)
3. ✅ Build ChatWindow component (message display)
4. ✅ Create MessageInput with real-time typing indicator
5. ✅ Add connection request UI (send/accept/reject)

### Phase 4: Real-time Features (Week 2-3)
1. ✅ Integrate Socket.io client in React
2. ✅ Implement useSocket and useMessages hooks
3. ✅ Add optimistic UI updates (send message immediately)
4. ✅ Implement message read receipts
5. ✅ Add online/offline status indicators

### Phase 5: Polish & Optimization (Week 3)
1. ✅ Add pagination for messages and conversations
2. ✅ Implement search functionality
3. ✅ Add rate limiting and spam prevention
4. ✅ Performance optimization (lazy loading, virtualization)
5. ✅ Error handling and retry logic

### Phase 6: Testing & Deployment (Week 4)
1. ✅ Unit tests for backend APIs
2. ✅ Integration tests for Socket.io events
3. ✅ Frontend component testing
4. ✅ Load testing with multiple concurrent users
5. ✅ Deploy to production with monitoring

---

## 📊 Storage Estimation & Scalability

### Storage Calculations (120GB MongoDB)

```
Assumptions:
- 5000 users (upper bound)
- Average 1000 active users
- Each user has 20 connections (average)
- Each connection = 10 conversations (lifetime)
- Each conversation = 500 messages (average)

Calculations:
1. Connections: 1000 users × 20 connections × 100 bytes = 2 MB
2. Conversations: 1000 users × 10 conversations × 300 bytes = 3 MB
3. Messages: 1000 users × 10 conversations × 500 messages × 400 bytes = 2 GB

Total Storage: ~2.1 GB (with indexes ~3-4 GB)

**Conclusion: 120GB is MORE than enough! We can support 30x growth.**
```

### Redis Memory Estimation

```
Active Users: 1000 concurrent
- Online status: 1000 × 50 bytes = 50 KB
- Typing indicators: 100 × 100 bytes = 10 KB
- Unread counters: 1000 × 1 KB = 1 MB
- Recent chats cache: 1000 × 2 KB = 2 MB
- Socket.io adapter: ~10 MB

Total Redis: ~15 MB (even free tier Redis is enough!)
```

---

## 🔒 Security Considerations

### 1. Authentication & Authorization
- ✅ JWT verification for WebSocket connections
- ✅ Verify connection exists before allowing messages
- ✅ Role-based access (only alumni can chat)

### 2. Rate Limiting
```javascript
// Redis-based rate limiting
const rateLimit = async (userId) => {
  const key = `ratelimit:message:${userId}`;
  const count = await redisClient.incr(key);
  
  if (count === 1) {
    await redisClient.expire(key, 60);  // 1 minute window
  }
  
  if (count > 50) {  // 50 messages per minute
    throw new Error('Rate limit exceeded');
  }
};
```

### 3. Input Validation
- Sanitize message content (prevent XSS)
- Validate message length (max 5000 chars)
- Check for ASCII-only content (as per requirement)

### 4. Privacy
- Users can only see messages in their conversations
- Block/report functionality
- Soft delete for user privacy

---

## 🎯 Advanced Features (Future Enhancements)

### 1. Message Reactions (Emoji)
- Store reactions in separate collection
- Increment counters for popular reactions
- Real-time reaction updates via WebSocket

### 2. File/Image Sharing
- Upload to cloud storage (AWS S3 / Cloudinary)
- Store file URLs in message schema
- Thumbnail generation for images

### 3. Voice/Video Calls
- Integrate WebRTC for peer-to-peer calls
- Use Twilio/Agora for signaling server
- Store call logs in database

### 4. Group Chats
- Extend participants array to support >2 users
- Add admin roles for groups
- Group invite system

### 5. Message Search
- Index messages in Elasticsearch
- Full-text search across all conversations
- Search by sender, date, keywords

### 6. Push Notifications
- Integrate Firebase Cloud Messaging (FCM)
- Send notifications for new messages when user is offline
- Notification preferences in user settings

---

## 🧪 Testing Strategy

### Backend Testing
```javascript
// Test connection request flow
describe('Connection Requests', () => {
  it('should create pending connection request', async () => {
    const response = await request(app)
      .post('/api/chat/connections/request')
      .set('Authorization', `Bearer ${token}`)
      .send({ recipientId: 'user123' });
    
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('pending');
  });
});

// Test WebSocket message flow
describe('Socket.io Events', () => {
  it('should emit message to recipient', (done) => {
    clientSocket.emit('message:send', messageData);
    recipientSocket.on('message:new', (data) => {
      expect(data.content).toBe(messageData.content);
      done();
    });
  });
});
```

### Frontend Testing
```typescript
// Test message rendering
describe('MessageBubble', () => {
  it('should render message content', () => {
    render(<MessageBubble message={mockMessage} />);
    expect(screen.getByText(mockMessage.content)).toBeInTheDocument();
  });
});

// Test Socket.io hook
describe('useSocket', () => {
  it('should connect to socket server', async () => {
    const { result } = renderHook(() => useSocket());
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
  });
});
```

---

## 📈 Performance Optimization

### 1. Message Pagination
- Load 50 messages initially
- Infinite scroll for older messages
- Virtual scrolling for large message lists (react-window)

### 2. Conversation List Optimization
- Load 20 conversations initially
- Lazy load more on scroll
- Cache in React Query with stale-while-revalidate

### 3. Redis Caching Strategy
- Cache frequently accessed data (online status, unread counts)
- Set appropriate TTLs (30s for online, 5min for unread)
- Invalidate cache on updates

### 4. Database Indexes
```javascript
// Ensure these indexes exist for fast queries
db.connections.createIndex({ requester: 1, recipient: 1 }, { unique: true });
db.conversations.createIndex({ participants: 1 });
db.messages.createIndex({ conversation: 1, createdAt: -1 });
```

### 5. WebSocket Optimization
- Use binary protocol for efficiency
- Compress messages (Socket.io compression)
- Connection pooling with Redis adapter

---

## 🛠️ NPM Dependencies to Install

### Backend
```bash
npm install socket.io @socket.io/redis-adapter redis ioredis
```

### Frontend
```bash
npm install socket.io-client
```

---

## 📝 Environment Variables

Add to `.env`:

```bash
# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password  # If using managed Redis

# Socket.io Configuration
SOCKET_IO_PING_TIMEOUT=60000
SOCKET_IO_PING_INTERVAL=25000

# Chat Configuration
MAX_MESSAGE_LENGTH=5000
RATE_LIMIT_MESSAGES_PER_MINUTE=50
```

---

## 🎓 Why This Approach?

### 1. MongoDB for Persistence
- **Long-term storage**: Messages, conversations, connections
- **Rich querying**: Complex filters, aggregations
- **Schema flexibility**: Easy to extend with new fields
- **Cost-effective**: 120GB is plenty for this use case

### 2. Redis for Real-time
- **Speed**: Sub-millisecond latency for online status
- **TTL**: Auto-expiring data (typing indicators)
- **Pub/Sub**: WebSocket message routing across servers
- **Scalability**: Horizontal scaling with Socket.io adapter

### 3. Socket.io for WebSockets
- **Fallback support**: Polling if WebSocket fails
- **Room management**: Easy broadcast to specific users
- **Redis adapter**: Multi-instance support out of the box
- **Client libraries**: Official React integration

### 4. React Query + Context
- **Caching**: Automatic cache management
- **Optimistic updates**: Instant UI feedback
- **Background refetching**: Keep data fresh
- **Error handling**: Built-in retry logic

---

## 🚨 Common Pitfalls to Avoid

1. ❌ **Don't store large files in MongoDB**
   - ✅ Use cloud storage (S3, Cloudinary) for images/files

2. ❌ **Don't query MongoDB for every online status check**
   - ✅ Use Redis for real-time data

3. ❌ **Don't forget to clean up Socket.io listeners**
   - ✅ Always remove listeners in React useEffect cleanup

4. ❌ **Don't send entire message history on conversation load**
   - ✅ Implement pagination (50 messages at a time)

5. ❌ **Don't allow unlimited message sending**
   - ✅ Implement rate limiting (50 messages/minute)

6. ❌ **Don't forget error handling for WebSocket disconnections**
   - ✅ Implement automatic reconnection logic

7. ❌ **Don't store sensitive data in Redis without encryption**
   - ✅ Only store non-sensitive data or encrypt first

---

## 📚 Learning Resources

### Socket.io
- Official Docs: https://socket.io/docs/v4/
- Redis Adapter: https://socket.io/docs/v4/redis-adapter/

### Redis
- Redis Commands: https://redis.io/commands/
- Redis PubSub: https://redis.io/docs/manual/pubsub/

### Best Practices
- Scalable Chat Architecture: https://socket.io/docs/v4/scale-to-multiple-nodes/
- MongoDB Schema Design: https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design

---

## 🎯 Success Metrics

Track these metrics after launch:

1. **Performance**
   - Average message delivery time < 100ms
   - Socket.io connection success rate > 99%
   - API response time < 200ms

2. **User Engagement**
   - Average connections per user
   - Daily active conversations
   - Messages per conversation

3. **System Health**
   - Redis hit rate > 95%
   - MongoDB query performance < 50ms
   - WebSocket connection stability

4. **Storage**
   - Total MongoDB storage usage
   - Average message size
   - Growth rate (messages/day)

---

## 🏁 Conclusion

This design provides a **scalable, efficient, and user-friendly** chat system for your alumni network. The combination of:

- **MongoDB** for reliable persistence
- **Redis** for blazing-fast real-time features  
- **Socket.io** for robust WebSocket management
- **React Query** for smart client-side caching

...ensures that your system can handle 5000 users (upper bound) with room to grow 30x before hitting storage limits.

The architecture is **production-ready**, follows **industry best practices**, and is designed with **security and performance** in mind from day one.

---

**Next Steps:**
1. Review this document with your mentor
2. Set up Redis instance (local for dev, managed for prod)
3. Start with Phase 1 implementation
4. Follow the roadmap week by week

**Questions?** Reach out to discuss any section in detail!

---

*Document Version: 1.0*  
*Last Updated: December 6, 2024*  
*Author: Senior Web Developer*
