# Case Study Research Notes

> This file logs everything gathered per project so sessions can pause/resume without re-doing research.
> Status key: 🔴 Not started | 🟡 Questions asked / in progress | 🟢 Ready to write

---

## Projects Overview

## Session Checkpoint — 2026-03-28

**Last action:** All 9 case studies complete (HTML + copy + SEO).
**Resume from:** Index page, sitemap updates, footer "Case Studies" link, homepage section.

---

| Project | Type | Research | Copy | HTML |
|---|---|---|---|---|
| Buddy | Flutter MVP — location app | 🟢 | 🟢 | 🟢 |
| Tixters | Event mgmt & ticketing platform | 🟢 | 🟢 | 🟢 |
| Overwatch | Construction mgmt SaaS | 🟢 | 🟢 | 🟢 |
| Dentistry Dashboard | Dental practice SaaS | 🟢 | 🟢 | 🟢 |
| Authentic Influencers | Influencer marketing platform | 🟢 | 🔴 | 🔴 |
| DNG Transport | Logistics/freight | 🟢 | 🔴 | 🔴 |
| Lokelani Essentials | Natural skincare e-commerce | 🟢 | 🔴 | 🔴 |
| Drive NASA | Motorsports org — overflow dev support | 🟢 | 🔴 | 🔴 |
| Piers Laine | In-home nail service | 🟢 | 🔴 | 🔴 |

---

## 1. Buddy

### What I know from the codebase
- Flutter (Dart) Android app
- App title: "Buddy Se Poocho" (Urdu: "Ask Buddy")
- Location-based directory of local shops/vendors in Lahore, Pakistan
- Features: geolocation, search, open/closed status, distance calculation, one-tap Google Maps navigation
- All locations hardcoded (static list of 25 local food/service vendors)
- MVP/prototype level — single screen, no auth, no backend
- Dependencies: `geolocator`, `url_launcher`, `flutter_launcher_icons`

### Questions to ask
- [ ] What was the client's business/context?
- [ ] What problem were they trying to solve?
- [ ] Was this a prototype, MVP, or full product?
- [ ] Did it go live / get published to app stores?
- [ ] What was the outcome — did it help the client?
- [ ] Any scale indicators (users, downloads, locations served)?
- [ ] Anonymise or name the client?
- [ ] Which Esseal service does this map to?

### Answers from client
- **Client:** Anonymous individual with a pre-seed idea
- **Product:** Local business discovery app in Pakistan targeting informal/unregistered businesses not on Google Maps (cobblers, tyre puncture shops, ad hoc petrol stations, cigarette shops, food stalls)
- **Unique mechanic:** When a user navigates to a business and comes within 100m, the vendor portal pings the business owner that a customer found them via Buddy
- **Esseal's scope:** Built MVP (user app confirmed in Flutter). Vendor portal existence confirmed — stack TBC
- **Outcome:** MVP cleared pre-seed round → secured $80k funding
- **Status:** Closed beta; seed + Series A rounds planned for 2026
- **Timeline:** TBC
- **Anonymise:** Yes
- **Service mapping:** MVP Development

### Open questions
- [x] Was the vendor portal also built by Esseal? Yes — Flutter mobile app (same stack as user app)
- [x] Backend: Ruby on Rails
- [x] Timeline: 5 weeks, 3 iterations, final iteration presented at pre-seed round

---

## 2. Tixters

### What I know from the codebase
- Multi-app event management & ticketing platform
- Apps in the repo:
  - `backend/` — Rails 7 API, PostgreSQL (Gemfile: rails ~7.2.2, pg)
  - `organiser/` ("axent") — React 18 + Vite + MUI 7 + Apollo/GraphQL + React Router
  - `ax-check-in-manager/` — React + MUI + QR code scanner (`html5-qrcode`), JWT auth
  - `ax-admin/` — admin dashboard
  - `react-seatmap-creator/` — interactive venue/seat map builder
  - `marketing/` — marketing site
- GraphQL API
- Tailwind CSS on backend views
- Multi-role platform: organiser, check-in staff, admin

### Questions to ask
- [ ] What does Tixters do as a product?
- [ ] Who is the client — a startup building this product?
- [ ] What was Esseal's scope? Build from scratch or extend existing?
- [ ] Is it live? URL?
- [ ] Scale: events hosted, tickets sold, active organisers?
- [ ] Interesting technical challenges solved?
- [ ] Anonymise or name the client?
- [ ] Which Esseal service does this map to?

