# 🔄 Admin Auth Migration Guide

## ✅ **Migration Complete!**

Your admin authentication system has been successfully migrated to use the **same robust session-based authentication** as your regular users.

---

## 🎯 **What Changed**

### **Before (In-Memory)**
- ❌ In-memory Map storage
- ❌ Sessions lost on restart
- ❌ Hardcoded admin array
- ❌ Username-based login
- ❌ No refresh tokens
- ❌ 2-hour session only

### **After (Database-backed)**
- ✅ MongoDB session storage
- ✅ Persistent sessions
- ✅ Admin users in database
- ✅ Email-based login
- ✅ Refresh token flow
- ✅ 30min access + 1yr refresh

---

## 🔐 **New Admin System Architecture**

```
Admin Login (email/password) → 
Check User model (role="admin") → 
Create Session (MongoDB) → 
Generate JWT + Refresh Token → 
httpOnly Cookie (refresh_token) →
Return Access Token (30 min)
```

### **Files Modified:**

1. **`models/user/user.model.js`**
   - Added "admin" to role enum

2. **`middleware/adminAuth.js`**
   - Now uses `sessions.validateAccessToken()`
   - Checks `User.role === "admin"`
   - Uses email instead of username

3. **`controllers/admin/adminAuth.controller.js`**
   - Uses `sessions.getOrCreate()` like user auth
   - Email-based login
   - Sets refresh_token cookie
   - Returns access_token

4. **`config/admin.config.js`**
   - Removed hardcoded credentials
   - Now just utility functions

5. **All Admin Controllers**
   - Updated to use `req.admin.email` instead of `req.admin.username`

---

## 🚀 **Setup Instructions**

### **Step 1: Seed Admin Users**

Run the seeder script to create admin users in MongoDB:

```bash
cd backend
node seedAdmins.js
```

This will create 4 admin users:
- superadmin@nalum.com
- admin1@nalum.com
- moderator1@nalum.com
- moderator2@nalum.com

**Default password for all:** `Admin@123`

### **Step 2: Test Admin Login**

```bash
node test-admin-api.js
```

This will verify:
- ✅ Admin login works
- ✅ Token validation
- ✅ Dashboard stats
- ✅ Protected routes

---

## 📡 **API Changes**

### **Old Login Request:**
```json
POST /admin/auth/login
{
  "username": "superadmin",
  "password": "Admin@123"
}
```

### **New Login Request:**
```json
POST /admin/auth/login
{
  "email": "superadmin@nalum.com",
  "password": "Admin@123"
}
```

### **New Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "67234abc...",
      "email": "superadmin@nalum.com",
      "name": "Super Admin",
      "role": "admin"
    }
  }
}
```

**Note:** `refresh_token` is now in httpOnly cookie (more secure!)

---

## 🔒 **Benefits of New System**

### **1. Persistent Sessions**
✅ Sessions survive server restarts (stored in MongoDB)

### **2. Refresh Token Flow**
✅ Access token expires in 30 minutes
✅ Refresh token lasts 1 year
✅ Auto-renewal without re-login

### **3. Database-backed**
✅ Easy to revoke sessions
✅ Can add/remove admins dynamically
✅ Track admin login history

### **4. Unified Authentication**
✅ Same JWT secret
✅ Same session system
✅ Same middleware pattern
✅ Less code duplication

### **5. More Secure**
✅ httpOnly cookies (XSS protection)
✅ Refresh token rotation
✅ Session expiry tracking

---

## 👤 **Managing Admin Users**

### **Create New Admin:**
```javascript
const User = require('./models/user/user.model');
const bcrypt = require('bcrypt');

const hashedPassword = await bcrypt.hash('NewPassword@123', 10);

await User.create({
  name: "New Admin",
  email: "newadmin@nalum.com",
  password: hashedPassword,
  role: "admin",
  email_verified: true,
  profileCompleted: true,
});
```

### **Remove Admin:**
```javascript
// Change role back to student/alumni
await User.findByIdAndUpdate(adminId, { role: "alumni" });

