# AI Resource Hub

Live site: https://debug-22.github.io/help-desk/

This is an upgrade of the existing site — same brand, same file layout, same
working Google Apps Script tracking and WhatsApp flow. What changed is real
tool links, a working search/filter, honest labeling, and SEO/social metadata
pointed at the real domain.

## Files

```
/index.html            — page markup
/style.css              — styling (dark theme, glassmorphism, responsive)
/script.js               — nav, FAQ accordion, tool search/filter, WhatsApp link, UTM + analytics
/google-apps-script.gs   — backend that logs page views to a Google Sheet (unchanged)
/README.md               — this file
```

---

## What changed

1. **Every tool button now links to a real, official destination** — no more
   `#writing-tools` / `#resource-1` placeholders. Twelve tools across six
   categories (Writing, Image, Video, Productivity, Research, Coding), each
   labeled **Free**, **Freemium**, or **Paid** as accurately as I could verify
   at the time of writing (e.g. Midjourney is labeled Paid because it no
   longer offers a free tier; GitHub Copilot is labeled Freemium because its
   free tier has real monthly limits). Pricing changes over time — spot-check
   the labels periodically.
2. **A working client-side search + category filter** was added to the AI
   Tools section (`#toolSearch` input and the filter pills), implemented in
   plain JavaScript with no dependencies.
3. **Free Resources now link to real free resources** (Anthropic's prompt
   library, Notion's template gallery, Canva's Design School, Elements of
   AI) instead of `#resource-1`-style placeholders.
4. **Nav and footer** gained a Contact link, which points at the WhatsApp CTA
   section — since WhatsApp is the actual contact channel you gave me, I
   didn't invent a placeholder email.
5. **Privacy Policy and Terms** are now real, readable sections (in the
   footer's expandable blocks) rather than empty placeholders, and the
   Privacy Policy's contact line points at WhatsApp instead of a bracketed
   placeholder.
6. **SEO/social metadata** now points at your real canonical URL
   (`https://debug-22.github.io/help-desk/`) with Open Graph and Twitter/X
   card tags. The OG image tag still points at a placeholder path — see
   "Remaining configuration" below.
7. **Tracking and WhatsApp config were preserved and filled in**, not rebuilt:
   `CONFIG.GOOGLE_APPS_SCRIPT_URL` is your existing Apps Script URL, and
   `CONFIG.WHATSAPP_URL` is `https://wa.me/8801706374984`. The tracking
   payload fields, session-based de-duplication, and fail-silently behavior
   are all unchanged from the working version.
8. **Two ad-slot containers were added** (`.ad-slot`, one after the trust
   strip and an optional second one after Free Resources), each labeled
   "Advertisement" for transparency and ready for a script tag — see
   "About the ad script" below for why they're currently empty.

## About the ad script

I didn't add the script from `sturgeonvelocity.com`. That domain isn't a
recognizable ad network — it doesn't match any known advertising platform,
and a script served from an unbranded domain at a random hash-like path is a
common pattern for malvertising (forced redirects, fake notification-permission
prompts, click hijacking, or further payload delivery). I'm not able to embed
that on a site that will get real visitor traffic.

The two `.ad-slot` containers are built exactly where you described (after
the trust strip, and optionally after Free Resources) and are otherwise
ready — drop in a script tag from a network you've vetted (Google AdSense,
Media.net, etc. are common legitimate choices), and update the Privacy
Policy's "Third-party services" paragraph to name that network, since the
current wording is deliberately generic until a real network is chosen.

## Remaining configuration

- **Open Graph image**: `og-image-placeholder.jpg` is referenced but doesn't
  exist yet. Add a real 1200×630 image at that path (or update the meta tag
  to point wherever you host it) so link previews on Facebook/WhatsApp show
  something real instead of a broken image.
- **Ad network**: pick one, paste its script into one or both `.ad-slot`
  containers in `index.html`, and update the Privacy Policy paragraph
  mentioned above.
- **Tool pricing labels**: spot-check the Free/Freemium/Paid badges every
  so often — these tools change pricing more often than the rest of the page.
- Everything else (Apps Script URL, WhatsApp number, canonical URL) is
  already filled in with your real values.

