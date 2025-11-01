# Admin Panel Documentation

## Overview
Complete admin panel for managing the alumni management system. Built with React/TypeScript frontend and Node.js/Express backend.

## Features
- **Dashboard**: Real-time statistics and quick actions
- **Verification Queue**: Approve/reject alumni verification requests
- **User Management**: Ban/unban users with duration and reason
- **Event Approvals**: Review and approve/reject event submissions
- **Newsletters**: Upload and manage newsletters (PDF)
- **Banned Users**: View and manage active bans

## Admin Credentials

### Super Admin
- Email: `superadmin@nalum.com`
- Password: `Admin@123`

### Admins
- Email: `admin1@nalum.com` | Password: `Admin@123`
- Email: `moderator1@nalum.com` | Password: `Admin@123`
- Email: `moderator2@nalum.com` | Password: `Admin@123`

## Setup

### Backend Setup
1. Seed admin users (if not already done):
```bash
cd backend
node seedAdmins.js
```

2. Start backend server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to frontend:
```bash
cd frontend
```

2. Start development server:
```bash
npm run dev
```

## Admin Routes

### Public Routes
- `/admin-panel/login` - Admin login page

### Protected Routes (requires authentication)
- `/admin-panel/dashboard` - Overview and statistics
- `/admin-panel/verification` - Alumni verification queue
- `/admin-panel/users` - User management and banning
- `/admin-panel/events` - Event approval management
- `/admin-panel/newsletters` - Newsletter uploads
- `/admin-panel/banned` - View and manage banned users

## API Endpoints

### Authentication
- `POST /admin/auth/login` - Admin login (email/password)
- `POST /admin/auth/logout` - Logout admin
- `GET /admin/auth/me` - Get current admin details

### Statistics
- `GET /admin/statistics/dashboard` - Dashboard stats
- `GET /admin/statistics/registrations` - Registration graph data
- `GET /admin/statistics/users` - All users with filters

### Verification
- `GET /admin/verification/queue` - Pending verifications
- `POST /admin/verification/approve/:userId` - Approve verification
- `POST /admin/verification/reject/:userId` - Reject verification
- `GET /admin/verification/stats` - Verification statistics

### User Management
- `POST /admin/users/ban/:userId` - Ban user
- `POST /admin/users/unban/:userId` - Unban user
- `GET /admin/users/banned` - Get banned users
- `GET /admin/users/history/:userId` - User ban history

### Events
- `GET /admin/events/all` - All events with filters
- `GET /admin/events/pending` - Pending events
- `GET /admin/events/:eventId` - Event details
- `POST /admin/events/approve/:eventId` - Approve event
- `POST /admin/events/reject/:eventId` - Reject event
- `DELETE /admin/events/:eventId` - Delete event

### Newsletters
- `POST /admin/newsletters/upload` - Upload newsletter (multipart/form-data)
- `GET /admin/newsletters/all` - All newsletters
- `DELETE /admin/newsletters/:newsletterId` - Delete newsletter

## Authentication Flow

1. Admin logs in with email/password
2. Backend validates credentials and creates session
3. Returns JWT access token (30 min expiry) + refresh token cookie (1 year)
4. Access token stored in localStorage
5. All admin API requests include Bearer token
6. Token auto-refreshed on 401 responses
7. Session stored in MongoDB for persistence

## Ban Durations
- 24 hours
- 7 days
- 30 days
- 365 days (1 year)
- Permanent

## File Upload Limits
- Newsletters: PDF only, max 10MB

## Middleware

### adminAuth.js
Protects admin routes by:
1. Verifying JWT access token
2. Checking session exists in database
3. Validating user has "admin" role

### checkBanned.js
Runs on all API routes to:
1. Check if user is banned
2. Auto-unban if ban expired
3. Return 403 if actively banned

## Database Models

### Admin-related Models
- `User` - role: "admin" for admin users
- `Session` - JWT sessions for authentication
- `Ban` - User ban records with expiry
- `Newsletter` - Newsletter metadata and stats
- `Event` - Event submissions with approval status
- `VerificationQueue` - Alumni verification requests
- `AdminActivity` - Audit log of admin actions

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router v6
- Axios for HTTP
- Tailwind CSS
- Lucide icons
- Vite build tool

### Backend
- Node.js with Express v5.1.0
- MongoDB with Mongoose v8.19.1
- JWT authentication (jsonwebtoken v9.0.2)
- bcrypt v6.0.0 for password hashing
- Multer v2.0.2 for file uploads
- UUID v11.0.5 for refresh tokens

## Security Features
- Password hashing with bcrypt
- JWT access + refresh token pattern
- httpOnly cookies for refresh tokens
- Session-based authentication
- Role-based access control
- Activity logging for audit trails
- File type and size validation
- Ban system to block malicious users

## Development Notes

### Adding New Admin Features
1. Create model in `backend/models/admin/`
2. Create controller in `backend/controllers/admin/`
3. Add routes in `backend/routes/admin/`
4. Add API functions in `frontend/src/lib/adminApi.ts`
5. Create page in `frontend/src/pages/admin/`
6. Add route in `frontend/src/App.tsx`

### Testing Admin Features
1. Seed admins: `node backend/seedAdmins.js`
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Login at `http://localhost:5173/admin-panel/login`
5. Use credentials from above

## Production Deployment

### Environment Variables
Backend (.env):
```
MONGODB_URI=<mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
REFRESH_TOKEN_SECRET=<your-refresh-secret>
PORT=5000
```

Frontend (.env):
```
VITE_API_URL=https://your-api-domain.com
```

### Security Checklist
- [ ] Change default admin passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Set proper CORS origins
- [ ] Rate limit authentication endpoints
- [ ] Enable MongoDB authentication
- [ ] Implement session expiry
- [ ] Add request logging
- [ ] Enable file upload scanning
- [ ] Set up monitoring/alerts

## Troubleshooting

### "Invalid credentials" on login
- Verify admins were seeded: `node seedAdmins.js`
- Check MongoDB connection
- Verify password is exactly `Admin@123`

### "Unauthorized" errors
- Check if access token is in localStorage
- Verify token hasn't expired
- Check refresh token cookie is present
- Ensure admin user has role="admin"

### File upload fails
- Check file size < 10MB
- Verify file is PDF format
- Ensure multer is configured
- Check upload directory permissions

### Ban not working
- Verify checkBanned middleware is enabled
- Check ban expiry calculation
- Ensure ban is marked as active
- Check user ID matches

## Future Enhancements
- Email notifications for bans/approvals
- Bulk actions for users/events
- Advanced analytics dashboard
- Export data to CSV/Excel
- Multi-factor authentication
- IP-based blocking
- Scheduled newsletters
- Event calendar view
- User activity timeline
- Search and advanced filters

## Support
For issues or questions, contact the development team.