// Or delete completely
await User.findByIdAndDelete(adminId);
```

### **List All Admins:**
```javascript
const admins = await User.find({ role: "admin" });
console.log(admins);
```

---

## 🔄 **Token Flow**

### **Initial Login:**
1. Admin logs in with email/password
2. Server creates session in MongoDB
3. Returns access_token (JWT, 30 min)
4. Sets refresh_token in httpOnly cookie (1 year)

### **API Requests:**
```bash
GET /admin/statistics/dashboard
Authorization: Bearer ACCESS_TOKEN_HERE
```

### **Token Refresh (when access_token expires):**
```bash
POST /auth/refresh
Cookie: refresh_token=UUID_HERE

# Returns new access_token
```

---

## 🧪 **Testing**

### **Test Login:**
```bash
curl -X POST http://localhost:5000/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@nalum.com",
    "password": "Admin@123"
  }'
```

### **Test Protected Route:**
```bash
curl -X GET http://localhost:5000/admin/statistics/dashboard \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### **Test Refresh:**
```bash
curl -X POST http://localhost:5000/auth/refresh \
  -H "Cookie: refresh_token=YOUR_REFRESH_TOKEN"
```

---

## 📊 **Comparison Table**

| Feature | Old System | New System |
|---------|-----------|------------|
| Storage | In-memory Map | MongoDB |
| Persistence | ❌ Lost on restart | ✅ Persistent |
| Login Method | Username | Email |
| Token Duration | 2 hours (single) | 30min + 1yr refresh |
| Refresh Flow | ❌ None | ✅ Yes |
| Session Revocation | ✅ Yes | ✅ Yes (better) |
| Multi-device | ✅ Yes | ✅ Yes |
| Admin Management | Code changes | Database CRUD |
| Speed | Very fast | Fast (cached) |
| Scalability | ❌ Single server | ✅ Multi-server |

---

## 🎯 **Frontend Changes Needed**

### **Update Login Component:**
```typescript
// OLD
const loginData = { username: "superadmin", password: "pass" };

// NEW
const loginData = { email: "superadmin@nalum.com", password: "pass" };
```

### **Store Token:**
```typescript
// Access token from response
const { access_token } = response.data.data;
localStorage.setItem('admin_token', access_token);

// Refresh token is in httpOnly cookie (automatic)
```

### **API Calls:**
```typescript
axios.get('/admin/statistics/dashboard', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('admin_token')}`
  }
});
```

### **Handle Token Expiry:**
```typescript
// When you get 401 error, refresh the token
try {
  const response = await axios.post('/auth/refresh');
  const newToken = response.data.data.access_token;
  localStorage.setItem('admin_token', newToken);
  // Retry the failed request
} catch (error) {
  // Refresh failed, redirect to login
  window.location.href = '/admin/login';
}
```

---

## ⚠️ **Important Notes**

1. **Run Seeder First!**
   - You must run `node seedAdmins.js` before testing
   - Otherwise, no admin users exist in database

2. **Update Frontend Login**
   - Change from username to email
   - Handle refresh_token cookie

3. **Session Management**
   - Sessions are now in MongoDB `sessions` collection
   - You can manually delete sessions to force logout

4. **Ban System Works!**
   - Admins can be banned (but shouldn't be!)
   - Ban middleware checks all users including admins

5. **Backward Compatibility**
   - All existing admin routes work the same
   - Only login payload changed

---

## 🔧 **Troubleshooting**

### **"Invalid credentials" Error**
- ✅ Run seeder: `node seedAdmins.js`
- ✅ Check email (not username)
- ✅ Check password is correct

### **"Session expired" Error**
- ✅ Access token expired (use refresh endpoint)
- ✅ Session deleted from MongoDB
- ✅ Re-login required

### **"Access denied" Error**
- ✅ User exists but role is not "admin"
- ✅ Update role in database

---

## 🎉 **Summary**

Your admin authentication is now:
- ✅ Using the same battle-tested session system
- ✅ Stored in MongoDB (persistent)
- ✅ Email-based login
- ✅ Refresh token support
- ✅ More secure (httpOnly cookies)
- ✅ Easier to manage (database CRUD)
- ✅ Scalable (works with load balancers)

**Next steps:**
1. Run `node seedAdmins.js`
2. Test with `node test-admin-api.js`
3. Update frontend to use email-based login
4. Deploy! 🚀
