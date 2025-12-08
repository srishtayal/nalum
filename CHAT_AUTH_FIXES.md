# Chat Authentication Fixes

## Issues Found and Fixed

### 1. ❌ HTTP API Requests Not Authenticated (401 Errors)

**Problem:** All chat API hooks were using plain `axios` instead of the configured `api` instance that includes authentication headers.

**Files Fixed:**
- `frontend/src/hooks/useConnections.ts`
- `frontend/src/hooks/useConversations.ts`
- `frontend/src/hooks/useMessages.ts`
- `frontend/src/pages/dashboard/chat/components/UserSearch.tsx`
- `backend/controllers/chat/search.controller.js` (response format)

**Changes Made:**
```typescript
// Before (WRONG):
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
await axios.get(`${BASE_URL}/chat/connections`);

// After (CORRECT):
import api from "@/lib/api";
await api.get("/chat/connections");
```

**Why:** The `api` instance from `@/lib/api` has an interceptor that automatically adds the `Authorization: Bearer <token>` header to all requests. Plain `axios` doesn't have this.

**Backend Response Format Fixed:**
```javascript
// Before: { users: [...] }
// After: { success: true, data: [...] }
```

### 2. ❌ Socket.io Authentication Token Mismatch

**Problem:** Socket.io was looking for `decoded.id` but the JWT token contains `decoded.user_id`.

**File Fixed:**
- `backend/sockets/chatSocket.js` (line 48)

**Changes Made:**
```javascript
// Before (WRONG):
socket.userId = decoded.id;

// After (CORRECT):
socket.userId = decoded.user_id;
```

**JWT Token Structure:**
```javascript
{
  user_id: "...",
  email: "...",
  session_id: "...",
  iat: ...,
  exp: ...
}
```

### 3. ℹ️ Socket Connection Warnings (Expected Behavior)

**Console Message:**
```
Firefox can't establish a connection to the server at ws://localhost:5000/socket.io/?EIO=4&transport=websocket.
```

**Status:** This is **normal behavior** during initial connection attempts. Socket.io tries WebSocket first, and if it fails, automatically falls back to polling.

**What Happens:**
1. Browser tries WebSocket connection
2. If WebSocket fails (due to network, CORS, etc.), you see a warning
3. Socket.io automatically falls back to long-polling
4. Connection succeeds via polling
5. Once established, it upgrades back to WebSocket if possible

**Proof it's working:** You see `Socket connected: <socket-id>` right after the warnings.

## How to Verify Fixes

### 1. Check HTTP API Authentication
Open browser DevTools → Network tab:
- All requests to `/chat/*` should have `Authorization: Bearer <token>` header
- Should return 200 status (not 401)

### 2. Check Socket.io Connection
Open browser console:
```javascript
// Should see:
Socket connected: <some-id>
```

### 3. Test Full Flow
1. Login to the app
2. Navigate to `/dashboard/chat`
3. Check "Online" badge appears
4. Search for a user → Should show results
5. Send connection request → Should succeed
6. Open chat with connected user → Should load messages

## Backend Port Configuration

- Backend runs on: `http://localhost:5000`
- Frontend connects to: `http://localhost:5000` (via VITE_API_URL_DEV)
- Socket.io runs on same port: `http://localhost:5000`

## Auth Flow Summary

```
User Login
    ↓
JWT Token Generated (with user_id, email, session_id)
    ↓
Token stored in AuthContext (accessToken)
    ↓
setAuthToken(token) called in api.ts
    ↓
All HTTP requests: api.get() → Auto adds Bearer token
    ↓
Socket.io: Connects with auth: { token }
    ↓
Backend verifies JWT and extracts user_id
    ↓
User authenticated for both HTTP and WebSocket
```

## Files Modified Summary

### Frontend (5 files)
1. `hooks/useConnections.ts` - Use api instance
2. `hooks/useConversations.ts` - Use api instance
3. `hooks/useMessages.ts` - Use api instance
4. `pages/dashboard/chat/components/UserSearch.tsx` - Use api instance + advanced search link
5. `pages/dashboard/chat/components/ConnectionRequests.tsx` - Add accept/reject handlers

### Backend (2 files)
1. `sockets/chatSocket.js` - Fix JWT user_id extraction
2. `controllers/chat/search.controller.js` - Fix response format to { data: [...] }

## Testing Checklist

- [x] HTTP requests include auth headers
- [x] No more 401 errors on chat endpoints
- [x] Socket.io connects successfully
- [x] User can search for other users
- [x] User can send connection requests
- [x] Real-time messaging works
- [ ] Test with 2 different users
- [ ] Verify typing indicators work
- [ ] Verify read receipts work

## Known Behavior

### Socket Connection Warnings
**Normal:** Browser may show WebSocket connection failures during initial connection. This is expected behavior as Socket.io tries WebSocket first, then falls back to polling.

**How to verify it's working:**
- Check for "Socket connected: <id>" in console
- Check "Online" badge shows green
- Try sending a message

### Keep-Alive Messages
The message "Backend pinged successfully" is from the keep-alive system to prevent Render.com from sleeping. This is normal and expected.

## Additional Notes

- All chat routes require authentication via `protect` middleware
- Backend uses `/chat` prefix (no `/api`)
- Frontend uses relative URLs with the configured `api` instance
- Socket.io uses same authentication token as HTTP requests
