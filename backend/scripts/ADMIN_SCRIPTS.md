# Admin Management Scripts

This directory contains scripts for managing admin users in the NSUT Alumni Portal.

## Available Scripts

### 1. `createAdmin.js` - Quick Admin Creation

Creates a single admin user with pre-configured credentials.

**Usage:**
```bash
node scripts/createAdmin.js
```

**Default Credentials:**
- Email: `admin@nsut.ac.in`
- Password: `Admin@123`
- Name: Admin User

**To customize:** Edit the `adminData` object in the script before running.

**Important:** 
- Change the password after first login
- Delete or update the script after creating admin to avoid security risks

---

### 2. `manageAdmins.js` - Interactive Admin Management

Interactive menu-driven script for comprehensive admin management.

**Usage:**
```bash
node scripts/manageAdmins.js
```

**Features:**
1. **List all admins** - View all admin users with details
2. **Create new admin** - Interactive prompts for creating admin
3. **Delete admin** - Remove admin user from database
4. **Change admin password** - Update existing admin password
5. **Exit** - Close the script

**Example Session:**
```
🔧 Admin Management Menu
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. List all admins
2. Create new admin
3. Delete admin
4. Change admin password
5. Exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enter your choice (1-5): 2

📝 Create New Admin User

Enter admin name: John Doe
Enter admin email: john@nsut.ac.in
Enter admin password (min 8 characters): SecurePass123

⏳ Creating admin user...

✅ Admin user created successfully!
```

---

## How Admin Authentication Works

### Unified Login System

Admins are **not separate entities** - they are regular users with `role: 'admin'` in the database.

**Key Points:**
- ✅ Admins use the **same login page** as regular users (`/login`)
- ✅ After login, admins are **automatically redirected** to `/admin-panel/dashboard`
- ✅ Regular users cannot access `/admin-panel/*` routes
- ✅ **No separate admin login page** exists

### Login Flow

1. **Admin logs in at `/login`**
   ```
   POST /auth/sign-in
   { email: "admin@nsut.ac.in", password: "Admin@123" }
   ```

2. **Backend verifies credentials**
   - Checks user exists
   - Validates password
   - Returns user object with `role: 'admin'`

3. **Frontend checks role**
   ```javascript
   if (user.role === 'admin') {
     navigate('/admin-panel/dashboard');
   }
   ```

4. **Admin panel access protected**
   - `AdminProtectedRoute` checks `user.role === 'admin'`
   - Non-admins redirected to regular dashboard
   - Unauthenticated users redirected to login

---

## User Model Structure

Admin users have the following fields in MongoDB:

```javascript
{
  name: String,              // Display name
  email: String,             // Login email (unique)
  password: String,          // Bcrypt hashed
  role: 'admin',             // Must be 'admin' for admin access
  email_verified: true,      // Auto-verified for admins
  profileCompleted: true,    // Skip profile form
  verified_alumni: false,    // Admins don't need alumni verification
  banned: false,             // Can be banned if needed
  createdAt: Date,
  updatedAt: Date
}
```

---

## Creating Your First Admin

### Option 1: Quick Start (Recommended for testing)

```bash
# Edit the credentials in the script first
node scripts/createAdmin.js
```

**Default admin will be created:**
- Email: `admin@nsut.ac.in`
- Password: `Admin@123`

### Option 2: Interactive Creation (Recommended for production)

```bash
node scripts/manageAdmins.js
# Choose option 2 (Create new admin)
# Follow the prompts
```

---

## Security Best Practices

### 🔐 Password Requirements
- Minimum 8 characters
- Use strong passwords with mixed case, numbers, and symbols
- Change default passwords immediately after first login

### 🛡️ Admin Account Safety
1. **Never commit** admin credentials to git
2. **Change passwords** regularly
3. **Delete** unused admin accounts
4. **Audit** admin activities using the `adminActivity` collection
5. **Use different passwords** for each admin

### 📝 Script Security
- **Delete or update** `createAdmin.js` after use in production
- **Don't share** admin credentials via insecure channels
- **Review** admin activity logs regularly

---

## Troubleshooting

### "MongoDB connection error"
**Solution:** Check your `.env` file has `MONGODB_URI_DEV` or `MONGODB_URI_PROD` set

### "Admin user already exists"
**Solution:** 
- Use `manageAdmins.js` to list existing admins
- Delete or use a different email
- Or update the existing user's password

### "401 Unauthorized" when logging in
**Possible causes:**
1. **Incorrect credentials** - Verify email/password
2. **User not found** - Run admin creation script
3. **Role not set** - Check user's `role` field is `'admin'`
4. **Session expired** - Clear cookies and login again

**To debug:**
```bash
# Check if admin exists
node scripts/manageAdmins.js
# Choose option 1 (List all admins)
```

### Admin can't access admin panel
**Check:**
1. User's `role` field is exactly `'admin'` (lowercase)
2. User is logging in via `/login` (not `/admin-panel/login`)
3. Frontend `AuthContext` is receiving user data
4. Browser console for errors

---

## Database Queries

### Check admin users manually (MongoDB shell)

```javascript
// Connect to MongoDB
mongosh mongodb://127.0.0.1:27017/nalum

// List all admins
db.users.find({ role: 'admin' })

// Update user to admin
db.users.updateOne(
  { email: 'user@example.com' },
  { $set: { role: 'admin', email_verified: true, profileCompleted: true } }
)

// Remove admin role
db.users.updateOne(
  { email: 'admin@example.com' },
  { $set: { role: 'student' } }
)
```

---

## Admin Activity Logging

Admin actions are logged in the `adminActivities` collection:

```javascript
{
  admin_username: 'admin@nsut.ac.in',
  action: 'ban_user',
  target_type: 'user',
  target_id: ObjectId('...'),
  details: { reason: 'Spam' },
  ip_address: '127.0.0.1',
  createdAt: Date
}
```

**Logged actions:**
- Login/Logout
- User bans/unbans
- Verification approvals/rejections
- Event approvals/rejections
- Newsletter uploads/deletes
- Code generation

---

## Files Structure

```
backend/
├── scripts/
│   ├── createAdmin.js           # Quick admin creation
│   ├── manageAdmins.js          # Interactive admin management
│   └── ADMIN_SCRIPTS.md         # This file
├── models/
│   ├── user/
│   │   └── user.model.js        # User model (includes admins)
│   └── admin/
│       └── adminActivity.model.js  # Admin action logging
├── routes/
│   └── admin/
│       ├── index.js             # Admin API routes
│       ├── users.js             # User management
│       ├── verification.js      # Verification queue
│       ├── events.js            # Event approvals
│       └── newsletters.js       # Newsletter management
└── middleware/
    └── adminAuth.js             # Admin authentication middleware
```

---

## Migration from Old System

If you're migrating from a separate admin authentication system:

### What Changed
- ❌ Removed: `AdminAuthContext` (separate admin auth)
- ❌ Removed: `/admin-panel/login` route
- ❌ Removed: Separate admin login controller
- ✅ Added: Unified login via `/auth/sign-in`
- ✅ Added: Role-based access control
- ✅ Added: Automatic admin redirect

### Migration Steps
1. **Backend:** Already done - admins use User model
2. **Frontend:** Already done - unified AuthContext
3. **Database:** No changes needed - role field exists
4. **Admin Users:** Create using these scripts

---

## Support

For issues or questions:
1. Check this README
2. Review `ADMIN_SIMPLIFIED.md` in the project root
3. Check console logs for errors
4. Verify database connection and user data

---

**Last Updated:** November 2025
**Version:** 2.0 (Unified Admin System)
