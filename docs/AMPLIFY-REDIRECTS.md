# Amplify Hosting Rewrites & Redirects

Configure rewrites and redirects in the Amplify Console under **App settings → Rewrites and redirects** once the app is connected.

## Recommended rules

1. **SPA catch-all (only if client-side routing is introduced later)**
   Source: `/<*>` → Target: `/index.html` → Type: 200 → Condition: Exclude files with dot (`.`)

2. **Canonical redirect (when choosing www or apex)**
   Example: Source: `https://www.evolutionmartialartsnl.com/<*>` → Target: `https://evolutionmartialartsnl.com/<*>` → Type: 301 → Condition: None

## Custom error response

Set the NotFound document to `404.html` in the Amplify console (App settings → Build settings → Custom error responses) so missing pages render the branded fallback instead of the Amplify default.

Document any additional rules in this file after they are configured.
