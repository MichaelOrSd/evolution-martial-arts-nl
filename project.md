# Project Tracker

Living document for tracking the state, changes, and roadmap of the Evolution Martial Arts NL website.

**Client:** Dru Hillyard
**Site:** https://evolutionmartialartsnl.com
**Hosting:** GitHub Pages (free, auto-deploys on push to `main`)
**Email:** evolutionmartialartsnl@gmail.com

---

## Current State

- Contact form uses `mailto:` — opens user's email client with details pre-filled to evolutionmartialartsnl@gmail.com
- Site is a single-page static site (~45 KB total), images hosted on AWS S3
- DNS managed via Route 53, domain pointed at GitHub Pages
- Cloudflare account created but nameserver migration not completed
- All hosting costs: $0/month

---

## Change Log

### 2026-02-17
- Reverted contact form from broken EmailJS (unconfigured placeholder credentials) back to working `mailto:` approach
- Moved pre-filled template message into editable textarea so users can modify before sending
- Added CLAUDE.md for Claude Code context
- Added project.md for ongoing tracking
- Started EmailJS setup (free tier) — see blocked item below

### 2025-11-18
- Migrated hosting from AWS Amplify to GitHub Pages
- Added favicon with EVO branding
- Fixed redundant alt text on instructor photo
- Improved SEO: page title, meta description, OG tags
- Added Back to Top button (appears after 300px scroll)
- Added carousel touch/swipe gestures
- Removed ~300 lines of dead code (commented-out Events, Merchandise, Testimonials sections)
- Created email setup guides (SETUP-EMAIL.md, EMAILJS-CREDENTIALS.md)
- Implemented EmailJS contact form (later reverted 2026-02-17)

### 2025-02-14
- Added minified carousel CSS/JS bundles
- Added branded 404.html page

### 2025-10-10
- Replaced Weebly template with handcrafted static site
- Rebuilt hero as CSS gradients (no binary assets)
- Reduced site from 872 KB to 45 KB

---

## TODO

### Blocked — Waiting on Dru
- [ ] **EmailJS setup** — Account created, Gmail service started (Service ID: `service_3mu8g0c`). Dru needs to click **Connect Account** in the EmailJS dashboard to authorize his Gmail via OAuth. Once connected:
  1. Click **Create Service**
  2. Create an email template (see template fields below)
  3. Get Template ID and Public Key from the dashboard
  4. Pass all 3 credentials so we can wire them into the site code
  - **Template fields to use:** `{{from_name}}`, `{{reply_to}}`, `{{program}}`, `{{message}}`

### High Priority
- [ ] Add phone number with click-to-call for mobile
- [ ] Add JSON-LD structured data (LocalBusiness schema) for SEO
- [ ] Add `rel="noopener"` to external links
- [ ] Convert og-image.svg to PNG (1200x630px) for broader social platform support

### Medium Priority
- [ ] Add trust signals (years operating, student count, competition wins)
- [ ] Add real testimonials
- [ ] Improve CTAs — add urgency to hero, add CTA after schedule section
- [ ] Collapsible schedule view on mobile
- [ ] Analytics (Google Analytics or privacy-friendly alternative like Plausible)

### Future / Nice to Have
- [ ] Cloudflare Email Routing for professional email addresses (contact@, info@)
- [ ] Blog/content section for SEO and community engagement
- [ ] Video content (class footage, coach intros)
- [ ] Member portal
- [ ] Success stories / before-after transformations

---

## Notes

- Edit source CSS/JS files, then regenerate minified versions. Production HTML loads only `.min.*` files.
- Images are hosted on S3 (`evolutionbjj.s3.ca-central-1.amazonaws.com`), not in the repo.
- See CHECKLIST.md for post-deployment verification steps.
