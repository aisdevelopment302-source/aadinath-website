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
│   └── verify/
│       └── page.tsx             # QR verification page
├── components/
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer
│   ├── WhatsAppButton.tsx        # Floating WhatsApp button
│   ├── VerifyContent.tsx         # Verification page logic
│   └── CustomerDataForm.tsx      # Lead capture form
├── lib/
│   ├── firebase.ts              # Firebase initialization
│   └── analytics.ts             # Tracking functions
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

### ⏳ In Progress / Pending
- [ ] Batch ID generation in AIS ERP (when a batch is rolled)
- [ ] QR code generation script (automated)
- [ ] Admin dashboard (view scans, leads, export CSV)
- [ ] Rotate Firebase keys (security issue)
- [ ] Set up daily email digest of customer leads

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

**Last Updated:** 2026-02-09  
**Next Review:** 2026-02-16
