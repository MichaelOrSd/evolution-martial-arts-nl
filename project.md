# Project Tracker

Living document for tracking the state, changes, roadmap, and notes for the Evolution Martial Arts NL website.

**Client:** Dru Hillyard
**Site:** https://evolutionmartialartsnl.com
**Hosting:** GitHub Pages (free, auto-deploys on push to `main`)
**Email:** evolutionmartialartsnl@gmail.com
**DNS:** Route 53 (Cloudflare account created but nameserver migration never completed)
**Costs:** $0/month

---

## Current State

- Single-page static site (~45 KB), images on AWS S3
- Contact form sends via EmailJS (no email client popup) — success/error feedback inline
- EmailJS: Service `service_uokvg25`, Template `template_oa28y43`, Public Key `ZmnXlTrec0ZBUsiNI`
- No analytics installed
- No phone number listed (commented out in HTML)

---

## TODO

### Blocked — Waiting on Dru

- [x] ~~**Confirm EmailJS delivery**~~ — Confirmed 2026-03-18, Dru received test email
- [x] ~~**Phone number**~~ — (709) 330-6894 added with click-to-call — 2026-03-18
- [ ] **Trust signals content** — 4 years in business confirmed. Still need: students trained, competition wins
- [ ] **Testimonials** — Dru collecting quotes at next class

### High Priority (no blockers)

- [ ] Add `rel="noopener"` to external links (Instagram link, line 424)
- [ ] Add JSON-LD structured data (LocalBusiness schema) for SEO
- [ ] Convert og-image.svg to PNG (1200x630px) — SVG doesn't render on Twitter/LinkedIn/iMessage

### Medium Priority

- [ ] Improve CTAs — add urgency to hero, add CTA after schedule section
- [ ] Collapsible schedule view on mobile
- [ ] Analytics (Plausible or Google Analytics)
- [ ] Performance — lazy loading images, WebP format on S3
- [ ] Accessibility audit (WAVE or axe DevTools, skip links, keyboard nav)

### Future / Nice to Have

- [ ] Cloudflare Email Routing for professional addresses (contact@, info@) — requires finishing nameserver migration
- [ ] Blog/content section for SEO
- [ ] Video content (class footage, coach intros)
- [ ] Member portal
- [ ] Success stories / before-after transformations

---

## Completed

- [x] Favicon with EVO branding — 2025-11-18
- [x] Fixed redundant alt text on instructor photo — 2025-11-18
- [x] Removed ~300 lines dead code (Events, Merchandise, Testimonials sections) — 2025-11-18
- [x] OG meta tags, page title, meta description for SEO — 2025-11-18
- [x] Back to Top button — 2025-11-18
- [x] Carousel touch/swipe gestures — 2025-11-18
- [x] Migrated hosting from AWS Amplify to GitHub Pages — 2025-11-18
- [x] Minified CSS/JS bundles — 2025-02-14
- [x] Branded 404.html page — 2025-02-14
- [x] Replaced Weebly template with handcrafted static site (872 KB → 45 KB) — 2025-10-10
- [x] Reverted broken EmailJS back to working mailto — 2026-02-17
- [x] Pre-filled template message moved into editable textarea — 2026-02-17
- [x] Added CLAUDE.md and project.md — 2026-02-17
- [x] Consolidated TODO.md + CHECKLIST.md into project.md — 2026-03-18
- [x] EmailJS integration — Gmail service connected, template created, form wired up with real credentials — 2026-03-18
- [x] EmailJS delivery confirmed by Dru — 2026-03-18
- [x] Deployed to production, HTTPS verified — 2026-03-18

---

## Deployment Checklist

Run through after major updates or pushes to `main`:

- [ ] Changes pushed to `main` branch
- [ ] GitHub Pages build completed successfully
- [ ] `https://evolutionmartialartsnl.com` loads over HTTPS with valid cert
- [ ] `https://www.evolutionmartialartsnl.com` redirects correctly
- [ ] No mixed-content warnings in dev tools
- [ ] Quick Lighthouse scan (Desktop + Mobile) — no major regressions
- [ ] `/missing-page` serves branded `404.html`
- [ ] All nav links work
- [ ] Contact form submits via EmailJS and email arrives in Gmail
- [ ] Mobile responsive design looks good on various screen sizes

---

## Notes

- Edit source CSS/JS files, then regenerate `.min.*` versions. No build tool — do it manually. HTML loads only minified files.
- Images hosted on S3 (`evolutionbjj.s3.ca-central-1.amazonaws.com`), not in the repo.
- Cloudflare account exists but nameservers were never switched from Route 53. This blocks email routing and CDN features.
- EmailJS free tier: 200 requests/month, resets Apr 17. 500 emails/day limit.
- EmailJS dashboard: dashboard.emailjs.com (logged in as Dru)
