# Alumni Verification System - Visual Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NALUM Platform                            │
│                                                              │
│  ┌──────────────┐      ┌──────────────┐     ┌────────────┐ │
│  │   Frontend   │◄────►│   Backend    │◄───►│  Database  │ │
│  │  (React/TS)  │      │  (Express)   │     │ (MongoDB)  │ │
│  └──────────────┘      └──────────────┘     └────────────┘ │
│         │                      │                            │
│         │                      ▼                            │
│         │              ┌──────────────┐                     │
│         └─────────────►│ Microservice │                     │
│                        │ (Alumni DB)  │                     │
│                        └──────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

## User Verification Flow

```
                        ┌─────────────┐
                        │ User Signup │
                        └──────┬──────┘
                               │
                               ▼
                        ┌─────────────┐
                        │ Create      │
                        │ Profile     │
                        └──────┬──────┘
                               │
                               ▼
                        ┌─────────────┐
                        │ Login       │
                        └──────┬──────┘
                               │
                               ▼
                     ┌─────────────────┐
                     │ Try Access      │
                     │ Dashboard       │
                     └────────┬────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌──────────────┐            ┌─────────────┐
        │  Verified?   │────NO─────►│ Redirect to │
        │   Status     │            │ Verify Page │
        └──────┬───────┘            └──────┬──────┘
               │                            │
              YES                           │
               │                            │
               ▼                            ▼
        ┌─────────────┐         ┌──────────────────┐
        │  Dashboard  │         │ Choose Method:   │
        │  Full       │         │ 1. Code          │
        │  Access     │         │ 2. Database      │
        └─────────────┘         │ 3. Manual        │
                                └────────┬─────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
             ┌─────────────┐      ┌─────────────┐     ┌────────────┐
             │   Method 1  │      │   Method 2  │     │  Method 3  │
             │ Code Verify │      │ Database    │     │  Manual    │
             └──────┬──────┘      │ Check       │     │  Review    │
                    │             └──────┬──────┘     └─────┬──────┘
                    │                    │                   │
                    ▼                    ▼                   ▼
             ┌─────────────┐      ┌─────────────┐     ┌────────────┐
             │ Validate    │      │ Query       │     │ Submit to  │
             │ Code        │      │ College DB  │     │ Admin      │
             └──────┬──────┘      └──────┬──────┘     │ Queue      │
                    │                    │             └─────┬──────┘
                    │               ┌────┴────┐              │
                    │               ▼         ▼              │
                    │         ┌─────────┐ ┌─────────┐       │
                    │         │ Matches │ │ No Match│       │
                    │         │ Found   │ │         │       │
                    │         └────┬────┘ └────┬────┘       │
                    │              │           │             │
                    │              ▼           └─────────────┤
                    │         ┌─────────┐                   │
                    │         │ Select  │                   │
                    │         │ Match   │                   │
                    │         └────┬────┘                   │
                    │              │                        │
                    └──────────────┼────────────────────────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │  Verified!  │
                            │  Access     │
                            │  Granted    │
                            └─────────────┘
```

## Method 1: Code Verification Flow

```
User                    Frontend               Backend              Database
 │                         │                     │                     │
 │ Enter Code             │                     │                     │
 ├────────────────────────►│                     │                     │
 │                         │ POST /verify-code   │                     │
 │                         ├────────────────────►│                     │
 │                         │                     │ Find Code           │
 │                         │                     ├────────────────────►│
 │                         │                     │◄────────────────────┤
 │                         │                     │ Code Valid & Unused │
 │                         │                     │                     │
 │                         │                     │ Mark as Used        │
 │                         │                     ├────────────────────►│
 │                         │                     │                     │
 │                         │                     │ Update User Status  │
 │                         │                     ├────────────────────►│
 │                         │                     │                     │
 │                         │ Success Response    │                     │
 │                         │◄────────────────────┤                     │
 │ ✅ Verified!            │                     │                     │
 │◄────────────────────────┤                     │                     │
 │                         │                     │                     │
 │ Redirect to Dashboard  │                     │                     │
 └─────────────────────────┘                     │                     │
```

## Method 2: Database Check Flow

```
User                Frontend           Backend          Microservice      Database
 │                     │                  │                  │               │
 │ Enter Details      │                  │                  │               │
 ├───────────────────►│                  │                  │               │
 │                    │ POST /check-manual│                 │               │
 │                    ├─────────────────►│                  │               │
 │                    │                  │ Forward Request  │               │
 │                    │                  ├─────────────────►│               │
 │                    │                  │                  │ Query Alumni DB│
 │                    │                  │                  ├───────────────►│
 │                    │                  │                  │◄───────────────┤
 │                    │                  │ Matches Found    │               │
 │                    │                  │◄─────────────────┤               │
 │                    │ Display Matches  │                  │               │
 │ Select Match       │◄─────────────────┤                  │               │
 │◄───────────────────┤                  │                  │               │
 │                    │                  │                  │               │
 │ Confirm Selection  │                  │                  │               │
 ├───────────────────►│ POST /confirm-match                │               │
 │                    ├─────────────────►│                  │               │
 │                    │                  │ Update User      │               │
 │                    │                  ├─────────────────────────────────►│
 │                    │                  │                  │               │
 │                    │ Success          │                  │               │
 │ ✅ Verified!        │◄─────────────────┤                  │               │
 │◄───────────────────┤                  │                  │               │
```

