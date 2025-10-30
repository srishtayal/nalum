# Debug Guide for Blank Admin Panel Page

## Issue
The page at `http://localhost:8080/admin-panel/verifications` appears blank.

## Changes Made

### 1. Fixed Route Naming
- Added both `/verification` (singular) and `/verifications` (plural) routes in App.tsx
- The page should now work with either URL

### 2. Added Comprehensive Console Logging

#### Frontend Logging
All logs are prefixed with component names for easy tracking:

**AdminAuthContext**:
- Auth check on mount
- Token presence
- Login/logout flow
- getCurrentAdmin API calls

**AdminProtectedRoute**:
- Authentication state
- Loading state
- Redirect logic

**AdminLayout**:
- Component rendering

**VerificationQueue Page**:
- Component mount
- API call initiation
- Response data
- Queue length
- Loading states

**adminApi.ts**:
- All HTTP requests (method + URL)
- All HTTP responses (status)
- Token presence
- Error details

#### Backend Logging
All logs are prefixed with controller/middleware names:

**AdminAuth Middleware** (`/backend/middleware/adminAuth.js`):
- Request URL and method
- Token detection
- Token validation
- User lookup
- Role verification
- Authentication success/failure

**Verification Controller** (`/backend/controllers/admin/verification.controller.js`):
- API endpoint hit
- Query parameters
- Admin user email
- Database query results
- Queue item count
- Full queue data (JSON)

## How to Debug

### Step 1: Open Browser Console
1. Open `http://localhost:8080/admin-panel/verifications` (or `/verification`)
2. Open browser DevTools (F12)
3. Go to Console tab

### Step 2: Check Frontend Logs
Look for these log sequences:

**Expected Flow:**
```
[AdminAuthContext] Checking auth on mount...
[AdminAuthContext] Token from storage: exists/none
[AdminProtectedRoute] Auth state: {isAuthenticated: true/false, isLoading: false}
[AdminLayout] Rendering with children: true
[VerificationQueue] Component mounted
[VerificationQueue] Starting to fetch queue...
[adminApi] Request: GET /admin/verification/queue?page=1&limit=50
[adminApi] Response: GET /admin/verification/queue Status: 200
[VerificationQueue] API Response: {success: true, data: [...]}
[VerificationQueue] Queue data: [...]
[VerificationQueue] Queue length: X
[VerificationQueue] Loading complete
[VerificationQueue] Rendering with queue: [...]
```

**If Not Authenticated:**
```
[AdminAuthContext] No token, setting loading to false
[AdminProtectedRoute] Not authenticated, redirecting to login
```

### Step 3: Check Backend Logs
In your backend terminal, look for:

```
[AdminAuth] protectAdmin middleware called
[AdminAuth] Request URL: /admin/verification/queue
[AdminAuth] Token found in Authorization header
[AdminAuth] Validating token...
[AdminAuth] Token validation result: Success
[AdminAuth] User found: admin@example.com Role: admin
[AdminAuth] Admin authentication successful
[VerificationController] getVerificationQueue called
[VerificationController] Found queue items: X
```

### Step 4: Check Network Tab
1. Open DevTools > Network tab
2. Filter by "XHR" or "Fetch"
3. Look for request to `/admin/verification/queue`
4. Check:
   - Status code (should be 200)
   - Request headers (Authorization: Bearer xxx)
   - Response data

## Common Issues & Solutions

### Issue 1: Redirecting to Login
**Symptom**: Page immediately redirects to `/admin-panel/login`
**Console Log**: `[AdminProtectedRoute] Not authenticated, redirecting to login`
**Solution**: 
1. Login at `/admin-panel/login`
2. Use credentials: `superadmin@nalum.com` / `Admin@123`

### Issue 2: 401 Unauthorized
**Symptom**: Console shows "401" error
**Backend Log**: `[AdminAuth] Token validation error` or `[AdminAuth] No token found`
**Solution**:
1. Check if token exists: Open DevTools > Application > Local Storage > Look for `admin_token`
2. If missing, login again
3. If present but invalid, clear local storage and login again

### Issue 3: 403 Forbidden
**Symptom**: Request succeeds but returns 403
**Backend Log**: `[AdminAuth] User is not an admin`
**Solution**: 
1. Ensure your user has `role: "admin"` in database
2. Run `node seedAdmins.js` to create admin users

### Issue 4: Empty Queue
**Symptom**: Page loads but shows "No pending verifications"
**Console Log**: `[VerificationQueue] Queue length: 0`
**Solution**: This is expected if no users have submitted verification requests

### Issue 5: Network Error
**Symptom**: Console shows network error or CORS error
**Solution**:
1. Ensure backend is running: `cd backend && npm run dev`
2. Check backend is on `http://localhost:5000`
3. Check frontend API URL in `.env`: `VITE_API_URL=http://localhost:5000`

## Test Checklist

Run through these steps:

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 8080
- [ ] Admin user seeded (`node seedAdmins.js`)
- [ ] Login at `/admin-panel/login` with `superadmin@nalum.com` / `Admin@123`
- [ ] Navigate to `/admin-panel/verifications` or `/admin-panel/verification`
- [ ] Check browser console for logs
- [ ] Check backend terminal for logs
- [ ] Check Network tab for API requests

## Quick Test Commands

### Check if backend is running:
```powershell
curl http://localhost:5000/admin/auth/login -Method POST -ContentType "application/json" -Body '{"email":"superadmin@nalum.com","password":"Admin@123"}'
```

### Check if verification endpoint works:
```powershell
# First login to get token
$response = curl http://localhost:5000/admin/auth/login -Method POST -ContentType "application/json" -Body '{"email":"superadmin@nalum.com","password":"Admin@123"}' | ConvertFrom-Json
$token = $response.data.access_token

# Then call verification endpoint
curl http://localhost:5000/admin/verification/queue -Headers @{"Authorization"="Bearer $token"}
```

## Share Debug Info

If the issue persists, share:
1. All console logs from browser
2. All terminal logs from backend
3. Network tab screenshot showing the failed request
4. Current URL you're accessing

The extensive logging will help pinpoint exactly where the issue is occurring!
