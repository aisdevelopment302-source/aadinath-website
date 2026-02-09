# Verification Page Setup & QR Code Strategy

## Overview

The verification page (`/verify`) now captures:
1. **QR Code Scans** — Which batch was scanned, when, and from where
2. **Customer Data** — Contact info, location, use case, quantity needs
3. **Geolocation** — Automatic IP-based location detection

---

## How It Works

### 1. QR Code Generation

Create a static QR code for the verification page:

**Format:**
```
https://aadinathindustries.in/verify
```

**Note:** The QR code is static (same for all shipments). Batch tracking can be added later when the ERP system is operational. Currently, all scans are logged to track traffic by geography and device type.

### 2. Sticker Placement

Print the QR code on stickers and attach to:
- Bundle wrappers
- Invoices
- Product packaging

**Important:** Use the same static QR code for all products.

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

**Online Tool Option (Recommended for now):**
- Go to https://qr-code-generator.com/
- Enter URL: `https://aadinathindustries.in/verify`
- Download PNG
- Print on sticker sheet
- Attach to product bundles

This QR code can be used for all products since the URL is static.

---

## Example Customer Journey

1. **Customer receives angle bars** (with QR sticker on packaging)
2. **Scans QR code** → Lands on verify page
3. **Sees verification info** ✔ Verified product from Aadinath Industries
4. **Optionally submits contact info** → "Help Us Serve You Better" form
   - We auto-detect city: Bangalore
   - They confirm/edit: Use Case = "Fabrication", Quantity = "1000 kg"
   - They give phone: "+919876543210"
5. **Data saved to Firebase** → Your sales team sees lead immediately
6. **Sales team reaches out** → "We saw you're interested in our steel products! Let's discuss your needs."

---

## Next Steps

1. **Generate static QR code** for verification page
   - Use online tool: https://qr-code-generator.com/
   - URL: `https://aadinathindustries.in/verify`
   - Print sticker sheet
   - Attach to products immediately (no ERP dependency!)

2. **Build analytics dashboard** (priority)
   - View all scan events by geography and device
   - View all customer submissions (lead list)
   - Export as CSV
   - Geographic heatmap and trends

3. **Set up automation** (optional)
   - Daily email: "You got X scans today, Y form submissions"
   - Firebase admin dashboard for live tracking

4. **Future: Add batch tracking** (when ERP is ready)
   - Will enhance analytics with batch-level tracking
   - Link scans to specific production runs

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
