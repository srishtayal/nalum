# Chat Feature Testing Guide

## Overview
This guide will help you test the newly implemented chat/messaging feature with WebSocket support.

## Prerequisites
- Backend running on port 8000 (or your configured port)
- Frontend running on port 5173
- At least 2 user accounts for testing connections and messaging

## Setup Instructions

### 1. Start the Backend
```bash
cd backend
npm run dev
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Access the Chat Interface
- Login with a user account
- Navigate to `/dashboard/chat` or click "Messages" in the sidebar

## Testing Features

### Socket Connection
- **Check**: Look for the "Online/Offline" badge in the top-right of the chat interface
- **Expected**: Should show "Online" when connected
- **Console**: Open browser console to see socket connection logs

### Connection Management

#### Send Connection Request
1. Click the "Find" tab
2. Search for another user by name or email
3. Click "Connect" button
4. **Expected**: "Connection request sent" toast notification

#### Accept/Reject Requests
1. Click the "Requests" tab
2. View pending connection requests
3. Click "Accept" or "Reject"
4. **Expected**: Request disappears from the list

### Messaging

#### Start a Conversation
1. Click the "Chats" tab
2. Select a connected user from the list
3. Type a message in the input field
4. Press Enter or click Send button
5. **Expected**: Message appears instantly in chat window

#### Real-time Messaging
1. Open two browser windows with different user accounts
2. Send messages between them
3. **Expected**: Messages appear instantly without page refresh

#### Typing Indicator
1. In one window, start typing a message
2. In the other window, observe the chat
3. **Expected**: "Someone is typing..." indicator appears

#### Message Features
- **Scroll to load more**: Scroll up to load previous messages (pagination)
- **Delete message**: Hover over your own message, click trash icon
- **Read receipts**: Sent messages show "Read" when seen by recipient

### Search Functionality

#### Search Users
1. Go to "Find" tab
2. Type in the search box
3. **Expected**: Real-time search results of alumni

#### Search Conversations
1. Go to "Chats" tab
2. Use the search box at the top
3. **Expected**: Filter conversations by participant name

## WebSocket Events to Monitor

Open browser console to see these socket events:

### Client Emits:
- `message:send` - When sending a message
- `typing:start` - When user starts typing
- `typing:stop` - When user stops typing

### Client Receives:
- `message:new` - New message received
- `message:read` - Message marked as read
- `message:deleted` - Message was deleted
- `typing:start` - Other user started typing
- `typing:stop` - Other user stopped typing

## Testing Checklist

- [ ] Socket connects successfully
- [ ] Can send connection requests
- [ ] Can accept/reject connection requests
- [ ] Can search for users
- [ ] Can send messages via socket
- [ ] Messages appear in real-time
- [ ] Typing indicator works
- [ ] Can delete own messages
- [ ] Read receipts work
- [ ] Message pagination works
- [ ] Unread count displays correctly
- [ ] Conversation list updates in real-time
- [ ] Works on mobile layout (responsive)

## Common Issues

### Socket Not Connecting
- **Check**: Backend is running and socket.io is configured
- **Check**: CORS settings allow frontend origin
- **Check**: Authentication token is valid

### Messages Not Appearing
- **Check**: Both users are connected (accepted connection request)
- **Check**: Socket is connected (check badge)
- **Check**: Browser console for errors

### Typing Indicator Not Working
- **Check**: Socket connection is active
- **Check**: ConversationId is correct
- **Check**: Browser console for socket events

## API Endpoints Reference

All endpoints are prefixed with `/chat` (no `/api` prefix in backend):

### Connection Management
- `POST /chat/connections/request` - Send connection request
- `POST /chat/connections/respond` - Accept/Reject request
- `GET /chat/connections` - Get all connections
- `GET /chat/connections/pending` - Get pending requests
- `DELETE /chat/connections/:id` - Remove connection

### Conversations
- `GET /chat/conversations` - Get all conversations
- `GET /chat/conversations/:id` - Get single conversation
- `POST /chat/conversations` - Create/Get conversation
- `DELETE /chat/conversations/:id` - Archive conversation
- `PUT /chat/conversations/:id/read` - Mark as read

### Messages
- `GET /chat/messages/:conversationId` - Get messages (paginated)
- `POST /chat/messages` - Send message (fallback, prefer socket)
- `PUT /chat/messages/:id/read` - Mark message as read
- `DELETE /chat/messages/:id` - Delete message

### Search
- `GET /chat/search/users?q={query}` - Search users
- `GET /chat/search/conversations?q={query}` - Search conversations

## Tech Stack
- **Frontend**: React + TypeScript + Socket.io-client
- **Backend**: Node.js + Express + Socket.io
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI + Tailwind CSS

## Notes
- Messages are sent primarily via WebSocket for real-time communication
- HTTP POST fallback exists if socket connection fails
- Authentication uses JWT tokens passed via socket.io auth
- All socket events are logged in browser console for debugging
