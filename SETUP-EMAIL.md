# Email Setup Guide for Evolution Martial Arts NL

This guide covers setting up professional email forwarding and contact form functionality.

## Part 1: Cloudflare Email Routing Setup (15 minutes)

### Step 1: Create Cloudflare Account (5 min)

1. Go to https://cloudflare.com
2. Click "Sign Up" (use any email - doesn't need to be evolutionmartialartsnl@gmail.com)
3. Verify your email

### Step 2: Add Domain to Cloudflare (5 min)

1. In Cloudflare dashboard, click "Add a Site"
2. Enter: `evolutionmartialartsnl.com`
3. Select the **Free plan** (scroll down - it's at the bottom)
4. Click "Continue"

### Step 3: Import DNS Records

Cloudflare will scan your current DNS records from Route 53 and import them automatically.

1. Review the DNS records - should see:
   - A records (GitHub Pages IPs)
   - CNAME records (www)
   - NS records
   - SOA record
2. Click "Continue"

### Step 4: Update Nameservers in Route 53

Cloudflare will show you 2 nameservers (something like):
```
ada.ns.cloudflare.com
noel.ns.cloudflare.com
```

**In AWS Route 53:**
1. Go to Route 53 console
2. Click on "Hosted zones"
3. Click on `evolutionmartialartsnl.com`
4. Click "Edit" on the NS record
5. Replace the current nameservers with the Cloudflare nameservers
6. Save changes

**Wait 5-10 minutes for DNS propagation**

### Step 5: Set Up Email Routing (3 min)

Once Cloudflare shows your site is active:

1. In Cloudflare dashboard, click on your domain
2. Go to **Email** → **Email Routing** in the left sidebar
3. Click "Get started" or "Enable Email Routing"
4. Click "Add destination address"
5. Enter: `evolutionmartialartsnl@gmail.com`
6. Check Gmail for verification email from Cloudflare
7. Click the verification link

### Step 6: Create Email Aliases

Create professional email addresses that forward to Gmail:

1. Click "Create address"
2. **Recommended aliases to create:**
   - `contact@evolutionmartialartsnl.com` → evolutionmartialartsnl@gmail.com
   - `info@evolutionmartialartsnl.com` → evolutionmartialartsnl@gmail.com
   - `dru@evolutionmartialartsnl.com` → evolutionmartialartsnl@gmail.com
3. Click "Save"

### Step 7: Test Email Forwarding

1. Send a test email to contact@evolutionmartialartsnl.com
2. Check evolutionmartialartsnl@gmail.com inbox
3. Should receive the forwarded email within seconds

✅ **Email forwarding is now complete!**

---

## Part 2: EmailJS Setup (For Dru - 10 minutes)

**Important: Dru must complete this section using evolutionmartialartsnl@gmail.com**

### Step 1: Create EmailJS Account (3 min)

1. Go to https://emailjs.com
2. Click "Sign Up"
3. Use email: `evolutionmartialartsnl@gmail.com`
4. Verify email

### Step 2: Add Email Service (3 min)

1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Select **Gmail**
4. Click "Connect Account"
5. Sign in with evolutionmartialartsnl@gmail.com
6. Grant permissions
7. Service ID will be auto-generated (save this - looks like `service_xyz123`)

### Step 3: Create Email Template (3 min)

1. Go to "Email Templates"
2. Click "Create New Template"
3. Replace template content with:

```
Subject: New Contact Form Submission from {{from_name}}

From: {{from_name}}
Email: {{reply_to}}
Program Interest: {{program}}

Message:
{{message}}

---
Sent from Evolution Martial Arts NL website
```

4. Template ID will be shown (save this - looks like `template_xyz456`)
5. Click "Save"

### Step 4: Get Your Public Key

1. Go to "Account" → "General"
2. Find "Public Key" section
3. Copy the public key (looks like `abcd1234EFGH5678`)

### Step 5: Send Credentials to Developer

Send these 3 values to your developer:

```
Service ID: service_xyz123
Template ID: template_xyz456
Public Key: abcd1234EFGH5678
```

---

## Part 3: Testing the Complete Setup

Once the developer adds the credentials to the site:

1. Visit https://evolutionmartialartsnl.com
2. Scroll to the contact form
3. Fill out the form and submit
4. Check evolutionmartialartsnl@gmail.com inbox
5. You should receive the form submission

---

## Benefits of This Setup

✅ Professional email: contact@evolutionmartialartsnl.com
✅ All emails forward to Gmail automatically
✅ Contact form sends to professional email
✅ Free for up to 200 emails/month (EmailJS)
✅ Completely HTTPS secure
✅ Spam protection included
✅ No server/backend required

---

## Troubleshooting

### Email forwarding not working
- Wait 10-15 minutes for DNS propagation
- Check spam folder in Gmail
- Verify email address in Cloudflare is correct
- Ensure you clicked the verification link

### EmailJS not sending
- Double-check all 3 credentials are correct
- Ensure Gmail account permissions are granted
- Check EmailJS dashboard for error logs
- Make sure evolutionmartialartsnl@gmail.com is verified

### DNS issues after switching to Cloudflare
- Wait 24-48 hours for full propagation
- Check https://dnschecker.org to verify nameserver changes
- GitHub Pages should continue working (A records are preserved)

---

## Support

- **Cloudflare Help**: https://community.cloudflare.com
- **EmailJS Help**: https://www.emailjs.com/docs/
- **GitHub Pages**: Already configured and working

---

## Cost

- **Cloudflare Email Routing**: FREE (unlimited forwards)
- **EmailJS**: FREE up to 200 emails/month (upgrade to $7/mo for 1,000/mo if needed)
- **Total cost**: $0/month for normal usage
