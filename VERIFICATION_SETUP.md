# Verification Page Setup & QR Code Strategy

## Overview

The verification page (`/verify`) now captures:
1. **QR Code Scans** — Which batch was scanned, when, and from where
2. **Customer Data** — Contact info, location, use case, quantity needs
3. **Geolocation** — Automatic IP-based location detection

---

## How It Works

### 1. QR Code Generation

Create unique QR codes for each production batch:

**Format:**
```
https://aadinathindustries.in/verify?batch=BATCH-2026-02-05-001
```

**Batch ID Format:**
- `BATCH-YYYY-MM-DD-XXX`
- Example: `BATCH-2026-02-05-001` = first batch on Feb 5, 2026
- Example: `BATCH-2026-02-05-002` = second batch on same day

### 2. Sticker Placement

Print the QR code on stickers and attach to:
- Bundle wrappers
- Invoices
- Product packaging

**Important:** Each batch gets a **unique QR code**, so you can track which batch is being verified by customers.

### 3. Verification Page Flow

When customer scans QR:
1. **Verification Check** ✔
   - Shows "Verified Steel Product"
   - Displays batch ID
   - Shows manufacturer info
   - Lists quality guarantees

2. **Customer Data Form** (Optional)
   - "Help Us Serve You Better" button
   - Collects: Name, Email, Phone, City, State, Use Case, Quantity
   - Auto-detects city/state from IP (can be overridden)
   - Can skip if not interested

3. **Contact CTA**
   - WhatsApp button for direct inquiry

---

## Firebase Data Collection

### Real-Time Tracking in Firebase Console

Go to **[Firebase Console](https://console.firebase.google.com/)** → Select `ais-central` project

#### 1. **Scan Events Collection**
```
Collection: scan_events
Each document shows:
- batchId: "BATCH-2026-02-05-001"
- timestamp: "2026-02-05T15:30:00Z"
- userLocation: "Bangalore, Karnataka, India"
- pageUrl: "/verify"
```

**Use Case:** See which batches are being scanned, where, and when
- Build a heatmap of customer locations
- Track batch lifecycle (when was it manufactured → when customers verified it)
- Identify popular batches

#### 2. **Customer Data Collection**
```
Collection: customer_data
Each document shows:
- name: "Rajesh Kumar"
- phone: "+919876543210"
- city: "Bangalore"
- state: "Karnataka"
- country: "India"
- useCase: "construction"
- quantityNeeded: "500 kg"
- batchId: "BATCH-2026-02-05-001"
- submittedAt: "2026-02-05T15:31:00Z"
```

**Use Case:** Sales team gets a lead list with contact info
- Export to CSV daily
- Filter by use case, quantity, location
- Cold-call or WhatsApp customers
- Track customer source (which batch they scanned)

---

## Implementation Checklist

- [x] Firebase config setup in website
- [x] Analytics functions created
- [x] Verify page updated with scan tracking
- [x] Customer form integrated
- [x] Auto geolocation detection added
- [ ] **TODO:** Set up batch ID generation in production system (AIS ERP)
- [ ] **TODO:** Generate unique QR codes per batch
- [ ] **TODO:** Print stickers with QR codes
- [ ] **TODO:** Create Firebase dashboard for viewing data
- [ ] **TODO:** Set up daily email digest of customer leads

---

## Generating QR Codes

**Online Tool Option:**
- Go to https://qr-code-generator.com/
- Enter URL: `https://aadinathindustries.in/verify?batch=BATCH-2026-02-05-001`
- Download PNG
- Print on sticker sheet

**Automated Option (for future):**
- Create a Python script in AIS ERP to:
  1. Generate batch ID for current production
  2. Create QR code image
  3. Save to disk
  4. Send to printer

---

## Example Customer Journey

1. **Customer receives angle bars** (with QR sticker on packaging)
2. **Scans QR code** → Lands on verify page with `?batch=BATCH-2026-02-05-001`
3. **Sees verification info** ✔ Verified product from Aadinath Industries
4. **Optionally submits contact info** → "Help Us Serve You Better" form
   - We auto-detect city: Bangalore
   - They confirm/edit: Use Case = "Fabrication", Quantity = "1000 kg"
   - They give phone: "+919876543210"
5. **Data saved to Firebase** → Your sales team sees lead immediately
6. **Sales team reaches out** → "We saw you verified our batch! Interested in bulk supply?"

---

## Next Steps

1. **Set up batch ID generation** in AIS ERP production system
   - When a batch is created, generate: `BATCH-YYYY-MM-DD-XXX`
   - Store in database

2. **Create QR codes** for upcoming batches
   - Use online tool or write a script
   - Print stickers

3. **Build admin dashboard**
   - View all scan events (heatmap)
   - View all customer submissions (lead list)
   - Export as CSV
   - See conversion: scans → form submissions

4. **Set up automation** (optional)
   - Daily email: "You got 5 scans today, 2 form submissions"
   - Link scans to production data in AIS ERP

---

## Testing

Test the page locally:
```bash
pnpm dev
# Visit: http://localhost:3000/verify?batch=BATCH-2026-02-05-TEST
```

Check Firebase:
1. Go to console.firebase.google.com
2. Select `ais-central` project
3. Go to Firestore Database
4. Check `scan_events` collection (should have 1 test entry)
5. (Optional) Try the form and check `customer_data` collection

---

## Security Notes

- ✅ Firebase rules allow public form submissions (good for UX)
- ✅ No authentication needed to scan/submit
- ✅ IP geolocation is best-effort, not 100% accurate
- ⚠️ Phone numbers are stored as-is (no validation)
- ⚠️ Consider adding GDPR notice on page if you have EU customers

---

## FAQ

**Q: What if a customer scans the same QR multiple times?**
A: Each scan creates a new event in `scan_events`. You can deduplicate based on IP + timestamp in your dashboard.

**Q: Can we track which customer bought from which reseller?**
A: Yes! If you use different batch IDs for different shipments/resellers, you can trace back through batch data.

**Q: How long is the data stored?**
A: Firebase Firestore keeps it indefinitely (until you delete). Set up retention policies as needed.

**Q: What if the customer's phone number format is invalid?**
A: Currently no validation. Add regex validation in form if needed.

---

## Files Modified

- `app/verify/page.tsx` — Main verification page (now uses 'use client')
- `components/CustomerDataForm.tsx` — Customer data collection form
- `lib/firebase.ts` — Firebase initialization
- `lib/analytics.ts` — Analytics tracking functions
