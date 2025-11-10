# Alumni Verification System

This document explains the three-method alumni verification system implemented in NALUM.

## Overview

All dashboard features are locked until the user verifies their alumni status. Users can verify through three different methods:

1. **Verification Code** - Instant verification using a 10-digit code
2. **Database Check** - Automated verification against college alumni database
3. **Manual Review** - Admin verification for edge cases

## System Architecture

### Frontend Components

#### VerifyAlumni Page (`/dashboard/verify-alumni`)
- Main verification interface with three method options
- Handles all three verification workflows
- Shows verification status and success states
- Redirects to dashboard upon successful verification

#### ProtectedVerificationRoute Component
- Middleware component that checks verification status
- Redirects unverified users to `/dashboard/verify-alumni`
- Wraps all dashboard routes requiring verification
- Shows loading state during verification check

### Backend Endpoints

All endpoints require authentication (`protect` middleware).

#### `GET /alumni/status`
**Purpose:** Check current user's verification status
**Response:**
```json
{
  "success": true,
  "verified_alumni": false
}
```

#### `POST /alumni/verify-code`
**Purpose:** Verify using 10-digit code
**Request Body:**
```json
{
  "code": "ABC1234567"
}
```
**Success Response:**
```json
{
  "success": true,
  "message": "Alumni status verified successfully"
}
```

#### `POST /alumni/check-manual`
**Purpose:** Check database for matches OR submit for manual review
**Request Body:**
```json
{
  "name": "John Doe",
  "roll_no": "2020UIT1234",
  "batch": "2020",
  "branch": "CSE"
}
```
**Response with matches:**
```json
{
  "success": true,
  "matches": [
    {
      "name": "John Doe",
      "roll_no": "2020UIT1234",
      "batch": "2020",
      "branch": "CSE",
      "similarity": 0.95
    }
  ]
}
```
**Response with no matches:**
- Automatically adds request to admin verification queue
- Returns empty matches array

#### `POST /alumni/confirm-match`
**Purpose:** Confirm selected database match
**Request Body:**
```json
{
  "roll_no": "2020UIT1234"
}
```
**Success Response:**
```json
{
  "success": true,
  "message": "User successfully verified."
}
```

### Admin Endpoints

