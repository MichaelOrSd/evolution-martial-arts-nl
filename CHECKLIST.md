# Deployment Checklist

Use this checklist after major updates or deployments.

## GitHub Pages Deployment
- [ ] Changes pushed to `main` branch
- [ ] GitHub Pages build completed successfully
- [ ] Production URL `https://evolutionmartialartsnl.com` loads over HTTPS with valid certificate
- [ ] WWW subdomain `https://www.evolutionmartialartsnl.com` redirects correctly
- [ ] No mixed-content warnings in browser dev tools
- [ ] Quick Lighthouse scan (Desktop + Mobile) scores look healthy (no major regressions)
- [ ] Hitting a non-existent URL (e.g., `/missing-page`) serves the branded `404.html` fallback
- [ ] All navigation links work correctly
- [ ] Contact form opens email client properly
- [ ] Mobile responsive design works on various screen sizes
