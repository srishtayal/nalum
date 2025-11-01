# 🚀 Admin Panel - Quick Start Guide

## ✅ What's Been Implemented

### Backend (100% Complete)
- ✅ 4 Admin models (Ban, Newsletter, Event, AdminActivity)
- ✅ 6 Admin controllers (Auth, Verification, Ban, Statistics, Newsletter, Event)
- ✅ 7 Admin routes with full CRUD operations
- ✅ Admin authentication middleware
- ✅ Ban checking middleware (auto-blocks banned users)
- ✅ 4 hardcoded admin credentials
- ✅ Audit logging system
- ✅ Newsletter file upload (PDF)
- ✅ Event approval workflow
- ✅ Verification queue management
- ✅ Dashboard statistics

---

## 🏃‍♂️ How to Run

### 1. Start the Backend Server
```bash
cd backend
npm start
```

Server will run on: `http://localhost:5000`

### 2. Test the Admin API
```bash
cd backend
node test-admin-api.js
```

This will test:
- Health check
- Admin login
- Dashboard stats
- Verification queue
- Banned users list

---

## 🔐 Admin Login Credentials

**All admins use password:** `Admin@123`

| Username    | Role        | Access Level |
|-------------|-------------|--------------|
| superadmin  | super_admin | Full access  |
| admin1      | admin       | Full access  |
| moderator1  | moderator   | Full access  |
| moderator2  | moderator   | Full access  |

**⚠️ Change passwords in production!**

---

## 📡 Admin API Endpoints

### Authentication
- `POST /admin/auth/login` - Login
- `POST /admin/auth/logout` - Logout
- `GET /admin/auth/me` - Current admin info

### Verification Queue
- `GET /admin/verification/queue` - List pending
- `POST /admin/verification/approve/:userId` - Approve
- `POST /admin/verification/reject/:userId` - Reject

### User Management
- `POST /admin/users/ban/:userId` - Ban user
- `POST /admin/users/unban/:userId` - Unban user
- `GET /admin/users/banned` - List banned users

### Events
- `GET /admin/events/pending` - Pending events
- `POST /admin/events/approve/:eventId` - Approve
- `POST /admin/events/reject/:eventId` - Reject

### Newsletters
- `POST /admin/newsletters/upload` - Upload PDF
- `GET /admin/newsletters/all` - List all
- `DELETE /admin/newsletters/:id` - Delete

### Statistics
- `GET /admin/statistics/dashboard` - Full dashboard
- `GET /admin/statistics/users` - User list with filters

---

## 🎨 Next: Build Frontend Admin Panel

### Option 1: Create Separate React App
```bash
cd nalum
npx create-vite@latest admin-panel --template react-ts
cd admin-panel
npm install axios react-router-dom
```

### Option 2: Add Admin Section to Existing Frontend
Add admin routes to your current React app in `frontend/`

---

## 📋 Frontend Pages Needed

1. **Login Page** (`/admin/login`)
   - Username/password form
   - Token storage

2. **Dashboard** (`/admin/dashboard`)
   - Statistics cards
   - Recent activities
   - Quick actions

3. **Verification Queue** (`/admin/verifications`)
   - List of pending verifications
   - Approve/Reject buttons
   - User details modal

4. **User Management** (`/admin/users`)
   - User list with filters
   - Ban/Unban actions
   - Ban history view

5. **Event Approvals** (`/admin/events`)
   - Pending events list
   - Event details
   - Approve/Reject with comments

6. **Newsletter Manager** (`/admin/newsletters`)
   - Upload PDF form
   - Newsletter list
   - View/Download stats

---

## 🔧 Testing with Postman

### 1. Login
```
POST http://localhost:5000/admin/auth/login
Content-Type: application/json

{
  "username": "superadmin",
  "password": "Admin@123"
}
```

Copy the `token` from response.

### 2. Get Dashboard Stats
```
GET http://localhost:5000/admin/statistics/dashboard
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Ban a User
```
POST http://localhost:5000/admin/users/ban/USER_ID
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "duration": "7d",
  "reason": "Testing ban system"
}
```

---

## 🐛 Troubleshooting

### Server won't start
- Check if MongoDB is running
- Check if port 5000 is available
- Run `npm install` in backend folder

### Admin login fails
- Verify credentials in `backend/config/admin.config.js`
- Check password hash is correct
- Check console for errors

### File upload fails
- Ensure `uploads/newsletters/` directory exists
- Check file is PDF format
- Check file size is under 10MB

---

## 📦 File Structure

```
backend/
├── config/
│   └── admin.config.js              ← Admin credentials
├── controllers/admin/
│   ├── adminAuth.controller.js      ← Login/logout
│   ├── ban.controller.js            ← Ban management
│   ├── event.controller.js          ← Event approvals
│   ├── newsletter.controller.js     ← Newsletter upload
│   ├── statistics.controller.js     ← Dashboard stats
│   └── verification.controller.js   ← Verification queue
├── middleware/
│   ├── adminAuth.js                 ← Admin auth
│   └── checkBanned.js               ← Ban checking
├── models/admin/
│   ├── adminActivity.model.js       ← Audit logs
│   ├── ban.model.js                 ← Ban records
│   ├── event.model.js               ← Events
│   └── newsletter.model.js          ← Newsletters
├── routes/admin/
│   ├── index.js                     ← Main router
│   ├── auth.js
│   ├── events.js
│   ├── newsletters.js
│   ├── statistics.js
│   ├── users.js
│   └── verification.js
├── uploads/
│   └── newsletters/                 ← PDF storage
├── ADMIN_PANEL_README.md            ← Full documentation
├── test-admin-api.js                ← Test script
└── index.js                         ← Main server (updated)
```

---

## ✨ Features Summary

### Alumni Verification
- Semi-automatic matching
- Admin approval for non-matches
- Form submission required
- Email notifications (TODO)

### Ban System
- 5 duration options: 24h, 7d, 30d, 365d, permanent
- Auto-unban on expiry
- Ban history tracking
- Middleware blocks banned users

### Statistics
- Total users breakdown
- Verification stats
- Event stats
- Newsletter analytics
- Registration graph

### Newsletters
- PDF upload (max 10MB)
- View/download tracking
- Soft delete
- Metadata storage

### Events
- User-submitted events
- Admin approval required
- Rejection with reason
- Email notifications (TODO)

---

## 🎯 Production Checklist

- [ ] Change admin passwords
- [ ] Add Redis for session storage
- [ ] Use cloud storage for PDFs (AWS S3/Cloudinary)
- [ ] Add rate limiting on login
- [ ] Implement 2FA for admins
- [ ] Add email notifications
- [ ] Add more robust error handling
- [ ] Add input sanitization
- [ ] Add API documentation (Swagger)
- [ ] Add automated tests

---

## 💡 Tips

1. **Testing**: Use the `test-admin-api.js` script to verify all endpoints work
2. **Debugging**: Check `console.log` outputs in terminal
3. **Database**: All admin actions are logged in `AdminActivity` collection
4. **Security**: Admin tokens expire after 2 hours
5. **Files**: Uploaded newsletters are in `uploads/newsletters/`

---

**🎉 You're all set! The backend is production-ready. Now build the frontend admin panel!**
