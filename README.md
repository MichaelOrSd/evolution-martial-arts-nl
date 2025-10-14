# Evolution Martial Arts NL Static Site

This repository contains a cleaned static export of the Evolution Martial Arts NL website. The site is pure HTML, CSS, and JavaScript with no external builders or CMS dependencies.

## Project structure

- `index.html` – main entry point for the marketing site.
- `assets/css/` – author-friendly and minified stylesheets.
- `assets/js/` – author-friendly and minified JavaScript (with source map).
- `assets/og-image.svg` – vector social preview artwork used for sharing cards.
- `amplify.yml` – AWS Amplify Hosting configuration.
- `docs/` – documentation for redirect configuration and future ops notes.

## Local preview

No build step is required. Open `index.html` in a browser or run a simple static server, e.g.:

```bash
python -m http.server 8080
```

Then visit <http://localhost:8080>.

## Hosting on AWS Amplify

1. In the AWS console, open **Amplify** and choose **New app → Host web app**.
2. Connect your GitHub account when prompted and authorize Amplify to access the repository.
3. Select the repository and choose the **main** branch as the production branch so that any push to `main` triggers a deploy.
4. Enable **Preview builds** so pull requests (for example `codex/clean-weebly-export`) get their own preview URLs.
5. Amplify detects `amplify.yml` automatically. Confirm the artifact base directory is the repo root (`/`) and that no additional build commands are required.
6. Complete the wizard to trigger the initial deploy.

## Custom Domain via Route 53

1. After the first deploy, open the app in Amplify and navigate to **App settings → Domain management**.
2. Click **Add domain** and enter `evolutionmartialartsnl.com`.
3. Map the root domain `evolutionmartialartsnl.com` and the subdomain `www.evolutionmartialartsnl.com` to the production branch (`main`).
4. Because the hosted zone already exists in Route 53, Amplify suggests the required DNS records (A/AAAA and validation CNAMEs). Accept and save the changes.
5. Amplify provisions and validates the SSL certificate automatically—no manual ACM step is necessary.
6. (Optional) Set up a canonical redirect (e.g., `www` → apex) in **Rewrites and redirects** after DNS finishes propagating.

Refer to `docs/AMPLIFY-REDIRECTS.md` for the rules to configure in the Amplify console.
