# Evolution Martial Arts NL Static Site

This repository contains the Evolution Martial Arts NL website. The site is pure HTML, CSS, and JavaScript. Client-editable content (programs, schedule, memberships, belt roster) lives in `content/*.json`, edited by the owners through [Pages CMS](https://pagescms.org) and injected into the page by a dependency-free build script at deploy time.

## Project structure

- `index.html` – main entry point; content zones are generated between `<!-- BUILD:* -->` markers.
- `content/` – editable content data (JSON); `site.json` is dev-maintained SEO data.
- `scripts/build.js` – zero-dependency build: validates content, generates HTML/llms.txt/JSON-LD into `dist/`.
- `.pages.yml` – Pages CMS editing-form configuration.
- `EDITING.md` – plain-English editing guide for the owners.
- `assets/css/` – author-friendly and minified stylesheets.
- `assets/js/` – author-friendly and minified JavaScript (with source map).
- `CNAME` – GitHub Pages custom domain configuration.
- `project.md` – canonical project tracker.

## Local preview

For CSS/JS work, the repo root serves as-is (committed fallback content):

```bash
python -m http.server 8080
```

To preview exactly what deploys:

```bash
node scripts/build.js
python3 -m http.server 8080 --directory dist
```

## Hosting on GitHub Pages

Pushes to `main` run `.github/workflows/deploy.yml`, which builds `dist/` and deploys it via GitHub Pages (Actions source). Invalid content fails the build — the previous deploy stays live and an issue is opened automatically.

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

Changes pushed to `main` (including Pages CMS saves) build and deploy automatically in about 60–90 seconds.
