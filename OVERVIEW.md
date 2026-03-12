# AIS Website — Complete Overview

**Project:** Aadinath Industries website (https://aadinathindustries.in)  
**Framework:** Next.js 15 + React 19 + Tailwind CSS  
**Hosting:** Vercel (auto-deploys on GitHub push)  
**Database:** Firebase Firestore (ais-central project)  
**Status:** ✅ Live & Operational

---

## 🎯 Quick Reference

| Aspect | Details |
|--------|---------|
| **Live Domain** | https://aadinathindustries.in |
| **GitHub Repo** | aadinath-website (private) |
| **Firebase Project** | ais-central (projectId: ais-production-e013c) |
| **Contact** | +91 9825207616 (WhatsApp & Phone) |
| **Email** | info@aadinathindustries.in |
| **Location** | Sihor, Bhavnagar, Gujarat |

---

## 📄 Pages (5 total)

### 1. **Home** (`/`)
- Hero section with steel manufacturing imagery
- 3 feature cards (Quality, Innovation, Trust)
- Product spotlight for MS Angles
- About snippet
- Company quote ("Always Ahead...")

### 2. **Products** (`/products`)
- 7 product types with size ranges
- Includes all MS grades (Angle, Round, Square, Flat) + Bright variants
- Product cards with specs

### 3. **About Us** (`/about-us`)
- Mission statement
- Core values section
- Company story & vision

### 4. **Contact Us** (`/contact-us`)
- Contact details (phone, email, address)
- Embedded map (optional)
- WhatsApp CTA

### 5. **Verify** (`/verify?batch=BATCH-ID`)
- **Most Important:** QR code landing page for customers
- Shows green checkmark badge ✔
- Displays batch info
- Optional customer data form (captures leads)
- WhatsApp contact button

---

## 🔥 Key Features

### QR Code Verification System
- **Format:** `https://aadinathindustries.in/verify?batch=BATCH-2026-02-05-001`
- **Batch ID:** `BATCH-YYYY-MM-DD-XXX`
- **Tracking:** Each scan logged to Firebase `scan_events`
- **Lead Capture:** Optional form on verify page → `customer_data` collection

### Firebase Collections (ais-central)
1. **scan_events** — QR scans (batchId, timestamp, location)
2. **customer_data** — Lead submissions (name, phone, city, useCase, quantity)
3. **page_views** — Website traffic
4. **engagement_events** — WhatsApp clicks, form views
5. **contact_submissions** — Contact form entries

---

## 🚀 Development Setup

```bash
# Navigate to project
cd /home/adityajain/AIS/ais-website

# Install dependencies
pnpm install

# Local development (http://localhost:3000)
pnpm dev

# Production build
pnpm build
pnpm start -p 3001
```

---

## 📁 File Structure

```
ais-website/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (nav, footer, global styles)
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── products/
│   │   └── page.tsx             # Products page
│   ├── about-us/
│   │   └── page.tsx             # About page
│   ├── contact-us/
│   │   └── page.tsx             # Contact page
│   ├── verify/
│   │   └── page.tsx             # QR verification page
│   └── admin/                    # Protected admin pages (Firebase Auth)
│       ├── login/
│       │   └── page.tsx         # Admin login page
│       └── analytics/
│           ├── layout.tsx       # Analytics sidebar layout
│           ├── page.tsx         # Dashboard home (KPIs, trends, recent sessions)
│           └── pages/
│               ├── journey/
│               │   └── page.tsx # Journey/Sessions analysis (expandable table)
│               ├── traffic/
│               │   └── page.tsx # Page traffic analytics
│               ├── geographic/
│               │   └── page.tsx # Geographic analytics (heatmap)
│               ├── verify/
│               │   └── page.tsx # Verify/QR analytics (funnel, conversions)
│               ├── leads/
│               │   └── page.tsx # Leads management (CSV export)
│               └── trends/
│                   └── page.tsx # Trends & time series analysis
├── components/
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer
│   ├── WhatsAppButton.tsx        # Floating WhatsApp button
│   ├── VerifyContent.tsx         # Verification page logic
│   └── CustomerDataForm.tsx      # Lead capture form
├── lib/
│   ├── firebase.ts              # Firebase initialization
│   ├── firebase-admin.ts        # Firebase Auth utilities
│   ├── analytics.ts             # Tracking functions
│   └── analytics-queries.ts     # Firestore query functions (Phase 2)
├── public/
│   ├── images/                  # All images (hero, products, etc.)
│   └── icons/                   # SVG icons
├── package.json                 # Dependencies
├── next.config.js               # Next.js config
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind CSS config
├── .env.example                 # Environment template (no secrets)
├── .env.local                   # Local secrets (⚠️ NEVER commit)
└── DOCUMENTATION/
    ├── OVERVIEW.md              # This file
    ├── REQUIREMENTS.md          # Design/build requirements
    ├── DEPLOYMENT.md            # Vercel deployment steps
    ├── VERIFICATION_SETUP.md    # QR code & batch ID strategy
    ├── FIREBASE_COLLECTIONS.md  # Firestore schema
    ├── SECURITY.md              # Security best practices
    └── PROGRESS.md              # Implementation status & decisions
```

---

## 🔧 Tech Dependencies

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "firebase": "^10.14.1",
  "tailwindcss": "^3.4.0"
}
```

---

## 🎨 Brand Colors & Guidelines

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Orange | #F26522 |
| Background | White | #FFFFFF |
| Text | Dark Gray | #1a1a1b |
| Light | Light Gray | #f5f5f5 |
| Logo | Orange Circle + AA | |

**Slogan:** "Always Ahead"  
**Tagline:** "Crafted with Care, Delivered with Pride"

---

## 🔐 Security

⚠️ **CRITICAL:** Firebase credentials are stored in environment variables (`.env.local` locally, Vercel dashboard in production).

- ✅ All secrets use `NEXT_PUBLIC_*` prefix (safe for client-side)
- ✅ `.env.local` is in `.gitignore`
- ✅ `.env.example` is committed (no real values)
- ⚠️ **ACTION NEEDED:** Rotate Firebase keys (exposed in old commits)

See **SECURITY.md** for full details.

---

## 📋 Implementation Checklist

### ✅ Completed
- [x] Website live on aadinathindustries.in
- [x] QR verification page built
- [x] Firebase analytics integrated
- [x] All 5 pages functional
- [x] Responsive design (mobile-first)
- [x] WhatsApp CTA buttons
- [x] Customer data form on verify page
- [x] Vercel auto-deploy configured

### ✅ Admin Dashboard (Phase 3)
- [x] 7 analytics pages built & live
- [x] Journey/Sessions page with expandable rows
- [x] Verify/QR page with conversion funnel & heatmap
- [x] Dashboard home with KPIs & trends
- [x] Sidebar navigation with 7 links
- [x] Loading states & error handling
- [x] Mobile responsive design
- [x] Client-side sorting & filtering
- [x] Data visualization (Recharts)
- [x] Firebase Auth integration

### ⏳ In Progress / Pending
- [ ] Phase 4: Testing & validation (testing all pages on live deployment)
- [ ] Batch ID generation in AIS ERP (when a batch is rolled)
- [ ] QR code generation script (automated)
- [ ] CSV export from leads page (already built, ready to test)
- [ ] Rotate Firebase keys (security issue)
- [ ] Set up daily email digest of customer leads

---

## 📊 Admin Analytics Dashboard (Phase 3+)

### Dashboard Pages (Protected via Firebase Auth)
**Base URL:** `https://aadinathindustries.in/admin/analytics`

