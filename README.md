# Evolution Martial Arts Static Site

This repository contains the static landing page that is deployed to AWS Amplify for Evolution Martial Arts in Amsterdam.

## Current homepage snapshot

The previous screenshot shared with the team was captured before the current landing page redesign. The latest build features the hero banner, four program highlight cards, a weekly schedule table, member testimonial, and contact details exactly as shown in the updated screenshot shared in the pull request discussion. If you need to validate locally, open `index.html` in a browser or run a lightweight server:

```bash
python -m http.server 8000
```

Then navigate to `http://localhost:8000/index.html`.

## Build steps

The Amplify pipeline compiles the LESS theme into CSS before deploying. To reproduce locally:

```bash
npm install
npm run build
```

The compiled CSS will be written to `styles/main.css`.
