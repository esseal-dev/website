# Esseal Website — Project Context

## What this is
Static marketing website for **Esseal** — a senior-led custom software engineering firm registered in England & Wales (No. 17026190), with offices in London (128 City Road, EC1V 2NX) and Lahore, Pakistan (114-A Gul E Daman Society). The firm does full-stack development, MVP creation, and legacy codebase modernisation for SMEs and enterprise clients.

## Tech stack
Pure static HTML + CSS + vanilla JS. No frameworks, no build tools, no npm. Deployed via Apache (`.htaccess` handles routing). The Inter font is self-hosted in `/fonts/` — no Google Fonts CDN. Three.js + Vanta.net are self-hosted for the hero animation on the homepage. No analytics, no tracking, no cookies — this is a deliberate privacy stance.

## File structure
```
/
├── index.html                  # Homepage
├── about.html
├── contact.html
├── expertise.html
├── privacy.html
├── terms-of-service.html
├── 404.html
├── styles.css                  # Single global stylesheet (all pages)
├── booking-modal.js            # Shared booking calendar modal + Slack webhook
├── .htaccess                   # Apache: HTTPS/www redirect, .html stripping, dir indexes
├── sitemap.xml
├── robots.txt                  # Explicitly allows all search + AI crawlers
├── llms.txt                    # AI crawler context file (markdown, esseal.co.uk/llms.txt)
├── fonts/                      # Self-hosted Inter woff2 (400/500/600/700)
├── services/
│   ├── index.html
│   ├── mvp-development.html
│   ├── legacy-codebase-upgrade-modernization.html
│   ├── fullstack-development.html
│   ├── backend-development.html
│   ├── frontend-development.html
│   ├── internal-tools-dashboards.html
│   └── product-development.html
├── products/
│   ├── index.html
│   ├── esseal-data-table.html
│   └── esseal-date-picker.html
├── blogs/
│   ├── index.html
│   └── [13 blog post HTML files]
└── social-card-*.webp          # OG images (1200×630): default, mvp, legacy, data-table, date-picker
```

## URL structure (.htaccess)
- `.html` extension is stripped on all pages (`/about` serves `about.html`)
- Directory indexes work without trailing-slash issues (`/services/` serves `services/index.html`)
- All absolute paths in nav/links use clean URLs — `/services/`, `/products/`, `/about`, etc.
- `privacy.html` and `terms-of-service.html` are `noindex` and excluded from `sitemap.xml`

## Navbar & footer (canonical, identical on all 33 pages)
```
Nav:  Services | Products | About | Let's Talk (→ /contact)
Footer cols: Brand+registration | Company (About/Services/Products/Blogs) | Legal | Most Requested Services
```
No active states in the nav — every page uses the exact same HTML block. The footer includes company registration number on every page.

## styles.css structure
- `@font-face` declarations at the top (self-hosted Inter)
- CSS custom properties (`--brand-orange: #fa6220`, `--bg-navy: #000621`, etc.)
- Global reset + base
- Navbar, buttons, hero, services grid, expertise, CTA section, footer
- Blog-specific styles
- Service page styles
- Product page styles
- **Project modal styles** (`.modal-overlay`, `.modal`, `.form-group`, etc.)
- **Booking modal styles** (`.booking-overlay`, `.booking-modal`, `.booking-layout`, `.booking-cal-col`, `.booking-slots-col`, `.booking-footer`, etc.)

## booking-modal.js
Shared self-contained script included on every page that has a scheduling button (13 pages). Auto-wires to any element with `data-open-booking` attribute on `DOMContentLoaded`.

**Features:**
- Calendly-style UI: month calendar on left, time slots on right
- User's timezone detected via `Intl.DateTimeFormat().resolvedOptions().timeZone` — displayed in subtitle and used for UTC conversion on submit
- 24 hourly slots (12:00 AM → 11:00 PM), 3-column grid, scrollable
- Past slots disabled when today is selected
- Mandatory email field in a persistent footer below the two-column layout
- On submit: converts local time to UTC, posts to Slack, closes modal
- **Mobile UX**: modal slides up as a bottom sheet; selecting a date hides the calendar and shows slots; a "← [date]" back button returns to the calendar; email + confirm always pinned at the bottom

**Slack integration:**
- Webhook: `https://hooks.slack.com/services/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`
- Sent as `application/x-www-form-urlencoded` with `payload=` field + `mode: no-cors` (avoids CORS preflight which Slack webhooks don't support)
- Payload includes: email, full date, local time + timezone, UTC time, source page URL

## Project enquiry modal (index.html only)
Triggered by "Start Your Project" button in the hero. Inline script in `index.html`. Fields: Name (required), Email (required + format validation), Company (optional), Project Description (required, min 20 chars). Uses `window.postToSlack` exposed by `booking-modal.js`. Slack message includes: name, email, company, description, source URL.

## Scheduling buttons (data-open-booking)
All "Schedule a..." CTAs across the site are `<button type="button" data-open-booking>` elements — they replaced both the original `href="#contact"` anchor tags and the Calendly placeholder links (`calendly.com/your-booking-link`). `booking-modal.js` is added via `<script src="/booking-modal.js" defer></script>` on every page that has one of these buttons.

## SEO / GEO setup (all indexable pages)
- `<meta name="description">`, canonical `<link>`, `<title>` — all unique per page
- Open Graph: `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (social card webp)
- Twitter card: `twitter:card summary_large_image`, matching title/description/image
- GEO tags: `geo.region GB-ENG`, `geo.placename London, England`, `geo.position 51.5074;-0.1278`, `ICBM`
- JSON-LD structured data per page type:
  - Homepage: `ProfessionalService` + `WebSite` with `SearchAction`
  - Service pages: `Service` schema
  - Product pages: `SoftwareApplication` + `FAQPage`
  - Blog posts: `BlogPosting`
  - All pages: `BreadcrumbList`
- Social card images: `social-card-default.webp` (most pages), `social-card-mvp.webp` (MVP service), `social-card-legacy.webp` (legacy service), `social-card-data-table.webp`, `social-card-date-picker.webp`

## Privacy stance
- No Google Analytics, no tracking pixels, no cookies
- No external font CDN — Inter served from `/fonts/`
- No external JS CDNs on the main site (Three.js and Vanta.js are local files)
- Exception: `esseal-date-picker.html` loads the EssealDatePicker library from `cdn.jsdelivr.net` for its live demo — this is intentional (demonstrating npm package usage)
- The Slack webhook URL is in client-side JS (visible in source) — acceptable risk for a webhook

## Open source products
- **Esseal DataTable** — virtualized React data grid, pure Vanilla CSS, zero deps, MIT licensed. Page: `/products/esseal-data-table`
- **EssealDatePicker** — zero-dep JS date picker, under 5kb gzipped, date range support, framework-agnostic, MIT licensed. Page: `/products/esseal-date-picker`

## Key conventions to maintain
- All paths are absolute (`/about`, `/services/`, `/products/`) — never relative
- No `active` class on nav links — the canonical nav block is identical on every page
- All new pages need: geo tags, OG tags, twitter card, canonical link, JSON-LD BreadcrumbList, and a `<link rel="stylesheet" href="/styles.css">` — check existing pages for the exact pattern
- Any new scheduling CTA should be `<button type="button" class="btn-primary" data-open-booking>` with `booking-modal.js` included on that page
- `styles.css` is the single source of truth for all styling — no inline styles or page-specific stylesheets
- `sitemap.xml` should not include `noindex` pages (privacy, terms)