#### 1. **Dashboard Home** (`/admin/analytics`)
- **KPI Cards:** Total Sessions (7d), Avg Session Duration, QR Scan→Form Conversion Rate, Top Location
- **Conversion Trend Chart:** 7-day LineChart (QR Scans vs Form Submissions)
- **Recent Sessions Quick View:** Table of first 10 sessions with conversion status
- **Quick Stats:** Color-coded cards showing Scans, Leads, Session Conversion %
- **Use Case:** Executive overview of analytics

#### 2. **Journey Analysis** (`/admin/analytics/pages/journey`)
- **Sessions Table:** All user sessions with expandable rows
  - Columns: Session ID, Duration, Pages Visited, Path, Location, Converted Status
  - Stats: Total sessions, conversion rate %, avg session duration
- **Sortable by:** Most recent, longest duration, conversion status
- **Filterable by:** City, conversion status (converted/bounced)
- **Expandable Rows:** Click to view detailed journey (page path, duration, conversion)
- **Row Highlighting:** Green for converted, gray for bounced
- **Use Case:** "Show me all user journeys and which ones converted"

#### 3. **Verify/QR Analytics** (`/admin/analytics/pages/verify`)
- **KPI Cards:** Total Scans, Form Submissions, Conversion Rate (%), Avg Time to Submit
- **Conversion Funnel:** BarChart showing QR Scans → Form Submissions with percentages
- **Recent Conversions Table:**
  - Columns: Customer Name, Location, Scan Time, Submit Time, Time Lag
  - Time lag color coding: Green <1m, Yellow <5m, Red >5m
  - Sortable: By most recent or fastest conversion
  - Filterable: By city
