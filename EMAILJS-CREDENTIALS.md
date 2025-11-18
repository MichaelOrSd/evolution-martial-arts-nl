# Adding EmailJS Credentials

Once Dru has completed the EmailJS setup (see SETUP-EMAIL.md), follow these steps to add the credentials to the site:

## Step 1: Get Credentials from Dru

You need these 3 values:
- **Service ID**: looks like `service_xyz123`
- **Template ID**: looks like `template_xyz456`
- **Public Key**: looks like `abcd1234EFGH5678`

## Step 2: Update index.html

1. Open `index.html` in your editor
2. Find this section near the bottom (around line 506):

```javascript
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',     // Get from EmailJS dashboard
  templateId: 'YOUR_TEMPLATE_ID',    // Get from EmailJS dashboard
  publicKey: 'YOUR_PUBLIC_KEY'       // Get from EmailJS dashboard
};
```

3. Replace the placeholder values with the real ones:

```javascript
const EMAILJS_CONFIG = {
  serviceId: 'service_xyz123',      // Replace with actual Service ID
  templateId: 'template_xyz456',     // Replace with actual Template ID
  publicKey: 'abcd1234EFGH5678'      // Replace with actual Public Key
};
```

## Step 3: Commit and Push

```bash
git add index.html
git commit -m "Add EmailJS credentials"
git push origin main
```

## Step 4: Test

1. Visit https://evolutionmartialartsnl.com
2. Scroll to the contact form
3. Fill it out and submit
4. Check evolutionmartialartsnl@gmail.com for the email

## If It Doesn't Work

- Double-check all 3 credentials are correct (no typos)
- Make sure Dru completed ALL steps in SETUP-EMAIL.md
- Check the browser console for errors (F12)
- Verify Dru gave permissions to EmailJS in Gmail
- Contact EmailJS support if needed

## Security Note

These credentials are "public keys" and are safe to commit to GitHub. They only allow sending emails through your EmailJS account, not accessing your Gmail directly.
