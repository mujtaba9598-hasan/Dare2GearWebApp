# 🌥️ Dare2Gear — How It All Works (Hosting, Deploy, Analytics, SEO)

**Last updated: 2026-06-09.** This is the single reference for how the live site
`dare2gear.online` is hosted, deployed, and tracked — so nothing has to be remembered
from scratch. If you read only one file, read this one.

---

## 🚀 TL;DR — how to update the live website

```powershell
# 1. Build the static site
npm run build

# 2. Deploy to Cloudflare (set the token first, then deploy)
$env:CLOUDFLARE_API_TOKEN = "<your Cloudflare API token>"
npx wrangler deploy
```

Live in ~15–30 seconds. **No FTP. No VPN. No GitHub deploy step.**

---

## 🧠 The architecture (what lives where)

| Piece | Where it lives | Notes |
|---|---|---|
| **Website files** (built `out/` folder) | **Cloudflare** (a static-assets Worker) | This is the real host |
| **Domain registration** `dare2gear.online` | **Hostinger** | We only renew it there |
| **Domain DNS / nameservers** | **Cloudflare** | Hostinger nameservers were replaced |
| **GitHub** | Code backup / version control **only** | NOT used to deploy |
| **Hostinger hosting** (`public_html`) | Unused **backup** | The old copy still sits there |

**Why we left Hostinger hosting:** Hostinger's file server (FTP / File Manager) is blocked by
the Pakistani ISP, so uploads needed a VPN and were painfully slow. Cloudflare deploys through
its **API**, reachable from Pakistan **without a VPN**, pushing the whole site in seconds.

**How a visitor reaches the site:** `dare2gear.online` → Cloudflare's nearest edge server →
serves the files directly. One hop, fast. Hostinger is not in the path.

---

## 🔑 Accounts & key facts

- **Cloudflare account:** `mujtaba9598@gmail.com`
- **Cloudflare Account ID:** `4b502b767d59dbe9d7fea27abf3bb7b7`
- **Worker name:** `dare2gearwebapp`
- **Workers subdomain:** `mujtaba9598.workers.dev`
- **Cloudflare nameservers (set at Hostinger):** `olga.ns.cloudflare.com`, `weston.ns.cloudflare.com`
- **Domain registrar:** Hostinger (registration/renewal only)
- **GitHub repo:** `github.com/mujtaba9598-hasan/Dare2GearWebApp`
- **Google Analytics (GA4) ID:** `G-9ZZB66NWKM`

---

## 🛠️ Deploy config — `wrangler.jsonc`

```jsonc
{
  "name": "dare2gearwebapp",
  "compatibility_date": "2025-05-01",
  "assets": { "directory": "./out" },          // serves the built static site
  "routes": [                                   // makes the domain serve from the Worker
    { "pattern": "dare2gear.online/*",     "zone_name": "dare2gear.online" },
    { "pattern": "www.dare2gear.online/*", "zone_name": "dare2gear.online" }
  ]
}
```

- `npm run build` → produces the static site in **`out/`** (Next.js static export).
- `npx wrangler deploy` → uploads `out/` to Cloudflare and serves it on the domain.
- We use **routes** (not a "custom domain") because the deploy token is Workers-scoped and
  can't edit DNS; the imported proxied DNS records + these routes make the Worker serve the domain.
- Adding routes auto-disabled the `*.workers.dev` test URL. To re-enable it for testing, add
  `"workers_dev": true` to this file.

---

## 🔐 The deploy token

Deploys authenticate with a **Cloudflare API token** in the `CLOUDFLARE_API_TOKEN` env var
(never committed to git).

**Create a new one if lost/rotated:**
1. Cloudflare dashboard → **My Profile → API Tokens → Create Token**.
2. Use the **"Edit Cloudflare Workers"** template.
3. Account Resources → **your account**; Zone Resources → **All zones** → Create → copy.

Revoke/rotate anytime on that same page.

---

## 🌐 DNS / domain

- DNS is managed in the **Cloudflare dashboard** (DNS tab), **not** Hostinger.
- HTTPS/SSL is automatic (Cloudflare Universal SSL). Recommended: SSL/TLS → Edge Certificates →
  turn on **"Always Use HTTPS"** so `http://` redirects to `https://`.
- To add email later (MX records), add them in Cloudflare DNS.

---

## 📊 Google Analytics (GA4)

- Tag is wired in **`src/app/layout.tsx`** via `next/script` (ID `G-9ZZB66NWKM`) — it auto-injects
  into every page's `<head>`. Because it's in the source, **every build keeps it automatically**,
  so analytics data never resets on re-deploy.
- GA data lives on **Google's servers**, not on the site — re-deploying never erases it.
- **Set data retention to 14 months:** GA Admin → Data settings → Data retention (default is 2).
- **Auto-tracked:** users, sessions, page views, traffic sources, geography (country/city),
  device/browser, engagement time, scrolls, outbound clicks.
- **NOT auto-tracked as labeled events:** WhatsApp button clicks (may show as generic "outbound
  click"), and `mailto:` / `tel:` clicks (ignored by default). To count inquiries properly, custom
  click events must be added to those buttons (a small code change + deploy).
- Property: "Dare2Gear" / stream "Dare2GearPlanner". (A duplicate empty property "Dare2Gera"
  may exist and can be deleted.)

---

## 🔎 SEO / Google Search Console

- **Verified** for `https://dare2gear.online` (HTML-file method:
  `public/googlecbf88d195b5a1eac.html`; the Google Analytics method also works).
- **`sitemap.xml`** is generated by **`src/app/sitemap.ts`** (lists all destinations, cities,
  services, etc.; security-restricted Balochistan pages are deliberately excluded). Submitted in
  Search Console as `sitemap.xml`.
- **`robots.txt`** is generated by **`src/app/robots.ts`** and points to the sitemap.
- After big content changes, re-submit the sitemap and use **URL Inspection → Request indexing**
  for new/important pages. Indexing takes days to weeks.

---

## 🔗 Social share preview (Open Graph)

- OG/Twitter tags are in **`src/app/layout.tsx`** (`metadata.openGraph` / `twitter`).
- The share image is **`public/og-image.jpg`** (1200×630 logo card). When a link to
  `dare2gear.online` is pasted into WhatsApp / Facebook / X, this card shows.
- To change the preview image, replace `public/og-image.jpg` (keep ~1200×630, under 300 KB) and redeploy.

---

## 🔁 Rollback (emergency only)

The old site still sits on **Hostinger `public_html`** as a backup. To revert to Hostinger hosting,
change the domain's nameservers (Hostinger → Domains → Nameservers) back to Hostinger's
`ns1.dns-parking.com` / `ns2.dns-parking.com` (you'd then need a VPN again to manage Hostinger files).

---

## 🆘 Troubleshooting

- **Domain not loading?** Cloudflare dashboard → domain shows **"Active"**, and Workers & Pages →
  `dare2gearwebapp` → the two routes are listed.
- **Deploy fails with auth error?** The token expired/was revoked → create a new one (above).
- **Changes not showing?** Run `npm run build` **before** `npx wrangler deploy`. Hard-refresh to
  bypass cache.
- **A bare `.html` file 404s/redirects?** Cloudflare static assets auto-strip `.html` (307 → clean
  URL). Normal for the site; only matters for raw `.html` files like the Google verification file.

---

*Related docs: `DOMAIN-TRANSFER-README.md` (how the domain got into the Hostinger account) and the
main `README.md` (the app itself, data, scripts).*
