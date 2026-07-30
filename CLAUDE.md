# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing website for Evolution Martial Arts NL, a martial arts academy in St. John's, Newfoundland. Pure HTML/CSS/JavaScript — no frameworks, no build tools, no package manager.

**Live site:** https://evolutionmartialartsnl.com
**GitHub Pages URL:** https://michaelorsd.github.io/evolution-martial-arts-nl/

## Local Development

For CSS/JS work, serving the repo root still works (`python -m http.server 8080`) because `index.html` keeps real content between the BUILD markers as a fallback.

To preview exactly what deploys (content generated from `content/*.json`):

```bash
node scripts/build.js
python3 -m http.server 8080 --directory dist
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`: it runs `node scripts/build.js` (zero dependencies) and deploys `dist/` via GitHub Pages Actions. The build injects `content/*.json` into `index.html` (between `<!-- BUILD:* -->` markers), regenerates the Programs/Schedule/Membership sections of `llms.txt`, and regenerates the JSON-LD block. If content validation fails, the deploy is skipped (previous version stays live) and an issue is opened automatically. Custom domain configured via `CNAME` file (copied into `dist/`). DNS is on Route 53 (Cloudflare account exists but nameservers were never migrated).

## Client Content Editing (Pages CMS)

Dru & Ashley edit programs, schedule, belt roster, and pricing themselves via https://app.pagescms.org (invited by email — no GitHub accounts). `.pages.yml` defines the editing forms; `EDITING.md` is their cheat sheet. Their saves commit to `main` and auto-deploy in ~1–2 minutes.

**IMPORTANT:** Content for programs, schedule, team/belts, and memberships lives in `content/*.json` — edit those files, never the generated zones of `index.html` (between `<!-- BUILD:* -->` markers) or the mirrored sections of `llms.txt`. The committed HTML between markers is a fallback snapshot and may lag behind live content. `content/site.json` holds dev-curated SEO data (JSON-LD offers, llms.txt program lines) and is hidden from the CMS. If you rename a JSON key, update `.pages.yml` and `scripts/build.js` together.

## Architecture

Single-page site (`index.html`) with sections: Hero, Programs carousel, Schedule, Team, Membership carousel, Contact form, Footer. Programs, schedule, team/belts, and membership content lives in `content/*.json` and is injected into `index.html` at deploy time by `scripts/build.js` (see Client Content Editing below); everything else is authored directly in the HTML.

**CSS** (`assets/css/`): Two stylesheets — `site.css` (main layout/design system) and `programs-carousel.css` (carousel component). Each has a `.min.css` production version. Production HTML references the minified versions.

**JS** (`assets/js/`): Two scripts — `site.js` (navigation toggle, Intersection Observer fade-ins, back-to-top button, year injection) and `programs-carousel.js` (carousel with touch/swipe, dot navigation, responsive items-per-view via CSS variables). Each has a `.min.js` production version. Production HTML references the minified versions.

**EmailJS** integration is inline in `index.html` (bottom) with live credentials. See `SETUP-EMAIL.md` and `EMAILJS-CREDENTIALS.md` for setup details.

**SEO:** JSON-LD structured data (`MartialArtsSchool` schema) is inline in the `<head>` of `index.html`. OG meta tags and `llms.txt` (AI crawler info) are also present.

**Project state:** `project.md` is the canonical tracker — current state, TODO, completed items, deployment checklist, and operational notes (EmailJS limits, DNS status, etc.).

## Key Conventions

- **CSS custom properties** define the design system in `:root` — colors (`--color-primary`, `--color-accent: #f5c518`, etc.), carousel config (`--carousel-items`, `--carousel-gap`)
- **Typography:** Oswald for headings/brand, Lato for body (loaded via Google Fonts)
- **JS hooks use `data-*` attributes** (e.g., `data-carousel`, `data-carousel-track`, `data-carousel-prev`) — not CSS classes
- **BEM-inspired CSS naming** for components (e.g., `.card__header`, `.pricing-card--highlight`, `.carousel-arrow--prev`)
- **Mobile-first responsive design** with primary breakpoint at 960px; carousel breakpoints at 600px and 1024px
- **Accessibility:** semantic HTML, ARIA labels, `aria-expanded` on nav toggle, `.sr-only` class, `prefers-reduced-motion` respected
- **Images hosted externally** on AWS S3 (`evolutionbjj.s3.ca-central-1.amazonaws.com`), not in the repo

## When Editing

Both source and minified versions of CSS/JS exist. Edit the source files (`site.css`, `site.js`, `programs-carousel.css`, `programs-carousel.js`), then regenerate the minified versions. The HTML loads only the `.min.*` files in production.

There is no build tool or minifier installed. When updating source files, manually produce the `.min.css` / `.min.js` counterparts (strip comments, collapse whitespace). The JS source map (`site.min.js.map`) should also be updated if `site.js` changes.

A `404.html` page exists at the repo root for GitHub Pages 404 handling.

## External Dependencies

- Google Fonts (Lato, Oswald)
- EmailJS via CDN (`cdn.jsdelivr.net/npm/@emailjs/browser@4`)
- Google Maps embed (contact section)
- AWS S3 (instructor photos)