## Method 3: Manual Review Flow

```
User              Frontend          Backend         Database         Admin
 │                   │                │                │               │
 │ Enter Details    │                │                │               │
 ├─────────────────►│                │                │               │
 │                  │ POST /check-manual              │               │
 │                  ├───────────────►│                │               │
 │                  │                │ Check DB       │               │
 │                  │                │ (No Matches)   │               │
 │                  │                │                │               │
 │                  │                │ Add to Queue   │               │
 │                  │                ├───────────────►│               │
 │                  │                │                │               │
 │                  │ Request Queued │                │               │
 │ ⏳ Pending        │◄───────────────┤                │               │
 │◄─────────────────┤                │                │               │
 │                  │                │                │               │
 │                  │                │                │ View Queue    │
 │                  │                │                │◄──────────────┤
 │                  │                │                │ Review Details│
 │                  │                │                │               │
 │                  │                │                │ Decision      │
 │                  │                │                │               │
 │                  │                │ ┌──────────────┴───────────┐   │
 │                  │                │ ▼                          ▼   │
 │                  │                │ Approve                  Deny  │
 │                  │                │ POST /admin/queue/       POST  │
 │                  │                │ :userId/approve          /deny │
 │                  │                │                                │
 │                  │                │ Update User Status             │
 │                  │                │◄───────────────────────────────┤
 │                  │                ├───────────────►│               │
 │                  │                │ Remove Queue   │               │
 │                  │                ├───────────────►│               │
 │                  │                │                │               │
 │ ✅ Email Notif.  │                │                │               │
 │◄─────────────────────────────────┤                │               │
 │                  │                │                │               │
 │ Login & Access   │                │                │               │
 └──────────────────┘                │                │               │
```

## Admin Panel Flow

```
┌──────────────────────────────────────────────────────────┐
│                     Admin Panel                          │
│                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────┐│
│  │  Generate      │  │  View Queue    │  │  Manage    ││
│  │  Codes         │  │                │  │  Users     ││
│  └───────┬────────┘  └───────┬────────┘  └────────────┘│
│          │                   │                          │
│          ▼                   ▼                          │
│  ┌────────────────┐  ┌────────────────┐               │
│  │  POST /admin/  │  │  GET /admin/   │               │
│  │  generate-codes│  │  queue         │               │
│  └───────┬────────┘  └───────┬────────┘               │
│          │                   │                          │
│          ▼                   ▼                          │
│  ┌────────────────┐  ┌────────────────┐               │
│  │  Returns List  │  │  Shows Pending │               │
│  │  of Codes      │  │  Requests      │               │
│  └───────┬────────┘  └───────┬────────┘               │
│          │                   │                          │
│          ▼                   ▼                          │
│  ┌────────────────┐  ┌────────────────┐               │
│  │  Export &      │  │  Review Each   │               │
│  │  Distribute    │  │  Request       │               │
│  └────────────────┘  └───────┬────────┘               │
│                              │                          │
│                   ┌──────────┴──────────┐              │
│                   ▼                     ▼              │
│           ┌──────────────┐      ┌──────────────┐      │
│           │  Approve     │      │  Deny        │      │
│           │  POST        │      │  POST        │      │
│           │  /approve    │      │  /deny       │      │
│           └──────┬───────┘      └──────┬───────┘      │
│                  │                     │              │
│                  └──────────┬──────────┘              │
│                             ▼                          │
│                   ┌──────────────────┐                │
│                   │  User Notified   │                │
│                   │  (Future: Email) │                │
│                   └──────────────────┘                │
└──────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Data Entities                         │
│                                                              │
│  ┌──────────────┐       ┌──────────────┐                   │
│  │    User      │       │ Verification │                   │
│  │              │       │    Code      │                   │
│  │ - email      │       │              │                   │
│  │ - password   │       │ - code       │                   │
│  │ - verified_  │       │ - is_used    │                   │
│  │   alumni     │       │ - createdAt  │                   │
│  └──────┬───────┘       └──────────────┘                   │
│         │                                                   │
│         │ 1:many                                            │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐                                          │
│  │ Verification │                                          │
│  │    Queue     │                                          │
│  │              │                                          │
│  │ - user_id    │                                          │
│  │ - details_   │                                          │
│  │   provided   │                                          │
│  │ - createdAt  │                                          │
│  └──────────────┘                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## State Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                   User Verification States                   │
│                                                              │
│                  ┌─────────────────┐                        │
│                  │  Unverified     │                        │
│                  │  (Default)      │                        │
│                  └────────┬────────┘                        │
│                           │                                 │
│            ┌──────────────┼──────────────┐                 │
│            ▼              ▼              ▼                 │
│    ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│    │  Code      │ │  Database  │ │  Manual    │          │
│    │  Entered   │ │  Checked   │ │  Submitted │          │
│    └─────┬──────┘ └─────┬──────┘ └─────┬──────┘          │
│          │              │              │                  │
│          ▼              ▼              │                  │
│    ┌─────────────────────┐            │                  │
│    │   Verified          │            │                  │
│    └─────────────────────┘            │                  │
│                                        ▼                  │
│                              ┌──────────────┐            │
│                              │  In Queue    │            │
│                              │  (Pending)   │            │
│                              └──────┬───────┘            │
│                                     │                    │
│                          ┌──────────┴──────────┐        │
│                          ▼                     ▼        │
│                  ┌────────────┐       ┌────────────┐   │
│                  │  Approved  │       │  Denied    │   │
│                  │            │       │            │   │
│                  └─────┬──────┘       └─────┬──────┘   │
│                        │                    │          │
│                        ▼                    ▼          │
│                  ┌─────────────┐     ┌────────────┐   │
│                  │  Verified   │     │ Unverified │   │
│                  └─────────────┘     │ (Can retry)│   │
│                                      └────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
│                                                              │
│  Request                                                     │
│     │                                                        │
│     ▼                                                        │
│  ┌──────────────┐                                           │
│  │   CORS       │  Check Origin                             │
│  │   Check      ├─────────────► Allowed?                    │
│  └──────┬───────┘                    │                      │
│         │                            │ No → 403             │
│         │ Yes                         │                      │
│         ▼                            │                      │
│  ┌──────────────┐                   │                      │
│  │     JWT      │  Verify Token     │                      │
│  │     Auth     ├──────────────────►│                      │
│  └──────┬───────┘                   │                      │
│         │                            │ Invalid → 401        │
│         │ Valid                      │                      │
│         ▼                            │                      │
│  ┌──────────────┐                   │                      │
│  │   Check      │  For Admin        │                      │
│  │   Role       │  Endpoints        │                      │
│  └──────┬───────┘                   │                      │
│         │                            │ Not Admin → 403      │
│         │ Authorized                 │                      │
│         ▼                            │                      │
│  ┌──────────────┐                   │                      │
│  │  Validation  │  Check Input      │                      │
│  │              ├──────────────────►│                      │
│  └──────┬───────┘                   │ Invalid → 400        │
│         │                            │                      │
│         │ Valid                      │                      │
│         ▼                            │                      │
│  ┌──────────────┐                   │                      │
│  │  Business    │                   │                      │
│  │  Logic       │                   │                      │
│  └──────┬───────┘                   │                      │
│         │                            │                      │
│         ▼                            │                      │
│     Response                         │                      │
│                                      │                      │
└─────────────────────────────────────────────────────────────┘
```

