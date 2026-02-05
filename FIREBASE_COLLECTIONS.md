# Firebase Collections for aadinath-website

Connected to **ais-central** Firebase project (projectId: `ais-production-e013c`)

## Collections Schema

### 1. `scan_events`
Tracks QR code scans from the verification page.

**Document Structure:**
```json
{
  "batchId": "BATCH-2026-02-05-001",
  "pageUrl": "/verify",
  "userAgent": "Mozilla/5.0...",
  "userLocation": "Bangalore, Karnataka, India",
  "timestamp": "2026-02-05T15:30:00Z",
  "type": "verification_scan",
  "ipAddress": "192.168.1.1" (optional),
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

**Indexes Recommended:**
- `batchId` + `timestamp` (to find all scans for a batch)
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
  "submittedAt": "2026-02-05T15:31:00Z",
  "source": "verification_page"
}
```

**Indexes Recommended:**
- `submittedAt` (for recent submissions)
- `phone` (for duplicate checks)

---

### 3. `page_views`
Generic page view tracking across the website.

**Document Structure:**
```json
{
  "pageName": "/products",
  "timestamp": "2026-02-05T15:30:00Z",
  "userAgent": "Mozilla/5.0...",
  "deviceType": "mobile", // or "desktop"
  "country": "India",
  "city": "Bangalore"
}
```

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