### Answers from client
- **Client:** Anonymous US-based event organiser
- **Origin:** Started as internal tooling, pivoted to a full competitor platform by week 5
- **Before Tixters:** Using Ticketmaster, VBO Tickets, Eventbrite — pain points: high commissions, outdated/complex UI, hard to remember navigation
- **Esseal's scope:** Full build from scratch
  - Phase 1: Organiser dashboard
  - Phase 2: Venue/seat map builder
  - Phase 3 (post-pivot, wk 5): Admin dashboard, check-in manager, marketing site (ticket sales)
- **Tech stack:**
  - Backend: Ruby on Rails
  - Frontend: React (all dashboards)
  - Venue builder: Vanilla JS from scratch
  - Marketing/ticket sales site: Ruby on Rails SSR
  - Hosting: DigitalOcean
  - CDN: Cloudflare
  - Ticketing emails: Twilio
  - API: GraphQL
- **Live:** Yes, since November 2025
- **Scale:** 12 events hosted, 5,000+ tickets sold, 8 venues onboarded (client hosting their own events currently)
- **Key technical challenges:**
  1. Seat map builder — simple enough for a non-technical 50-year-old organiser, yet powerful enough for complex layouts
  2. Analytics — seat heatmaps (which seats sell out fastest), user segmentation, ticket/event stats — all presented with extreme simplicity
- **Anonymise:** Yes
- **Service mapping:** Full-stack Development / Product Development

### Open questions
*(none)*

---

## 3. Overwatch

### What I know from the codebase
- Full-stack construction project management & NEC contract platform
- Monorepo (Yarn Workspaces):
  - `backend/` — Rails 7 API-only, PostgreSQL, GraphQL (graphql-ruby), FusionAuth (OAuth/JWT), CanCanCan (RBAC), GoodJob (background jobs), Redis, ActiveStorage (S3)
  - `manager-dashboard/` — Admin/manager UI (React 18, TS, Vite, Apollo, MUI 7, RxJS) — Port 3000
  - `report-dashboard/` — Reports & analytics — Port 3001
  - `scheduler-dashboard/` — Resource scheduling (personnel, equipment, subcontractors) — Port 3003
  - `shared-components/` — Shared React component library
  - `graphql/` — 160+ types, 166+ mutations, 118+ queries
- Key domain: Projects, CompanyResources (humans/equipment/subcontractors), Schedules (conflict detection), Events, Reports, Kick-offs, NEC notices
- Real-time via ActionCable WebSockets
- Background jobs: email reminders, kick-off notifications, weekly summaries

### Questions to ask
- [ ] Who is the client? Construction company? SaaS startup?
- [ ] What was their situation before Overwatch?
- [ ] What was Esseal's scope? Full build from scratch?
- [ ] Is it live in production? How many projects/users?
- [ ] What specific pain points did it solve?
- [ ] Interesting technical challenges (conflict detection, NEC compliance, etc.)?
- [ ] Anonymise or name the client?
- [ ] Which Esseal service does this map to?

### Answers from client
- **Client:** Anonymous UK national, owner of two commercial construction companies + one consultation company
- **Esseal's engagement:** Full-service — coding, product development, deployments, DevOps, QA, everything. Longest-running project.
- **Before Overwatch:** Hundreds of Excel sheets + email chains — no structured system
- **Esseal's scope:** Full build from scratch. Client showed his sheets, explained pain points; Esseal proposed and led the entire product development process
- **Live:** Yes, across all three of client's companies
- **Scale:** 700+ commercial construction projects (68 active, rest backfilled from prior years), managing £40–60M worth of projects
- **Key pain points:**
  1. **NEC compliance:** Required reading entire email chains for context, sorting through dozens of files to find the latest version referencing a specific topic
  2. **Scheduling conflicts:** Excel took a long time to process when checking conflicts on schedules made months in advance; still missed conflicts due to spelling differences and minor discrepancies