## Timeline Diagram

```
Day 0: System Launch
│
├─► Admins generate 1000 codes
│   └─► Distributed via email
│
Day 1-7: Initial Wave
│
├─► 60% use codes (instant verification)
├─► 30% use database check (2-3 min verification)
└─► 10% submit manual requests
    │
    ├─► Admin reviews within 24-48hrs
    └─► 90% approved, 10% need clarification
│
Day 7-30: Secondary Wave
│
├─► Remaining users verify
├─► Admin generates more codes as needed
└─► Manual queue maintained < 50 requests
│
Day 30+: Steady State
│
├─► New users verified as they join
├─► Occasional manual reviews
└─► System monitoring and optimization
```

## Component Hierarchy

```
App
├─── AuthProvider
│    └─── AdminAuthProvider
│         └─── Routes
│              ├─── Public Routes
│              │    ├─► HomePage
│              │    ├─► Login
│              │    └─► SignUp
│              │
│              ├─── Protected Routes (Auth Required)
│              │    ├─► VerifyAlumni (No verification needed)
│              │    │    ├─► CodeVerificationForm
│              │    │    ├─► DatabaseCheckForm
│              │    │    └─► ManualReviewForm
│              │    │
│              │    └─► ProtectedVerificationRoute (Verification required)
│              │         ├─► Dashboard
│              │         ├─► ShowProfile
│              │         ├─► UpdateProfile
│              │         └─► AlumniDirectory
│              │
│              └─── Admin Routes (Admin Auth Required)
│                   ├─► AdminDashboard
│                   ├─► VerificationQueue
│                   │    ├─► QueueItem
│                   │    │    ├─► ApproveButton
│                   │    │    └─► DenyButton
│                   │    └─► QueueFilters
│                   └─► UserManagement
```

---

## Legend

```
Symbols Used:
│  ├  └  ┌  ┐  ┘  └  ┴  ┬  ┼  ─  = Flow connectors
►  ▼  ▲  ◄                    = Direction arrows
✅                           = Success/Completed
❌                           = Error/Failed
⏳                           = Pending/Waiting
```

---

This visual documentation provides a clear understanding of how all components interact in the Alumni Verification System.