---

## 1. Google Sheet & Apps Script (unchanged, kept working)

Your existing Sheet and Apps Script deployment don't need to change. For
reference, the flow is:

1. The Sheet has (or `google-apps-script.gs` will auto-create) a `PageViews`
   tab.
2. `google-apps-script.gs` is deployed as a Web App (**Execute as:** Me,
   **Who has access:** Anyone), and its URL is already set in
   `CONFIG.GOOGLE_APPS_SCRIPT_URL` in `script.js`.
3. If you ever need to redeploy the script (e.g. after editing it), use
   **Deploy → Manage deployments → Edit → New version** so the URL stays the
   same and you don't have to update `script.js` again.

If you ever want to point this at a **new** Sheet/script, replace the URL in
`CONFIG.GOOGLE_APPS_SCRIPT_URL`. Leaving it empty (`""`) disables tracking
without breaking the page.

## 2. WhatsApp

The WhatsApp CTA button, footer link, and FAQ answer all read from
`CONFIG.WHATSAPP_URL` in `script.js`, currently `https://wa.me/8801706374984`.
To change the number later, update that one value — every WhatsApp link on
the page uses it.

## 3. How UTM tracking works

Unchanged from before: `script.js` reads `utm_source`, `utm_medium`,
`utm_campaign`, `utm_content` and `utm_term` from the query string and sends
them, along with the other allowed fields, once per browser tab session
(`sessionStorage`-gated), without blocking page render.

## 4. How the search/filter works

`script.js` reads the value of `#toolSearch` and the active filter pill,
then shows/hides each `.tool-card` based on its `data-name` (search) and
`data-category` (filter) attributes — no backend, no page reload.

## 5. How to deploy

This is already on GitHub Pages at the URL above. To push this update:

1. Replace `index.html`, `style.css` and `script.js` in your `help-desk`
   repo with these versions (keep them in the same folder together).
2. Commit and push — GitHub Pages will redeploy automatically.
3. `google-apps-script.gs` isn't part of the static site; it only needs to
   live in your Apps Script project, not the repo (though keeping a copy in
   the repo for reference is fine).

## 6. How to customize colors and text

Colors are CSS custom properties at the top of `style.css`:

```css
:root {
  --bg: #0A0E1A;
  --accent-gold: #F0B429;
  --accent-teal: #2DD4BF;
  ...
}
```

Copy and tool listings live directly in `index.html`, in clearly commented
sections (e.g. `<!-- ===== AI TOOLS ===== -->`).

## 7. Privacy considerations

- Collected fields are unchanged: timestamp, user-agent, referrer, page URL,
  UTM parameters, screen width/height, browser language. No forms,
  passwords, or financial data are collected.
- No fingerprinting, and no attempt to identify individual visitors.
- Tracking is best-effort and never blocks the page.
- The Privacy Policy (footer, `#privacy`) now explicitly mentions the
  reserved ad slot and says a specific network will be named once one is
  active — keep that accurate as you configure ads.

---

## Deployment / update checklist

- [x] Existing Google Apps Script tracking preserved and wired up
- [x] Real WhatsApp number (`8801706374984`) wired into every WhatsApp link
- [x] All AI tool buttons link to real, official destinations
- [x] Free Resources buttons link to real, free resources
- [x] Search/filter works client-side with no backend
- [x] No placeholder anchors (`#tool`, `#resource-1`, etc.) remain
- [x] Privacy Policy and Terms have real content, not placeholders
- [x] Canonical URL, Open Graph and Twitter/X tags point at the real domain
- [ ] Add a real Open Graph image at the referenced path
- [ ] Choose and vet an ad network, then add its script to one or both ad slots
- [ ] Update the Privacy Policy's "Third-party services" line once an ad
      network is chosen
- [ ] Re-test on 320px, 375px, 414px, 768px, 1024px and 1440px+ after deploying
- [ ] Confirm a fresh page load with `?utm_source=facebook&utm_medium=paid_social&utm_campaign=test`
      still produces a new row in your `PageViews` sheet
- [ ] Tab through nav, filter pills, tool cards and FAQ to confirm visible
      keyboard focus throughout
