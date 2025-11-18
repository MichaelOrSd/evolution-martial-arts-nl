# Changelog

## 2025-11-18

### Migration to GitHub Pages
- Migrated hosting from AWS Amplify to GitHub Pages for simpler, free, and faster deployments
- Repository made public to enable GitHub Pages
- Configured custom domain with DNS records pointing to GitHub Pages
- SSL certificate automatically provisioned by GitHub Pages
- Removed Amplify-specific files: `amplify.yml`, `docs/AMPLIFY-REDIRECTS.md`, `scripts/prebuild.sh`
- Cleaned up commented-out HTML sections (Events, Merchandise, Testimonials)
- Updated navigation to remove links to non-existent sections
- Updated README and CHECKLIST for GitHub Pages workflow
- Added TODO.md with prioritized site improvement suggestions

### Code Cleanup
- Removed all Amplify-related configuration and documentation
- Removed 220+ lines of commented-out HTML code
- Cleaned up header and footer navigation
- Streamlined project structure

## 2025-02-14

### Amplify readiness
- Added minified carousel CSS/JS bundles and updated `index.html` to use them for leaner production payloads.
- Introduced a branded `404.html` so Amplify can serve a custom not-found experience.
- Documented the custom error page requirement in README, redirect guidance, and launch checklist.

## 2025-10-10

### Cleanup summary
- Replaced Weebly template fragments with a handcrafted static `index.html` and modernized layout (no builder placeholders, no data attributes).
- Consolidated styling into `assets/css/site.css` and minified `assets/css/site.min.css`; removed unused Weebly LESS sources and scripts.
- Added lightweight navigation/intersection observers in `assets/js/site.js` with a minified bundle + source map.
- Rebuilt the hero backdrop as layered CSS gradients so no binary hero assets are required.
- Added a vector Open Graph preview (`assets/og-image.svg`) to replace raster social thumbnails.
- Replaced decorative PNG accents with CSS-driven alternatives and removed unused dropdown artwork to avoid binary diff noise.

### Weight savings
- Previous export: 872.0 KB (892,440 bytes)
- Current export: 44.6 KB (45,695 bytes)
- **Total saved:** 827.4 KB (846,745 bytes)

### Review notes
- Contact form currently submits via `mailto:` so the recipient mailbox should be confirmed; replace with a server endpoint if automated handling is required.
