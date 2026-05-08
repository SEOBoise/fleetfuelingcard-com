# Fleet Fueling Card — Astro static site

A full-static Astro 5 + Tailwind v4 rebuild of [fleetfuelingcard.com](https://fleetfuelingcard.com), migrated from WordPress (Divi). Optimized for Cloudflare Pages.

## What's in here

```
.
├── astro.config.mjs        Astro config — inline CSS, sitemap integration
├── package.json
├── public/                 Static assets served as-is
│   ├── _redirects          Cloudflare Pages redirect rules
│   ├── favicon.ico, *.png  Favicons
│   ├── fonts/              Self-hosted Poppins + Open Sans (woff2)
│   ├── images/             All images, .webp (a few mobile variants for heroes)
│   └── robots.txt
├── src/
│   ├── pages/              One file per route (index, about-us, fleet-cards…
│   │                        plus [slug].astro for blog posts and 404.astro)
│   ├── layouts/Layout.astro  HTML shell — head, OG/Twitter, fonts, favicons
│   ├── components/         Header, Footer, Hero, ImageText, TextBlock,
│   │                        CtaBanner, ContactForm, LegalPage
│   ├── data/               nav.ts, pages.json, posts.json, legal.json
│   └── styles/global.css   Tailwind v4 theme + base styles + @font-face
├── functions/              Cloudflare Pages Functions
│   └── api/contact.ts      POST handler: Turnstile + Mailgun
├── scripts/                Build helpers (image optimizer, ref rewriter)
└── legacy-assets/          Source HTML, CSS, images crawled from the live
                            site — kept locally for reference, .gitignored.
```

Build output goes in `dist/` (about 2.5 MB total). Each HTML page is ~35-45 KB with all CSS inlined.

## Local development

```bash
npm install
npm run dev          # Astro dev server on http://localhost:4321
npm run build        # production build into dist/
npm run preview      # serve dist/ locally
```

Re-run image optimization after adding new files to `public/images/`:

```bash
node scripts/optimize-images.cjs       # PNG/JPG → WebP
node scripts/rewrite-image-refs.cjs    # rewrite paths in src/data/*.json
```

## Deploying to Cloudflare Pages

1. **Push the repo to GitHub / GitLab.**
2. **Cloudflare Pages → Create a project → Connect repo.**
3. **Build settings:**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: *(leave default)*
   - Environment variable: `NODE_VERSION=22`
4. **Custom domain:** point `fleetfuelingcard.com` (and `www`) at the Pages project.

The `functions/` directory is detected automatically — `functions/api/contact.ts` deploys as `POST /api/contact`. The `_redirects` rules apply automatically.

## Contact form configuration

The form lives in `src/components/ContactForm.astro`. It posts to `/api/contact` (the Cloudflare Function in `functions/api/contact.ts`), which validates a Cloudflare Turnstile CAPTCHA, then forwards the message via Mailgun.

### 1. Turnstile (CAPTCHA) — required

1. Go to **Cloudflare Dashboard → Turnstile → Add site**.
2. Pick "Managed" challenge for `fleetfuelingcard.com` and `*.pages.dev`.
3. Copy the **site key** and **secret key**.
4. In **Pages project → Settings → Environment variables**, add:
   - `PUBLIC_TURNSTILE_SITE_KEY` (Production + Preview) — the **site key**
   - `TURNSTILE_SECRET_KEY` (Production + Preview, encrypted) — the **secret key**

The form uses the test "always-passes" key as a fallback if `PUBLIC_TURNSTILE_SITE_KEY` is unset, so the form works in dev without setup. In production, set the real key.

### 2. Mailgun — required

1. Sign up at [mailgun.com](https://www.mailgun.com), verify a sending domain (e.g. `mg.fleetfuelingcard.com` — DNS records go in Cloudflare).
2. Generate a **Sending API key**.
3. Add these env vars to the Pages project (all encrypted):

| Name | Example | Notes |
|---|---|---|
| `MAILGUN_API_KEY` | `key-xxxxxxx…` | The private API key |
| `MAILGUN_DOMAIN` | `mg.fleetfuelingcard.com` | Your verified Mailgun domain |
| `MAILGUN_FROM` | `Fleet Fueling Card <noreply@mg.fleetfuelingcard.com>` | Display name + verified address |
| `MAILGUN_TO` | `morrison@fleetfuelingcard.com` | Where submissions land |
| `MAILGUN_REGION` | `us` | Optional. `us` (default) or `eu` |

The handler sets `Reply-To` to the form submitter's email so hitting "reply" in your inbox replies to them, not back to noreply.

### Swapping Mailgun for another provider

`functions/api/contact.ts` is one short file. To swap to SendGrid, Resend, Postmark, etc., replace the Mailgun-specific block (the `fetch` to `api.mailgun.net`) — the rest (form parsing, Turnstile, validation, JSON response) stays the same.

## Notable choices

- **No external CSS file.** `build.inlineStylesheets: "always"` puts all CSS in `<head>` — eliminates render-blocking CSS, the #1 mobile perf killer for static sites.
- **Self-hosted fonts.** Poppins + Open Sans are loaded from `/fonts/*.woff2`. No DNS lookup to Google.
- **WebP everywhere.** All page images are `.webp`; PNG/JPG originals were stripped from `public/`. The legacy WordPress URL pattern is rewritten by `_redirects`, so any external link to `/wp-content/uploads/.../foo.png` becomes `/images/foo.webp`.
- **Lazy Turnstile.** The CAPTCHA script only loads when the contact form scrolls near the viewport — saves ~370 KB on every page that *isn't* the contact form.
- **Honeypot field** (`name="website"`) catches naive bots silently, no CAPTCHA required.

## Pages

```
/                      Homepage
/about-us/             About
/fleet-fueling-solutions/
/fleet-cards/
/fueling-blog/         Blog index (8 posts)
/<post-slug>/          Each blog post (slugs match the original URLs)
/contact/              Contact form
/terms-of-use/
/privacy-policy/
/404                   Custom 404
/sitemap-index.xml     Sitemap (auto-generated by @astrojs/sitemap)
/robots.txt
```

## Migration notes

- **Two blog posts didn't migrate.** The legacy URLs
  `/enhancing-fleet-compliance-key-strategies-for-fleet-managers-to-navigate-regulations/`
  and `/streamlining-fleet-compliance-essential-strategies-for-fleet-managers/` returned empty 200 responses on the live site at crawl time. They're not in the new sitemap; if you want them back, recover the content (Wayback Machine has snapshots) and add them to `src/data/posts.json`.
- **`fueling-blog` was 500 on the source** — the new blog index is generated from the post list rather than mirroring the broken page.
- **Contact page address.** The mailing address `2232 Upton Avenue, Brownville, ME 04414` was only on the original about-us page; it's now on `/contact/` where it belongs.
- **WordPress/Divi spam comments** on the legacy blog posts are NOT carried over. Only the article body was migrated; comments were dropped.
- **Email obfuscation.** The original site used Cloudflare email-decode JS to hide `morrison@fleetfuelingcard.com`. The new site shows it directly via `mailto:` since modern spam filters make obfuscation mostly cargo-cult, but you can re-add `data-cfemail` attributes if you prefer.
