# Project Tracker

Living document for tracking the state, changes, roadmap, and notes for the Evolution Martial Arts NL website.

**Clients:** Dru Hillyard & Ashley Hillyard (co-owners) — Ashley cell: (709) 687-9382, no personal email on file (reach via gym inbox)
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
- Phone: (709) 330-6894 with click-to-call
- Schedule: 7 days/week (Mon–Sun), displayed in 4-column grid with CTA card
- Women's Jiu-Jitsu on break until September 2026 (removed from Friday schedule; plan still listed in Membership)
- Women's Kickboxing (renamed from "Women's Cardio Kickboxing") runs Saturdays 10–11 AM
- Design critique baseline (2026-07-23): 23/40 — snapshot in `.impeccable/critique/`
- Client self-editing via Pages CMS (app.pagescms.org): programs/schedule/belts/pricing live in `content/*.json`, built + deployed by GitHub Actions (`scripts/build.js` → `dist/`). See EDITING.md (client guide) and CLAUDE.md.

---

## TODO

### Blocked — Waiting on Dru / Ashley

- [x] ~~**Confirm EmailJS delivery**~~ — Confirmed 2026-03-18, Dru received test email
- [x] ~~**Phone number**~~ — (709) 330-6894 added with click-to-call — 2026-03-18
- [ ] **Trust signals content** — 4 years in business confirmed. Still need: students trained, competition wins
- [ ] **Testimonials** — Dru collecting quotes at next class
- [ ] **Confirm 2026-07-23 changes** — email sent to gym inbox from michaeloreilly@me.com; awaiting Ashley's reply (mail watch running). Covers:
  - Women's Kickboxing Saturday class length (assumed 10–11 AM, 1 hour)
  - Women's Kickboxing price still shows $138/6-week program — switch to monthly rate if now ongoing?
  - Add "resumes in September" note to Women's Only All Skills plan?
  - Merch price list — send if they want merch pricing on the site
  - Belt roster promotions + confirm "Jame Rowe" spelling (likely "James")
- [ ] **Add Ashley's personal email to Contacts** when she replies
- [ ] **Real photos for the site** (deferred 2026-07-23 — none available yet). Shot list: hero shot of a live class; one photo per program card (kids and women's classes at minimum); gym-interior shot near the contact form. S3 bucket already set up.

### Site Review Backlog (from 2026-07-23 critique, baseline 23/40)

- [ ] **P0 — Harden contact form**: submit listener only attaches if EmailJS CDN loads; blocked CDN = silent page reload, typed message lost. Attach listener unconditionally, try/catch init, show fallback error. Also add maxlengths; stop post-success JS re-filling the template text.
- [ ] **P1 — Women's/kids program cards**: Women's Kickboxing, Women's Jiu-Jitsu, Kids Wrestling missing from Programs carousel (exist in schedule/pricing/dropdown). Consider Adults / Kids / Women structure. Unify class naming across sections; explain "Randori"/"Open Mat", Gi vs No-Gi.
- [ ] **P1 — Pricing section**: use existing unused `.pricing` grid CSS on desktop, add "Start with a free class" CTA (`.pricing-card__cta` CSS already exists) to every plan card, preselect program in the form.
- [ ] **P2 — Mobile/a11y**: carousel card min-height (content spills on short viewports), arrows overlap card text at 390px, 12px dots → 44px targets, keyboard support for schedule accordion, fix aria-hidden map iframe, skip link → `<main>`.
- [ ] **Minor**: "Jame Rowe" typo (pending Ashley), "over 15+ years" and bio copy trims, ~30% dead CSS in site.css, empty `<li>` slots in schedule, hero mailto ribbon competes with CTA, dots use `aria-pressed` instead of pagination semantics.
- [ ] **Review EMAILJS-CREDENTIALS.md** — committed to a public repo; EmailJS public keys are meant to be public but file should be reviewed/possibly removed.

### High Priority (no blockers)

- [ ] **CMS go-live steps** (after merging `feat/cms` to `main`):
  1. Repo Settings → Pages → Source: **GitHub Actions** (was "Deploy from a branch") — do this right after the first successful Action run
  2. Verify live site unchanged, custom domain resolves, `/missing-page` → 404
  3. Sign in at app.pagescms.org with GitHub, open the repo, confirm all four collections render, do a round-trip test edit
  4. Invite Dru & Ashley by email (Ashley's personal email still pending — see Blocked). Optional: enable `settings.commit.identity: user` in `.pages.yml` to attribute commits to them (puts their name/email in public commit metadata — ask first)
  5. Send them EDITING.md

### Medium Priority

- [x] ~~Improve hero CTA~~ — done 2026-03-19
- [x] ~~Collapsible schedule view on mobile~~ — done 2026-03-19
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
- [x] Phone number added with click-to-call — 2026-03-18
- [x] Added `rel="noopener"` to external links — 2026-03-18
- [x] Added JSON-LD structured data (MartialArtsSchool schema) for SEO — 2026-03-18
- [x] Converted og-image.svg to PNG (1200x630) for social sharing — 2026-03-18
- [x] Created llms.txt for AI crawlers — 2026-03-18
- [x] Updated schedule: added Friday (Kids Wrestling, Women's BJJ), Saturday Kids 4–8 9 AM, removed Tuesday Women's — 2026-03-19
- [x] Schedule grid redesigned: 4-column layout, removed empty placeholders, added yellow CTA card — 2026-03-19
- [x] Collapsible mobile schedule, skip link, hero CTA update — 2026-03-19
- [x] Accessibility fixes from audit — 2026-03-19
- [x] Schedule CTA button text visibility fix — 2026-04-07
- [x] Renamed "Women's Cardio Kickboxing" → "Women's Kickboxing" (Courtney's copy, superseded same day by Ashley's) — 2026-07-23
- [x] Women's Kickboxing card copy replaced with Ashley's Dutch-style description — 2026-07-23
- [x] Added Women's Kickboxing: Saturday 10–11 AM schedule slot, JSON-LD offer, contact dropdown option, llms.txt — 2026-07-23
- [x] Removed Women's Jiu-Jitsu from Friday schedule (on break until September) — 2026-07-23
- [x] Full design critique run (dual-agent, headless-browser inspection + detector) — baseline 23/40, backlog captured above — 2026-07-23
- [x] Emailed owners (gym inbox) to confirm changes, request merch price list + belt roster review — 2026-07-23

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
