# Quick Reference - Chat Feature

## 🚀 Quick Start

```bash
# Start everything
./start-chat-test.sh

# Or manually:
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev

# Access: http://localhost:5173/dashboard/chat
```

## 📁 Files Created

### Hooks (`frontend/src/hooks/`)
- `useSocket.ts` - Socket.io connection
- `useConnections.ts` - Connection management API
- `useConversations.ts` - Conversation API
- `useMessages.ts` - Messages API + real-time
- `useTypingIndicator.ts` - Typing events

### Context (`frontend/src/context/`)
- `ChatContext.tsx` - Global chat state

### Components (`frontend/src/pages/dashboard/chat/`)
- `ChatPage.tsx` - Main container
- `components/ChatList.tsx` - Sidebar with conversations
- `components/ChatWindow.tsx` - Active chat area
- `components/MessageInput.tsx` - Input with typing
- `components/MessageBubble.tsx` - Message display
- `components/TypingIndicator.tsx` - Typing animation
- `components/ConnectionRequests.tsx` - Pending requests
- `components/UserSearch.tsx` - Find alumni
- `components/OnlineStatus.tsx` - Online badge

### Routes Modified
- `App.tsx` - Added `/dashboard/chat` route
- `Sidebar.tsx` - Added "Messages" link

## 🔌 Socket Events

### Emit
```javascript
socket.emit('message:send', { receiverId, content })
socket.emit('typing:start', { conversationId, receiverId })
socket.emit('typing:stop', { conversationId, receiverId })
```

### Listen
```javascript
socket.on('message:new', (message) => {})
socket.on('message:read', (data) => {})
socket.on('message:deleted', (data) => {})
socket.on('typing:start', (data) => {})
socket.on('typing:stop', (data) => {})
```

## 🔗 API Endpoints (Backend)

All use `/chat` prefix (no `/api`):

```javascript
// Connections
POST   /chat/connections/request
POST   /chat/connections/respond
GET    /chat/connections
GET    /chat/connections/pending
DELETE /chat/connections/:id

// Conversations
GET    /chat/conversations
POST   /chat/conversations
PUT    /chat/conversations/:id/read
DELETE /chat/conversations/:id

// Messages
GET    /chat/messages/:conversationId
POST   /chat/messages
PUT    /chat/messages/:id/read
DELETE /chat/messages/:id

// Search
GET    /chat/search/users?q={query}
GET    /chat/search/conversations?q={query}
```

## 🧪 Testing Flow

1. **Login** with 2 different accounts (use 2 browsers)
2. **Connect**: User A searches for User B → Click "Connect"
3. **Accept**: User B goes to "Requests" tab → Click "Accept"
4. **Chat**: Both users click on each other in "Chats" tab
5. **Message**: Type and send messages
6. **Verify**: Messages appear instantly in both windows
7. **Typing**: Start typing to see typing indicator

## 🎨 UI Features

- **Responsive**: Works on mobile and desktop
- **Tabs**: Chats | Requests | Find
- **Search**: Real-time user search
- **Badges**: Unread counts, online status
- **Animations**: Typing dots, smooth scrolling
- **Actions**: Delete messages, archive chats

## 🛠 Tech Stack

- React + TypeScript
- Socket.io-client
- TanStack Query (React Query)
- Radix UI + Tailwind CSS
- date-fns (formatting)

## 📊 State Management

- **Socket**: Global via ChatContext
- **API Data**: React Query with caching
- **Real-time**: Socket events update React Query cache

## 🐛 Debug Tips

```javascript
// Check socket connection
console.log(socket.connected) // true/false

// Monitor events
socket.onAny((event, ...args) => {
  console.log(event, args);
});

// Check React Query cache
import { useQueryClient } from '@tanstack/react-query';
const queryClient = useQueryClient();
console.log(queryClient.getQueryData(['messages', conversationId]));
```

## 📝 Notes

- Backend has no `/api` prefix for chat routes
- Uses existing `context/` and `hooks/` folders
- JWT auth via socket.io `auth` parameter
- Messages sent via socket, HTTP as fallback
- Build tested and working ✅

## 📚 Documentation

- `CHAT_TESTING_GUIDE.md` - Detailed testing instructions
- `CHAT_IMPLEMENTATION_SUMMARY.md` - Full implementation details
- `CHAT_FEATURE_DESIGN.md` - Original design document
