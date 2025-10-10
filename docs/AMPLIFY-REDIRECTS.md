# Amplify Hosting Rewrites & Redirects

Configure rewrites and redirects in the Amplify Console under **App settings → Rewrites and redirects** once the app is connected.

## Recommended rules

1. **SPA catch-all (only if client-side routing is introduced later)**  
   Source: `/<*>` → Target: `/index.html` → Type: 200 → Condition: Exclude files with dot (`.`)

2. **Canonical redirect (when choosing www or apex)**  
   Example: Source: `https://www.evolutionmartialartsnl.com/<*>` → Target: `https://evolutionmartialartsnl.com/<*>` → Type: 301 → Condition: None

Document any additional rules in this file after they are configured.
