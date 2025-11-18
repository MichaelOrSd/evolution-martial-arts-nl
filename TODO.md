# Site Improvement TODO List

This document tracks potential improvements for the Evolution Martial Arts NL website.

## Quick Wins (Easy & High Impact)

### 1. Add a Favicon ✅
- [x] Create favicon.svg with EVO branding
- [x] Add favicon links to `<head>` section in index.html
- **Impact**: Makes site look more professional in browser tabs/bookmarks
- **Completed**: 2025-11-18

### 2. Fix Redundant Alt Text ✅
- [x] Update line 301 in index.html: Change `alt="Portrait of Lead Instructor Dru "Dru" Hillyard"` to `alt="Portrait of Lead Instructor Dru Hillyard"`
- **Impact**: Cleaner accessibility markup
- **Completed**: 2025-11-18

### 3. Remove Dead Code ✅
- [x] Delete commented-out Events section (lines 262-289)
- [x] Delete commented-out Merchandise section (lines 331-551)
- [x] Delete commented-out Testimonials section (lines 657-671)
- [x] Remove Events link in footer (line 760) since section doesn't exist
- [x] Delete amplify.yml and related files
- **Impact**: Cleaner codebase, faster page load
- **Completed**: 2025-11-18

### 4. Improve Social Sharing
- [x] Update og-image.svg with correct location (St. John's, Newfoundland)
- [x] Update OG meta tags with better descriptions
- [x] Improve page title and meta description for SEO
- [ ] Optional: Convert og-image.svg to PNG (1200x630px) - SVG works on most platforms
- **Impact**: Better social media sharing and SEO
- **Completed**: 2025-11-18 (PNG conversion optional)

### 5. Improve Contact Form & Email Setup 🔄 IN PROGRESS
- [ ] Set up Cloudflare Email Routing for custom email (contact@evolutionmartialartsnl.com)
  - [ ] Add domain to Cloudflare
  - [ ] Configure email forwarding to evolutionmartialartsnl@gmail.com
  - [ ] Test email forwarding
- [ ] Set up EmailJS account (Dru needs to do this)
  - [ ] Sign up with evolutionmartialartsnl@gmail.com
  - [ ] Create email service
  - [ ] Create email template
  - [ ] Get Service ID, Template ID, and Public Key
- [ ] Implement EmailJS in contact form
- [ ] Replace mailto form with EmailJS submission
- [ ] Add success/error message handling
- **Impact**: Better user experience, fewer abandoned inquiries, more professional email address

## Medium Priority

### 6. Add Trust Signals
- [ ] Add "500+ students trained" or similar stat
- [ ] Add "Operating since [YEAR]"
- [ ] Uncomment and populate testimonials section with real quotes
- [ ] Add competition achievements/wins
- **Impact**: Builds credibility and trust

### 7. Improve CTAs (Call-to-Actions)
- [ ] Add urgency to hero CTA ("Limited spots - Try a free class")
- [ ] Add CTA after schedule section
- [ ] Consider sticky header CTA on mobile
- **Impact**: Higher conversion rates

### 8. Better Mobile Experience
- [ ] Add "Back to Top" button for mobile users
- [ ] Test and improve carousel swipe gestures
- [ ] Consider collapsible schedule for mobile
- [ ] Test all touch interactions
- **Impact**: Better mobile UX (majority of traffic is mobile)

### 9. Add Phone Number
- [ ] Uncomment phone number line 682 or add new phone contact
- [ ] Add click-to-call functionality for mobile
- **Impact**: Builds trust, easier contact for mobile users

### 10. SEO Improvements
- [ ] Add JSON-LD structured data for LocalBusiness
- [ ] Update page title to: "Evolution Martial Arts NL - BJJ & Kickboxing in St. John's, Newfoundland"
- [ ] Add more descriptive meta description
- [ ] Add alt text to map iframe
- [ ] Add rel="noopener" to external links
- **Impact**: Better search rankings, more organic traffic

## Nice to Have (Future Enhancements)

### 11. Analytics
- [ ] Add Google Analytics or privacy-friendly alternative (Plausible, Fathom)
- [ ] Set up conversion tracking for form submissions
- **Impact**: Data-driven decisions

### 12. Member Portal
- [ ] Consider adding member login area
- [ ] Share private content (training videos, schedules, announcements)
- **Impact**: Better member engagement

### 13. Blog/Content Section
- [ ] Add blog for martial arts tips, gym updates, student spotlights
- [ ] Improves SEO and community engagement
- **Impact**: More organic traffic, community building

### 14. Video Content
- [ ] Add videos of classes in action
- [ ] Coach introductions
- [ ] Student testimonials on video
- **Impact**: Higher engagement, shows real gym atmosphere

### 15. Success Stories
- [ ] Before/after transformations
- [ ] Competition success stories
- [ ] Weight loss/fitness journeys
- **Impact**: Social proof, inspiration for prospects

### 16. Performance Optimization
- [ ] Consider lazy loading images
- [ ] Optimize image sizes/formats (WebP)
- [ ] Minify remaining CSS/JS if needed
- **Impact**: Faster page loads, better SEO

### 17. Accessibility Audit
- [ ] Run WAVE or axe DevTools accessibility checker
- [ ] Ensure all interactive elements are keyboard accessible
- [ ] Add skip links for screen readers
- **Impact**: More accessible to all users

---

## Notes
- Prioritize Quick Wins first for maximum impact with minimal effort
- Review and update this list quarterly
- Mark items complete with [x] when finished