#### `GET /admin/queue`
**Purpose:** Get all pending manual verification requests
**Protected:** Admin only
**Response:**
```json
{
  "success": true,
  "queue": [
    {
      "_id": "...",
      "user": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "details_provided": {
        "name": "John Doe",
        "roll_no": "2020UIT1234",
        "batch": "2020",
        "branch": "CSE"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### `POST /admin/queue/:userId/approve`
**Purpose:** Approve verification request
**Protected:** Admin only
**Success Response:**
```json
{
  "success": true,
  "message": "User verification approved successfully"
}
```

#### `POST /admin/queue/:userId/deny`
**Purpose:** Deny verification request
**Protected:** Admin only
**Success Response:**
```json
{
  "success": true,
  "message": "Verification request denied and removed from queue"
}
```

#### `POST /admin/generate-codes`
**Purpose:** Generate verification codes
**Protected:** Admin only
**Request Body:**
```json
{
  "count": 100
}
```
**Response:**
```json
{
  "success": true,
  "message": "100 codes generated successfully",
  "codes": [
    {
      "_id": "...",
      "code": "ABC1234567",
      "is_used": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Verification Methods Explained

### Method 1: Verification Code (Instant)

**Use Case:** Alumni who received verification code via email

**Flow:**
1. Admin generates verification codes using `/admin/generate-codes`
2. Codes are distributed to alumni via email
3. Alumni enter 10-digit code on verification page
4. System validates code and marks user as verified instantly
5. Code is marked as used (single-use)

**Benefits:**
- Instant verification
- Most secure method
- Pre-validated by admin

**Implementation:**
```typescript
// Frontend
const handleCodeVerification = async () => {
  const response = await api.post('/alumni/verify-code', 
    { code: verificationCode },
    { headers: { Authorization: `Bearer ${accessToken}` }}
  );
  // User verified, redirect to dashboard
};
```

### Method 2: Database Check (Semi-Automated)

**Use Case:** Alumni information exists in college database

**Flow:**
1. User enters name, roll number, batch, and branch
2. System calls microservice to check college database
3. If matches found, user selects their record
4. User confirms selection → instant verification
5. If no matches, automatically moves to Method 3

**Benefits:**
- No admin intervention needed for matching records
- Validates against official college data
- Handles multiple potential matches

**Implementation:**
```typescript
// Frontend - Check database
const handleDatabaseCheck = async () => {
  const response = await api.post('/alumni/check-manual', {
    name: dbName,
    roll_no: dbRollNo,
    batch: dbBatch,
    branch: dbBranch
  });
  
  if (response.data.matches.length > 0) {
    setMatches(response.data.matches);
  } else {
    // Automatically submitted to admin queue
    toast.info('Request sent for manual verification');
  }
};

// Frontend - Confirm match
const handleConfirmMatch = async () => {
  await api.post('/alumni/confirm-match', {
    roll_no: selectedMatch
  });
  // User verified
};
```

### Method 3: Manual Review (Admin Approval)

**Use Case:** Alumni not in database or edge cases

**Flow:**
1. User submits verification form with details
2. Request added to admin verification queue
3. Admin reviews request with provided information
4. Admin approves or denies request
5. User notified via email (future enhancement)

**Benefits:**
- Handles edge cases
- Human verification for ambiguous cases
- Audit trail of verification decisions

**Implementation:**
```typescript
// Frontend submission (same as database check)
const handleManualSubmit = async () => {
  await api.post('/alumni/check-manual', {
    name: manualName,
    roll_no: manualRollNo,
    batch: manualBatch,
    branch: manualBranch
  });
  // Added to queue automatically if no matches
};
```

## Database Models

### User Model
```javascript
{
  verified_alumni: {
    type: Boolean,
    default: false
  }
}
```

### VerificationCode Model
```javascript
{
  code: {
    type: String,
    required: true,
    unique: true,
    length: 10
  },
  is_used: {
    type: Boolean,
    default: false
  }
}
```

### VerificationQueue Model
```javascript
{
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  details_provided: {
    name: String,
    roll_no: String,
    batch: String,
    branch: String
  },
  timestamps: true
}
```

## Security Considerations

1. **Authentication Required:** All verification endpoints require valid JWT token
2. **Single-Use Codes:** Verification codes can only be used once
3. **Admin Protection:** Admin endpoints protected with `isAdmin` middleware
4. **Duplicate Prevention:** Queue checks for existing requests before adding
5. **Audit Trail:** All verification actions logged with timestamps

## Environment Variables

```env
# Alumni verification microservice URL
ALUMNI_VERIFY_SERVICE_URL=http://localhost:8000
```

## Frontend Routes

- `/dashboard/verify-alumni` - Public verification page (auth required)
- `/dashboard/*` - Protected routes (verification required)

## User Experience

### Unverified User Journey
1. Login → Redirected to `/dashboard`
2. `ProtectedVerificationRoute` detects unverified status
3. Redirected to `/dashboard/verify-alumni`
4. Choose verification method and complete
5. Redirected back to dashboard

### Verified User Journey
1. Login → Dashboard loads normally
2. All features accessible
3. No verification prompts

## Admin Workflow

### Generating Codes
1. Navigate to admin panel
2. Generate batch of codes
3. Export codes for email distribution
4. Alumni receive codes and verify

### Processing Manual Requests
1. Navigate to verification queue
2. Review submitted details
3. Verify against college records
4. Approve or deny request
5. User receives notification

## Testing

### Test Scenarios

#### Code Verification
- Valid unused code → Success
- Used code → Error
- Invalid code → Error
- Missing code → Error

#### Database Check
- Exact match → Show match, allow confirmation
- Multiple matches → Show all, allow selection
- No matches → Auto-submit to queue
- Invalid data → Error

#### Manual Review
- Complete details → Submit successfully
- Missing required fields → Error
- Duplicate submission → Use existing request

## Future Enhancements

1. **Email Notifications:** Notify users when manual request is approved/denied
2. **Bulk Code Generation:** CSV export of generated codes
3. **Verification History:** Log of all verification attempts
4. **Profile Enrichment:** Auto-populate profile from database match
5. **Document Upload:** Support document verification for manual review
6. **SMS Verification:** Alternative to email codes
7. **Batch Processing:** Bulk approve/deny in admin panel

## Troubleshooting

### User Can't Verify
- Check verification status: `GET /alumni/status`
- Check queue: `GET /admin/queue`
- Verify microservice is running
- Check database connectivity

### Codes Not Working
- Verify code exists in database
- Check if already used
- Ensure correct format (10 characters)

### Database Check Fails
- Verify microservice URL in environment
- Check microservice logs
- Test microservice directly
- Verify request payload format

## API Error Codes

- `400` - Bad request (missing fields, invalid code)
- `404` - User/code not found
- `500` - Server error (microservice down, database error)

## Support

For issues with the verification system:
1. Check admin verification queue
2. Review server logs
3. Test microservice connectivity
4. Contact admin@nsut.ac.in
