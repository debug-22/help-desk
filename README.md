# AI Resource Hub

A mobile-first, dark-themed landing page for introducing visitors to AI tools
and free digital resources. Built with plain HTML5, CSS3 and vanilla
JavaScript — no build step, no frameworks.

## Files

```
/index.html            — page markup
/style.css              — styling (dark theme, glassmorphism, responsive)
/script.js               — nav, FAQ accordion, WhatsApp link, UTM + analytics
/google-apps-script.gs   — backend that logs page views to a Google Sheet
/README.md               — this file
```

---

## 1. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it something like `AI Resource Hub — Analytics`.
3. You don't need to create any tabs or headers yourself — the script creates
   a `PageViews` tab and header row automatically on first run.

## 2. Create the Apps Script

1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete any placeholder code in the editor.
3. Paste in the full contents of `google-apps-script.gs`.
4. Click **Save** (the disk icon), and give the project a name if prompted.

## 3. Deploy the Apps Script as a Web App

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Google will ask you to authorize the script — approve the permissions
   (this is your own script running in your own account).
6. Copy the **Web app URL** that appears. It looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

This URL is the only credential exposed to the frontend, and it can only
receive new rows — it does not expose read access to your spreadsheet.

## 4. Where to put the Web App URL

Open `script.js` and set it in the `CONFIG` object at the top of the file:

```js
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: "https://script.google.com/macros/s/XXXXXXXX/exec",
  WHATSAPP_URL: "https://wa.me/10000000000"
};
```

If you leave `GOOGLE_APPS_SCRIPT_URL` empty (`""`), tracking is disabled and
the site continues to work normally — nothing breaks and no requests are sent.

## 5. How to configure the WhatsApp URL

WhatsApp "click to chat" links follow the format:

```
https://wa.me/<countrycode><number>
```

For example, a US number `+1 555 123 4567` becomes:

```
https://wa.me/15551234567
```

Set this in the same `CONFIG` object in `script.js`, under `WHATSAPP_URL`.
Both the WhatsApp CTA section button and the footer link read from this
single value.

## 6. How UTM tracking works

When someone arrives from an ad with a URL like:

```
https://yourdomain.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=ai_tools&utm_content=ad1
```

`script.js` reads `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`
and `utm_term` from the query string with the built-in `URLSearchParams` API
and includes them in the single analytics payload sent on page load. If a
parameter is absent, it's sent as an empty string — nothing is invented.

Tracking fires at most once per browser tab session, using `sessionStorage`
as a simple de-duplication flag, so reloading the same page in the same tab
won't send duplicate rows.

## 7. How to deploy the website

This is a static site — any static host works:

- **Simple / free options:** GitHub Pages, Netlify, Vercel, Cloudflare Pages
- **Traditional hosting:** upload the four frontend files via FTP/SFTP to any
  web host's public directory
- Make sure `index.html`, `style.css` and `script.js` stay in the same folder
  (the paths in `index.html` are relative)

Before going live:
- Replace the canonical URL and Open Graph URL/image placeholders in
  `index.html`'s `<head>` with your real domain and a real image.
- Replace the placeholder anchor targets (`#writing-tools`, `#resource-1`,
  etc.) with real destination pages once they exist.
- Fill in the `[Insert contact email or WhatsApp link here]` placeholder in
  the Privacy Policy section.

## 8. How to customize colors and text

All colors are defined as CSS custom properties at the top of `style.css`:

```css
:root {
  --bg: #0A0E1A;
  --accent-gold: #F0B429;
  --accent-teal: #2DD4BF;
  ...
}
```

Change these values to re-theme the entire site consistently. Headline and
body copy live directly in `index.html` — search for the section you want
to edit (each is clearly commented, e.g. `<!-- ===== HERO ===== -->`).

## 9. Privacy considerations

- Only basic technical fields are collected: timestamp, user-agent,
  referrer, page URL, UTM parameters, screen width/height and browser
  language. No forms, passwords, contacts or financial data are collected
  anywhere on this page.
- No fingerprinting techniques are used, and no attempt is made to
  identify individual visitors.
- Tracking is best-effort: if the Apps Script URL is unset, unreachable, or
  the request fails for any reason, the page continues to function
  normally — tracking never blocks rendering and never breaks the UI.
- The Privacy Policy section (in the footer, under `#privacy`) explains
  what's collected, why, and how visitors can limit it. Keep this
  accurate if you change what the analytics payload collects.
- Before running paid traffic, confirm your analytics/privacy language
  matches what the ad platform (e.g. Meta) requires you to disclose, and
  what your local regulations require.

---

## Deployment checklist

- [ ] Google Sheet created
- [ ] Apps Script pasted in and saved
- [ ] Apps Script deployed as Web App (Execute as: Me, Access: Anyone)
- [ ] Web App URL copied into `CONFIG.GOOGLE_APPS_SCRIPT_URL` in `script.js`
- [ ] Real WhatsApp number set in `CONFIG.WHATSAPP_URL`
- [ ] Placeholder tool/resource links (`#writing-tools`, `#resource-1`, etc.)
      replaced with real destinations
- [ ] Contact info filled in on the Privacy Policy section
- [ ] Open Graph image, canonical URL and meta description updated for your
      real domain
- [ ] Test the full flow: load the page with `?utm_source=facebook&utm_medium=paid_social&utm_campaign=test`
      in the URL and confirm a row appears in the `PageViews` sheet tab
- [ ] Test on 320px, 375px, 414px, 768px, 1024px and desktop widths
- [ ] Test keyboard navigation (Tab through nav, cards, accordion) and
      confirm visible focus states throughout
- [ ] Confirm the site still works normally with `GOOGLE_APPS_SCRIPT_URL` left
      empty (tracking disabled)
