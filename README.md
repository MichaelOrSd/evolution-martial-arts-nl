# Evolution Martial Arts NL Static Site

This repository contains a cleaned static export of the Evolution Martial Arts NL website. The site is pure HTML, CSS, and JavaScript with no external builders or CMS dependencies.

## Project structure

- `index.html` – main entry point for the marketing site.
- `assets/css/` – author-friendly and minified stylesheets.
- `assets/js/` – author-friendly and minified JavaScript (with source map).
- `assets/og-image.svg` – vector social preview artwork used for sharing cards.
- `CNAME` – GitHub Pages custom domain configuration.
- `TODO.md` – list of potential site improvements and enhancements.

## Local preview

No build step is required. Open `index.html` in a browser or run a simple static server, e.g.:

```bash
python -m http.server 8080
```

Then visit <http://localhost:8080>.

## Hosting on GitHub Pages

The site is hosted on GitHub Pages and automatically deploys when changes are pushed to the `main` branch.

- **Live site**: https://evolutionmartialartsnl.com
- **GitHub Pages URL**: https://michaelorsd.github.io/evolution-martial-arts-nl/

### Custom Domain Setup

The custom domain is configured via the `CNAME` file in the repository root. To update DNS:

1. In your DNS provider (Route 53), add the following DNS records:
   - **A records** (for apex domain):
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **CNAME record** (for www subdomain):
     ```
     www.evolutionmartialartsnl.com → michaelorsd.github.io
     ```

2. GitHub Pages will automatically provision an SSL certificate once DNS propagates.

### Deployment

Changes pushed to `main` are automatically deployed within seconds. No build step is required.
