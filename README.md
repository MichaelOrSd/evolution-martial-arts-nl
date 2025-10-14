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
5. Amplify detects `amplify.yml` automatically. Confirm the artifact base directory is the repo root (`.`) and that no additional build commands are required.
6. Complete the wizard to trigger the initial deploy.

## Custom Domain via Route 53

1. After the first deploy, open the app in Amplify and navigate to **App settings → Domain management**.
2. Click **Add domain** and enter `evolutionmartialartsnl.com`.
3. Map the root domain `evolutionmartialartsnl.com` and the subdomain `www.evolutionmartialartsnl.com` to the production branch (`main`).
4. Because the hosted zone already exists in Route 53, Amplify suggests the required DNS records (A/AAAA and validation CNAMEs). Accept and save the changes.
5. Amplify provisions and validates the SSL certificate automatically—no manual ACM step is necessary.
6. (Optional) Set up a canonical redirect (e.g., `www` → apex) in **Rewrites and redirects** after DNS finishes propagating.

Refer to `docs/AMPLIFY-REDIRECTS.md` for the rules to configure in the Amplify console.

## Contact form with Amazon SES

The contact form is wired to call a JSON endpoint that relays submissions to Amazon Simple Email Service (SES). To finish the
integration:

1. Create an AWS Lambda function (Node.js 18+) with permissions to call `ses:SendEmail`. A minimal handler is shown below.
2. Expose the function with Amazon API Gateway (HTTP API). Enable CORS for `POST` requests from your domain and, optionally,
   protect the route with an API key.
3. Verify the sending and receiving email addresses (or the entire domain) in SES and move the account out of the sandbox if
   you need to email arbitrary recipients.
4. Update the `data-endpoint` attribute on the `<form class="contact-form">` element in `index.html` with your API Gateway
   invoke URL. If you enabled an API key, place it in the `data-api-key` attribute.
5. Commit and deploy so the static site can call the new endpoint.

Example Lambda handler:

```js
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: process.env.AWS_REGION });
const RECEIVER = process.env.CONTACT_RECEIVER;
const SENDER = process.env.CONTACT_SENDER;

export const handler = async (event) => {
  const payload = JSON.parse(event.body || '{}');

  const email = new SendEmailCommand({
    Source: SENDER,
    Destination: { ToAddresses: [RECEIVER] },
    ReplyToAddresses: payload.email ? [payload.email] : [],
    Message: {
      Subject: { Data: `New website inquiry from ${payload.name || 'Unknown'}` },
      Body: {
        Text: {
          Data: `Program: ${payload.program}\nEmail: ${payload.email}\nMessage: ${payload.message}\nSubmitted: ${payload.submittedAt}`,
        },
      },
    },
  });

  await ses.send(email);

  return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true }) };
};
```

For Amplify Hosting you can inject the API details without editing HTML by using environment variables and a post-deploy script
if desired. The default deployment leaves a placeholder URL so the page loads even before the backend is ready.
