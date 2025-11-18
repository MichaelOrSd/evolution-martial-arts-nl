# Changelog

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
