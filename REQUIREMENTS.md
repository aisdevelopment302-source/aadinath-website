# Aadinath Industries Website — Build Requirements

## Tech Stack
- **Next.js 15** (App Router)
- **Tailwind CSS** for all styling
- **Static site** — no backend, no API routes needed
- Images in `public/images/` — use Next.js `<Image>` component where possible

## Brand
- **Logo:** `public/images/logo-aa.png` — orange circle with white "AA"
- **Primary color:** Orange `#F26522` (from logo)
- **Theme:** Light (white/light gray backgrounds, dark text)
- **Slogan:** "Always Ahead"
- **Tagline:** "Crafted with Care, Delivered with Pride"
- **Company:** Aadinath Industries
- **Phone:** +91 9825207616
- **WhatsApp:** +919825207616
- **Email:** aditya.jain.aadinath@gmail.com
- **Works Address:** Survey No. 44, Post: Vadia, Sihor Road, Vadia, Dist. Bhavnagar
- **Office Address:** A-2, Hans Complex, Sanskar Mandal, Bhavnagar, 364002

## Pages

### 1. Home (`/`)
**Hero section:**
- Full-width hero with background image (`home-3.jpg` or `hot-steel-sparks.jpg`)
- AA logo top-left in nav
- Overlay text: "Pioneering Excellence in Every Element"
- Sub-text: "Crafted with Care, Delivered with Pride"
- CTA button: "Explore Products" → links to `/products`

**Features section (3 columns):**
- Quality — "Each product crafted to perfection, meeting the highest standards of excellence"
- Innovation — "Always Ahead isn't just our slogan; it's our way of life"
- Trust — "Treating customers and suppliers as partners in progress"

**Products preview section:**
- Brief intro: "Customized Solutions for Every Industry"
- Show 3-4 product cards as a teaser
- CTA: "View All Products" → `/products`

**About snippet:**
- 2 columns: text left, image right (`worker-rolls.jpg`)
- Text: "Welcome to Aadinath Industries, a cornerstone in the re-rolling mills sector and a trusted trading partner in the metals industry. Rooted in a foundation of quality, innovation, and integrity, we have established ourselves as a beacon of reliability and trust."

**Quote/testimonial section:**
- Pull quote: "Always Ahead isn't just our slogan; it's our way of life. We constantly strive to innovate and improve, ensuring we offer the best solutions to our clients."
- Background: light gray or subtle pattern

### 2. About Us (`/about-us`)
- Hero banner with overlay text "About Us"
- Background: `hot-steel-pour.png`
- Mission statement
- Core values section (Quality, Innovation, Trust — with icons)
- "Our Core Values and Vision" section:
  - Customer satisfaction paragraph
  - Community & sustainability paragraph
- Image of worker (`worker-rolls.jpg`) alongside text

### 3. Products (`/products`)
- Hero with "Our Products" heading
- Intro: "From robust angle bars to precision-engineered bright bars, discover our diverse selection of metal products tailored to meet your specific industrial needs."
- **7 product cards in a grid (3 columns):**

  1. **MS Angle Bar** — Size Range: 20mm – 110mm — "Robust angles perfect for a variety of structural needs"
  2. **MS Flat Bar** — Size Range: 20×5mm – 100×50mm, 125×6mm – 150×25mm — "Versatile flat bars for applications demanding flat surfaces with high strength"
  3. **MS Round Bar** — Size Range: 8mm – 100mm — "Durable round bars ideal for construction, manufacturing, and engineering"
  4. **MS Square Bar** — Size Range: 8mm – 75mm — "Sturdy square bars offering reliability for general fabrication and repairs"
  5. **Bright Flat Bar** — Size Range: 16×5mm – 100×50mm, 125×10mm – 150×25mm — "Premium flat bars providing a clean finish for detailed work"
  6. **Bright Round Bar** — Size Range: 8mm – 100mm — "High-quality round bars offering a combination of toughness and finish"
  7. **Bright Square Bar** — Size Range: 8mm – 75mm — "Precision-engineered square bars known for their finish and strength"

- Each card: product name, size range, description, orange accent
- Bottom CTA: "Connect with us today" + phone + WhatsApp link

### 4. Contact Us (`/contact-us`)
- Hero with "Contact Us" heading
- Two-column layout:
  - **Left:** Contact details
    - Phone: +91 9825207616
    - Email: aditya.jain.aadinath@gmail.com
    - Works: Survey No. 44, Post: Vadia, Sihor Road, Vadia, Dist. Bhavnagar
    - Office: A-2, Hans Complex, Sanskar Mandal, Bhavnagar, 364002
  - **Right:** Embedded Google Map (iframe) for Bhavnagar location OR a simple "Find Us" card with address
- WhatsApp CTA button: "Chat with Us on WhatsApp" → `https://wa.me/919825207616`

### 5. Verify (`/verify`)
**IMPORTANT: Keep this page simple and clean — it's what customers see when scanning QR codes on products.**

- White background, centered layout
- AA logo at top
- Green checkmark icon (✅)
- Heading: "Verified Steel Product"
- Sub-heading: "Aadinath Industries"
- Text: "This product has been digitally verified by the manufacturer."
- Text: "You are viewing a verified MS Angle manufactured by Aadinath Industries."
- Quality checks (3 items with green checkmarks):
  - ✔ Weight Verified
  - ✔ Straightness Verified
  - ✔ Manufacturing Tolerances Controlled
- Divider
- Manufacturer info:
  - Manufacturer: Aadinath Industries
  - 📍 Bhavnagar, Gujarat
  - 📞 +91-9825207616
  - 🌐 aadinathindustries.in
- Note: "Each product is produced under controlled rolling conditions to ensure: Accurate dimensions, Controlled weight tolerance, Straightness and surface quality"
- **Feedback CTA at bottom:**
  - Text: "For bulk supply, dealership, export enquiries, or feedback, please contact us directly."
  - Button: "Contact on WhatsApp" → `https://wa.me/919825207616`

## Navigation (all pages)
- Sticky top nav bar
- Left: AA logo (links to home)
- Right: Home | Products | About Us | Contact Us
- Mobile: hamburger menu
- Nav background: white with subtle shadow
- Active page: orange underline or highlight

## Footer (all pages)
- Dark background (dark gray `#1a1a1b` or similar)
- 3 columns: About snippet + Quick Links + Contact info
- Bottom: Copyright "© 2024 Aadinath Industries. All Rights Reserved"
- WhatsApp floating button (bottom-right corner) on all pages → `https://wa.me/919825207616`

## General Design Notes
- Clean, professional, light theme
- Orange (`#F26522`) as primary accent color
- Rounded corners on cards
- Smooth hover transitions
- Good typography hierarchy
- Mobile responsive
- Use `next/image` for images with proper alt text
- No dark mode needed

## Project Setup
```bash
cd /home/adityajain/AIS/ais-website
npx create-next-app@latest . --typescript --tailwind --app --src-dir
# Images are already in public/images/
```
