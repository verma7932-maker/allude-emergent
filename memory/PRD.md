# ALLUDE INDIA — Premium Menswear Website (PRD)

## Original Problem Statement
Production-ready premium menswear brand + product CATALOGUE website for ALLUDE INDIA (est. 2020, tagline "Crafted for the Modern Gentleman", India only). Clean white-luxury editorial aesthetic. Categories ONLY: Formal Trousers, Casual Trousers, Shirts (NO suits/t-shirts, no Fabrics/Retail Partners/LFS). No cart/checkout/payments. Full owner-editable CMS. Dealer Enquiry B2B system + Contact form. SEO, performance, security, accessibility, responsive.

## Architecture
- **Backend**: FastAPI + MongoDB (motor). Modules: server.py, auth.py (JWT Bearer + bcrypt), models.py, storage.py (Emergent object storage for media), email_service.py (Emergent Resend, guardrail-gated), seed_data.py. All routes under `/api`.
- **Frontend**: React 19 + React Router 7 + Tailwind + shadcn + framer-motion. Public site (PublicLayout) + Admin CMS (`/admin`, JWT token in localStorage).
- **Fonts**: Playfair Display (wordmark), Cabinet Grotesk (display headings), Satoshi (body).
- **Brand assets**: Supplied ALLUDE logo processed into transparent black (`/allude-logo.png`) + white (`/allude-logo-white.png`) used across navbar/footer/admin. Supplied grey trouser → Formal, olive trouser → Casual served as same-origin static (`/products/*.png`).

## User Personas
- Premium end customers browsing the catalogue.
- Dealers / retailers / distributors submitting B2B enquiries.
- Brand owner/admin managing all content via CMS.

## Core Requirements (static)
- Only Formal Trousers, Casual Trousers, Shirts. No e-commerce actions.
- ALLUDE wordmark = supplied logo everywhere brand appears.
- White-background luxury editorial design, bold typography.
- Owner-editable homepage, products, categories, about, dealer enquiries, contact, media, social, SEO.

## Implemented (2026-08-23)
- Public pages: Home (13-section editorial sequence), Collections, Category, Product Detail (EXPLORE + CONTACT ALLUDE, no buy/cart), About, Dealer Enquiry (validated form + honeypot + success), Contact (form + Okhla address/phone/email), Privacy/Terms, 404.
- Admin CMS: Dashboard, Products CRUD, Categories CRUD + reorder, Homepage content, About, Dealer Enquiries (search/filter/status/detail/delete), Contact Messages, Media upload, Contact Info, Social Links, SEO settings. JWT-protected.
- Dealer & contact submissions stored + email notification to support@alludeindia.com (non-blocking).
- SEO: per-page meta via useSeo, static robots.txt + sitemap.xml, semantic HTML.
- Supplied logo + grey/green trouser images wired into brand + Formal/Casual categories & products.
- Tested via testing agent (backend 25/28 pytest, frontend all core flows). Fixed: 404 catch-all route, static robots/sitemap reachability, email error-body logging.

## Known Limitations
- Email notification to support@alludeindia.com may not deliver until that mailbox is verifiable (Resend returned undeliverable_recipient); submissions still save to admin. Error body now logged.
- No login brute-force lockout, no list pagination (minor; deferred).
- Native `<select>` used in some forms (functional).

## Backlog (P1/P2)
- P1: Brute-force lockout on login; pagination on list endpoints; 404 on delete of missing ids.
- P2: Replace native selects with shadcn Select; category delete referential guard; video hero support.

## Admin
- URL `/admin`, creds in `/app/memory/test_credentials.md`.
