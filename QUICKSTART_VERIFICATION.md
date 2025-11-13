# Alumni Verification - Quick Start Guide

## For Developers

### 1. Backend Setup

The verification system is already integrated. No additional setup needed!

**Environment Variables:**
```bash
# Add to backend/.env
ALUMNI_VERIFY_SERVICE_URL=http://localhost:8000
```

**Start Backend:**
```bash
cd backend
npm install  # if not already done
npm start
```

### 2. Frontend Setup

**Start Frontend:**
```bash
cd frontend
npm install  # if not already done
npm run dev
```

### 3. Test the Flow

#### Test Scenario 1: Code Verification (Admin Required)
1. Generate verification codes:
   ```bash
   # Using curl or Postman
   POST http://localhost:5000/admin/generate-codes
   Headers: { Authorization: "Bearer <admin_token>" }
   Body: { "count": 10 }
   ```
2. Copy a generated code
3. Login as a user → redirected to verification
4. Select "Verification Code" → Enter code → Verify
5. Should redirect to dashboard with full access

#### Test Scenario 2: Database Check
1. Login as a user → redirected to verification
2. Select "Database Check"
3. Fill in details (name, batch, branch)
4. Click "Check Database"
5. If matches found → select one → confirm
6. If no matches → auto-submitted to admin queue

#### Test Scenario 3: Manual Review
1. Login as a user → redirected to verification
2. Select "Manual Review"
3. Fill in details
4. Click "Submit for Review"
5. Check admin panel for pending request

### 4. Admin Testing

**Access Admin Panel:**
```
http://localhost:5173/admin-panel/login
```

**View Verification Queue:**
```
http://localhost:5173/admin-panel/verification
```

**Admin Actions:**
- View pending requests
- Approve verification → User gets verified
- Deny verification → Request removed from queue

---

## For Admins

### Generating Verification Codes

**Option 1: Via API (Recommended for bulk)**
```bash
curl -X POST http://localhost:5000/admin/generate-codes \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"count": 100}'
```

**Option 2: Via Admin Dashboard**
1. Login to admin panel
2. Navigate to admin dashboard
3. Click "Generate Codes"
4. Specify quantity
5. Export codes for distribution

### Distributing Codes

1. Generate codes via API or dashboard
2. Export as CSV or JSON
3. Send to alumni via email campaign
4. Include instructions from VERIFICATION_GUIDE.md

**Email Template:**
```
Subject: Verify Your NSUT Alumni Status

Dear [Name],

Welcome to NALUM! To activate your dashboard and connect with fellow alumni, please verify your alumni status.

Your Verification Code: [CODE]

Steps:
1. Log in to https://nalum.nsut.ac.in
2. Click "Verify Alumni Status"
3. Select "Verification Code"
4. Enter your code: [CODE]

This code is for single use only and expires in 30 days.

Need help? Contact admin@nsut.ac.in

Best regards,
NALUM Team
```

### Processing Manual Verification Requests

1. **Access Queue:**
   - Login to admin panel
   - Navigate to "Verification Queue"
   - View list of pending requests

2. **Review Request:**
   - Check user details (name, batch, branch, roll number)
   - Verify against college records
   - Check email domain if available

3. **Make Decision:**
   - **Approve:** Click "Approve" → User gets instant access
   - **Deny:** Click "Deny" → Request removed, user can resubmit

4. **Best Practices:**
   - Review within 2-3 business days
   - Document reason for denial (future feature)
   - Batch process similar requests together

---

## For Users

### Quick Steps

1. **Login** to your NALUM account
2. You'll be redirected to **Verify Alumni Status** page
3. **Choose a method:**
   - Have a code? Use Method 1 (instant)
   - In database? Use Method 2 (2 minutes)
   - Need help? Use Method 3 (2-3 days)
4. Complete verification
5. **Enjoy full dashboard access!**

### Troubleshooting

**Can't verify?**
- Try database check first
- If no match, manual review is automatic
- Contact admin@nsut.ac.in for urgent help

**Code not working?**
- Check for typos (case-sensitive)
- Ensure code is unused
- Request new code if expired

---

## API Reference (Quick)

### User Endpoints

```bash
# Check verification status
GET /alumni/status
Headers: Authorization: Bearer <token>

# Verify with code
POST /alumni/verify-code
Headers: Authorization: Bearer <token>
Body: { "code": "ABC1234567" }

# Check database / submit manual
POST /alumni/check-manual
Headers: Authorization: Bearer <token>
Body: {
  "name": "John Doe",
  "roll_no": "2020UIT1234",
  "batch": "2020",
  "branch": "CSE"
}

# Confirm database match
POST /alumni/confirm-match
Headers: Authorization: Bearer <token>
Body: { "roll_no": "2020UIT1234" }
```

### Admin Endpoints

```bash
# Generate codes
POST /admin/generate-codes
Headers: Authorization: Bearer <admin_token>
Body: { "count": 100 }

# View queue
GET /admin/queue
Headers: Authorization: Bearer <admin_token>

# Approve request
POST /admin/queue/:userId/approve
Headers: Authorization: Bearer <admin_token>

# Deny request
POST /admin/queue/:userId/deny
Headers: Authorization: Bearer <admin_token>
```

---

## Testing Checklist

### Before Deployment

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Environment variables configured
- [ ] Admin account created
- [ ] Database connected

### Test Cases

- [ ] Unverified user redirected to verification page
- [ ] Valid code verifies user instantly
- [ ] Invalid code shows error
- [ ] Database check with match works
- [ ] Database check without match queues request
- [ ] Manual submission works
- [ ] Admin can approve/deny requests
- [ ] Verified user can access dashboard
- [ ] Verified user can access all features

---

## Common Issues

### Issue: Verification page keeps loading
**Solution:** Check `/alumni/status` endpoint is working

### Issue: Code verification fails with valid code
**Solution:** Check if code is already used in database

### Issue: Database check always fails
**Solution:** Verify microservice is running on port 8000

### Issue: Manual requests not appearing in admin queue
**Solution:** Check backend logs for errors

### Issue: User stuck on verification page after verifying
**Solution:** Clear browser cache, refresh page

---

## Production Deployment

### Pre-deployment Checklist

- [ ] Environment variables set in production
- [ ] CORS configured for production domain
- [ ] Database indexes created for verification tables
- [ ] Admin accounts secured with strong passwords
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Email service configured (for notifications)
- [ ] Backup strategy for verification codes
- [ ] SSL certificates installed
- [ ] CDN configured for static assets

### Post-deployment Tasks

- [ ] Generate initial batch of codes (500-1000)
- [ ] Send welcome emails with codes to alumni list
- [ ] Monitor verification queue
- [ ] Set up alerts for queue length > 50
- [ ] Review verification success rates
- [ ] Gather user feedback

---

## Support

**For Technical Issues:**
- Email: dev@nsut.ac.in
- Slack: #nalum-support

**For User Support:**
- Email: admin@nsut.ac.in
- Response time: 24-48 hours

**Documentation:**
- Technical: `ALUMNI_VERIFICATION.md`
- User Guide: `VERIFICATION_GUIDE.md`
- Summary: `VERIFICATION_SUMMARY.md`

---

## Next Steps

1. **Test thoroughly** in development
2. **Generate test codes** for QA
3. **Invite beta users** for feedback
4. **Monitor metrics** (completion rate, time, errors)
5. **Iterate based on feedback**
6. **Deploy to production** when stable
7. **Send announcement email** to alumni
8. **Provide ongoing support**

---

**Status: Ready for Testing** ✅

All three verification methods are implemented and functional. Start with test scenario 1 (code verification) as it's the simplest to test.
