# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing website for Evolution Martial Arts NL, a martial arts academy in St. John's, Newfoundland. Pure HTML/CSS/JavaScript — no frameworks, no build tools, no package manager.

**Live site:** https://evolutionmartialartsnl.com

## Local Development

No build step required. Serve files with any static server:

```bash
python -m http.server 8080
```

Then visit http://localhost:8080.

## Deployment

GitHub Pages deploys automatically on push to `main`. No build step — files are served directly from the repo root. Custom domain configured via `CNAME` file.

## Architecture

Single-page site (`index.html`) with sections: Hero, Programs carousel, Schedule, Team, Membership carousel, Contact form, Footer. All content lives in one HTML file.

**CSS** (`assets/css/`): Two stylesheets — `site.css` (main layout/design system) and `programs-carousel.css` (carousel component). Each has a `.min.css` production version. Production HTML references the minified versions.

**JS** (`assets/js/`): Two scripts — `site.js` (navigation toggle, Intersection Observer fade-ins, back-to-top button, year injection) and `programs-carousel.js` (carousel with touch/swipe, dot navigation, responsive items-per-view via CSS variables). Each has a `.min.js` production version. Production HTML references the minified versions.

**EmailJS** integration is inline in `index.html` (bottom). Currently uses placeholder credentials — see `SETUP-EMAIL.md` and `EMAILJS-CREDENTIALS.md` for setup.

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

## External Dependencies

- Google Fonts (Lato, Oswald)
- EmailJS via CDN (`cdn.jsdelivr.net/npm/@emailjs/browser@4`)
- Google Maps embed (contact section)
- AWS S3 (instructor photos)
