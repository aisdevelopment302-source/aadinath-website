# Firebase Collections for aadinath-website

Connected to **ais-central** Firebase project (projectId: `ais-production-e013c`)

## Collections Schema

### 1. `scan_events`
Tracks QR code scans from the verification page.

**Document Structure:**
```json
{
  "batchId": "BATCH-2026-02-05-001",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "pageUrl": "/verify",
  "userAgent": "Mozilla/5.0...",
  "userLocation": "Bangalore, Karnataka",
  "city": "Bangalore",
  "country": "India",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "timestamp": "2026-02-05T15:30:00Z",
  "type": "verification_scan"
}
```

**Fields:**
- `batchId` (string) - Batch ID from QR code
- `sessionId` (string) - Unique session identifier for user journey tracking
- `pageUrl` (string) - Page where scan occurred
- `userAgent` (string) - Browser user agent
- `userLocation` (string) - City, State format
- `city` (string) - City name from IP geolocation
- `country` (string) - Country name from IP geolocation
- `latitude` (number) - Geographic latitude
- `longitude` (number) - Geographic longitude
- `timestamp` (Timestamp) - Server timestamp of scan
- `type` (string) - Event type (e.g., "verification_scan")

**Indexes Recommended:**
- `batchId` + `timestamp` (to find all scans for a batch)
- `sessionId` + `timestamp` (to track user journey)
- `timestamp` (for date range queries)

---

### 2. `customer_data`
Customer information submitted via verification page form.

**Document Structure:**
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@company.com",
  "phone": "+919876543210",
  "city": "Bangalore",
  "state": "Karnataka",
  "country": "India",
  "useCase": "construction",
  "quantityNeeded": "500 kg",
  "batchId": "BATCH-2026-02-05-001",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "scanEventId": "doc-id-of-scan-event",
  "timeFromScanToSubmit": 45000,
  "submittedAt": "2026-02-05T15:31:00Z",
  "source": "verification_page"
}
```

**Fields:**
- `name` (string) - Customer name
- `email` (string) - Customer email
- `phone` (string) - Customer phone
- `city` (string) - Customer city
- `state` (string) - Customer state
- `country` (string) - Customer country
- `useCase` (string) - Use case for the product
- `quantityNeeded` (string) - Quantity needed
- `batchId` (string) - Related batch ID
- `sessionId` (string) - Session ID for journey tracking
- `scanEventId` (string) - Reference to the scan_event document (for linking scan to form submission)
- `timeFromScanToSubmit` (number) - Time in milliseconds from scan to form submission
- `submittedAt` (Timestamp) - Server timestamp of submission
- `source` (string) - Source of submission (e.g., "verification_page")

**Indexes Recommended:**
- `sessionId` + `submittedAt` (to track customer journey)
- `submittedAt` (for recent submissions)
- `phone` (for duplicate checks)
- `batchId` + `submittedAt` (to link to batch scans)

---

### 3. `page_views`
Generic page view tracking across the website. Tracks user journeys with sessionId and previous page history.

**Document Structure:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "previousPage": "/products",
  "currentPage": "/verify",
  "timestamp": "2026-02-05T15:30:00Z",
  "userAgent": "Mozilla/5.0...",
  "userLocation": "Bangalore, Karnataka",
  "country": "India",
  "city": "Bangalore",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "deviceType": "mobile"
}
```

**Fields:**
- `sessionId` (string) - Unique session identifier (UUID v4) - persists in localStorage across pages for same user
- `previousPage` (string or null) - Previous page visited in the session (from sessionStorage)
- `currentPage` (string) - Current page URL path (e.g., "/verify", "/contact-us", "/")
- `timestamp` (Timestamp) - Server timestamp of the page view
- `userAgent` (string) - Browser user agent string
- `userLocation` (string) - City, State format (e.g., "Bangalore, Karnataka") - from IP geolocation
- `country` (string) - Country name from IP geolocation
- `city` (string) - City name from IP geolocation
- `latitude` (number) - Geographic latitude from IP geolocation API (ipapi.co)
- `longitude` (number) - Geographic longitude from IP geolocation API
- `deviceType` (string) - "mobile" or "desktop" - detected from userAgent

**Session Tracking:**
- `sessionId` is generated once per user (on first visit) and stored in localStorage
- Persists for the entire browser session
- Allows tracking of user journey across multiple pages
- Combined with `previousPage`, enables funnel analysis

**Indexes Recommended:**
- `sessionId` + `timestamp` (to reconstruct user journey)
- `timestamp` (for date range queries)
- `city` + `timestamp` (for geographic analysis)
- `deviceType` + `timestamp` (for device-based analysis)

---

### 4. `engagement_events`
Tracks user engagement (WhatsApp clicks, form views, etc.)

**Document Structure:**
```json
{
  "type": "whatsapp_click",
  "timestamp": "2026-02-05T15:30:00Z",
  "page": "/verify",
  "userAgent": "Mozilla/5.0..."
}
```

**Common event types:**
- `whatsapp_click`
- `phone_click`
- `form_view`
- `form_start`
- `form_submit`

---

### 5. `contact_submissions`
Direct contact form submissions (Contact Us page)

**Document Structure:**
```json
{
  "name": "Aditya Jain",
  "email": "aditya@example.com",
  "phone": "+919876543210",
  "subject": "Bulk Order Inquiry",
  "message": "Need 1 ton of 25x3 angles",
  "submittedAt": "2026-02-05T15:30:00Z",
  "source": "contact_form"
}
```

---

## Firestore Security Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users only
    // For public analytics collection, restrict to server writes only
    
    match /scan_events/{document=**} {
      allow create: if request.auth != null || request.auth == null; // Allow public writes for now
      allow read: if request.auth != null; // Only authenticated users can read
    }
    
    match /customer_data/{document=**} {
      allow create: if true; // Allow public submissions
      allow read: if request.auth != null; // Only authenticated
    }
    
    match /contact_submissions/{document=**} {
      allow create: if true;
      allow read: if request.auth != null;
    }
    
    match /page_views/{document=**} {
      allow create: if true;
      allow read: if request.auth != null;
    }
    
    match /engagement_events/{document=**} {
      allow create: if true;
      allow read: if request.auth != null;
    }
  }
}
```

---

## Implementation Status

- ✅ Firebase config in `/lib/firebase.ts`
- ✅ Analytics utilities in `/lib/analytics.ts`
- ⏳ Integrate into verify page (next step)
- ⏳ Integrate into contact form
- ⏳ Add WhatsApp tracking
- ⏳ Build admin dashboard

---

## Notes

- All timestamps use Firestore `serverTimestamp()` for consistency
- IP geolocation uses `ipapi.co` (free tier available)
- Collections auto-created on first write
- Batch IDs format: `BATCH-YYYY-MM-DD-XXX` (need to generate during production)