- **Location Heatmap:** PieChart showing conversions by city
- **Top Converting Cities:** Ranked list of top 5 cities by conversion count
- **Use Case:** "Track QR scan → form submission conversion funnel"

#### 4. **Page Traffic** (`/admin/analytics/pages/traffic`)
- Table of page visit counts
- Sorted by most visited pages
- Shows last visited timestamp

#### 5. **Geographic Analytics** (`/admin/analytics/pages/geographic`)
- Bar chart of top locations
- Table breakdown: City, Country, Scans, Percentage

#### 6. **Leads Management** (`/admin/analytics/pages/leads`)
- Full table of all customer submissions
- Filters: City, Use Case
- CSV export functionality

#### 7. **Trends** (`/admin/analytics/pages/trends`)
- Time period selector (7, 14, 30, 60 days)
- LineChart: Scans, Leads, Page Views over time
- Summary statistics

### Admin Features (Phase 3)
- ✅ **Firebase Authentication:** Email/password login for authorized users
- ✅ **Sidebar Navigation:** 7 analytics pages with active state highlighting
- ✅ **Loading States:** Spinning indicators & skeleton placeholders on all pages
- ✅ **Error Handling:** Graceful failures with console logging
- ✅ **Mobile Responsive:** All pages work on mobile/tablet/desktop
- ✅ **Sorting & Filtering:** Client-side on journey and verify pages
- ✅ **Data Visualization:** Recharts (LineChart, BarChart, PieChart)
- ✅ **Real-time Updates:** Fetches latest data on page load

### Data Sources (Firestore Collections)
- **scan_events** → QR scans, location data
- **customer_data** → Form submissions, conversion tracking
- **page_views** → Session tracking, journey data
- **engagement_events** → WhatsApp clicks, interactions
- **contact_submissions** → Contact form entries

---

## 🔄 Workflow: Adding Content or Features

1. **Plan:** Document the change in PROGRESS.md (what, why, who, when)
2. **Develop Locally:** `pnpm dev`, test on http://localhost:3000
3. **Verify:** Check all devices (mobile, tablet, desktop)
4. **Commit:** Push to GitHub main branch
5. **Deploy:** Vercel auto-deploys within 1-2 minutes
6. **Monitor:** Check https://aadinathindustries.in, verify Firebase data

---

## 📞 Important Contacts

- **Phone:** +91 9825207616
- **Email:** info@aadinathindustries.in
- **Works Address:** Survey No. 44, Post: Vadia, Sihor Road, Bhavnagar
- **Office Address:** A-2, Hans Complex, Sanskar Mandal, Bhavnagar, 364002

---

## 📚 Documentation Files (Read These First)

1. **OVERVIEW.md** (this file) — Master reference
2. **REQUIREMENTS.md** — Design specs & brand guidelines
3. **DEPLOYMENT.md** — How to deploy to Vercel
4. **VERIFICATION_SETUP.md** — QR code & batch ID strategy
5. **FIREBASE_COLLECTIONS.md** — Database schema
6. **SECURITY.md** — Security best practices
7. **PROGRESS.md** — Status, decisions, timeline

---

**Last Updated:** 2026-02-11 (Phase 3 Complete)  
**Next Review:** 2026-02-18