- **Key technical challenges:**
  1. Translating ancient Excel/mental workflows into a coherent SaaS product
  2. Extreme simplicity for a low-tech client base (client's view: "if it's confusing, no one will use it")
- **AI-powered:** Contract creation, estimation quotes, and scheduling are all AI-assisted. Localised AI makes suggestions for scheduling, pricing, and predicts future events based on project data.
- **Roadmap:** Launching as a commercial SaaS product Q4 2026
- **Anonymise:** Yes
- **Service mapping:** Full-stack Development / Product Development / Legacy Modernisation

### Open questions
*(none)*

---

## 4. Dentistry Dashboard

### What I know from the codebase/FAQ
- SaaS platform for dental practices (UK-focused, also USD pricing)
- Live at: dentistrydashboard.com and me.dentistrydashboard.com
- Stack: Laravel backend + Next.js frontend (deployed on DigitalOcean via Docker)
- Features:
  - AI Notes (£35/user/month) — AI-assisted clinical note generation
  - AI Chatbot (£99/practice/month) — embeddable practice chatbot
  - Practice boards & checklists/logs
  - Dental team rota management
  - Lab work tracker
  - Time-off request system
  - CPD (continuing professional development) requirements portal
  - AI Board Advisor
- Stripe subscriptions (multiple tiers)
- Mailgun for transactional email
- Referral system
- Multi-role: dentists, nurses, technicians, managers, receptionists
- Pricing: £99/practice/month flat or £7.99/user/month pro-rata

### Questions to ask
- [ ] Who is the client? Did they come with a concept or existing product?
- [ ] What was Esseal's scope — full build or specific features?
- [ ] Current scale: practices signed up, active users?
- [ ] Which features did Esseal specifically build?
- [ ] What were the key technical challenges?
- [ ] Anonymise or name the client?
- [ ] Which Esseal service does this map to?

### Answers from client
- **Client:** UK dentist — came with a fully functional live vibe-coded app already in production with 5–10 users
- **Esseal's scope:** Codebase cleanup, build fixes, structural fixes, stabilisation, production-readiness. Also built: Stripe integration, Meta integration, full signup flow, HIPAA & GDPR compliance. Deployed proper CI/CD pipelines. Now on a maintenance retainer (bug fixes + security patches).
- **Scale:** 15 practices onboarded and active
- **Features Esseal built:** Meta integration, Stripe integration, entire signup flow, HIPAA & GDPR compliance
- **Key technical challenge:** Cleaning up a poorly vibe-coded app while keeping it stable for live practices with real patient data — zero downtime tolerance on the backend
- **Anonymise:** No — client is fine being named
- **Service mapping:** MVP Development, Product Development, Legacy Codebase Modernisation (cleanup challenges were analogous)

---

## 5. Authentic Influencers

### What I know from the codebase
- Influencer marketing platform (staging zip from Jan 2023)
- Stack: Rails backend + React frontends
- Three separate apps: brand dashboard, influencer dashboard, admin dashboard
- Multi-lingual UI (EN/DE/FR flags in assets)
- Features inferred: influencer discovery, campaign management, orders/shipping notifications, analytics, blog, package management

### Answers from client
- **Client:** Anonymous — executive at a UK marketing agency
- **Product:** "Upwork for influencers" — brands post campaigns, vetted influencers apply, both parties negotiate, finalize a contract, and payment flows through the platform
- **Before:** Brands manually scouting Instagram, cold DMs, informal arrangements with no contracts or structure
- **Esseal's scope:** Client had a broken Laravel alpha with only account + campaign creation. Esseal rebuilt the entire platform from scratch in Rails + React, adding: gallery, contracts, messaging, analytics, social media integrations, payments
- **Live:** Yes — 100 brands, ~2,200 influencers across multiple niches
- **Outcome:** Platform was acquired by a larger player in the industry. Esseal was not retained post-acquisition.
- **Anonymise:** Yes
- **Service mapping:** Product Development, Full-stack Development

---

## 6. DNG Transport

### What I know from the website
- US freight/logistics company
- Services: LTL/FTL, expedited, drayage, crossdocking, transloading, warehousing
- Locations: Rahway NJ, Dallas TX, Memphis TN
- 50,000+ sq ft warehouse capacity
- Site uses jQuery + datepicker for quote requests

### Answers from client
- **Client:** DNG Transport (named) — US freight/logistics, Rahway NJ
- **The problem:** DNG used a third-party fleet tracker (mytracker.trackersystems.net) to locate trucks, but it had no concept of which shipment was in which truck — that was a separate manual Excel sheet. When customers called to ask where their shipment was, staff would: put them on hold → check the Excel sheet for the truck number → log into mytracker → look up the truck → relay the location. Entirely manual, every time.
- **What Esseal built:**
  1. **Internal dashboard** — DNG staff log tracking IDs → shipments → truck assignments. Dashboard periodically polls the mytracker API for live truck locations and stores them in Firebase. Now the system always knows: shipment X is in truck Y, which is at location Z.
  2. **Customer-facing tracking page** — added to the DNG website. Customer enters their tracking number, form queries the dashboard, truck's live location is shown on the page. Zero staff involvement.
- **Outcome:** Fully automated shipment tracking — no human intervention needed for customer queries. WhatsApp bot in progress so customers won't even need to visit the site.
- **Anonymise:** No — name the client
- **Service mapping:** Full-stack Development, Internal Tools & Dashboards

---

## 7. Lokelani Essentials

### What I know from the website
- Natural/plant-based skincare brand
- Shopify store (USD, US market + wholesale)
- Loyalty program, referral program, wishlist, gift cards
- B2B wholesale operations
- Sustainability focus (agroforestry, syntropic farming)

### Answers from client
- **Client:** Lokelani Essentials (named) — natural skincare brand, US market
- **What Esseal built:** Custom Shopify theme development
- **The problem:** New to Shopify, struggling to configure things for their specific use case. Hit Shopify's hard limit on product variants — couldn't represent their product range within native Shopify constraints.
- **Outcome:** All issues resolved. Collaborated with TriSoul Digital (trisouldigital.com) on SEO and marketing. Client now averages $35–40k/month in sales.
- **Anonymise:** No — name the client, acknowledge TriSoul Digital collaboration
- **Service mapping:** Frontend Development

---

## 8. Drive NASA

### What I know
- Website returned 403 (access denied) — couldn't fetch
- Unknown what this business does

### Answers from client
- **Client:** Anonymous — a well-established US amateur motorsports organisation (HPDE, time trial, road racing, endurance, autocross). Has its own in-house dev team managing a full backend system (admin panels, organiser panels, ticketing, event management, etc.)
- **Esseal's role:** Overflow/capacity support — Esseal steps in when workload exceeds the in-house team's bandwidth. No fixed scope; project-by-project basis.
- **The problem:** Not a dysfunction — purely a capacity issue. The client's team is capable but sometimes stretched.
- **Outcome:** Client is happy. The standout feedback: Esseal drops into an unfamiliar codebase, no handholding required, navigates it like they already know the system. Client said it felt like having an extension of his own team.
- **Anonymise:** Yes
- **Service mapping:** Full-stack Development

---

## 9. Piers Laine

### What I know from the website
- In-home manicure & pedicure service, NYC area (Manhattan, Brooklyn, Queens, Jersey City, Hoboken, Weehawken)
- Booking system at book.pierslaine.com
- Corporate clients: Extell Development, Veris, Silverman Properties
- Prices: $35-$111 depending on service
- Site: WordPress + Astra + Elementor

### Answers from client
- **Client:** Anonymous — in-home manicure & pedicure service, NYC area
- **What Esseal built:** Full booking system from scratch
- **Before:** Bookings submitted via a form, saved to an Excel sheet, handled manually
- **Outcome:** Fully automated end-to-end booking system — think Uber but for at-home spa sessions. Customer books, system handles the rest.
- **Anonymise:** Yes
- **Service mapping:** Product Development, Full-stack Development

---

## Case Study Writing Status

| Project | Research | Copy | HTML | Published |
|---|---|---|---|---|
| Buddy | 🟢 | 🟢 | 🟢 | 🔴 |
| Tixters | 🟢 | 🟢 | 🟢 | 🔴 |
| Overwatch | 🟢 | 🟢 | 🟢 | 🔴 |
| Dentistry Dashboard | 🟢 | 🟢 | 🟢 | 🔴 |
| Authentic Influencers | 🟢 | 🟢 | 🟢 | 🔴 |
| DNG Transport | 🟢 | 🟢 | 🟢 | 🔴 |
| Lokelani Essentials | 🟢 | 🟢 | 🟢 | 🔴 |
| Drive NASA | 🟢 | 🟢 | 🟢 | 🔴 |
| Piers Laine | 🟢 | 🟢 | 🟢 | 🔴 |
