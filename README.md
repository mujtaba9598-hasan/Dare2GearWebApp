# 🏔️ Dare2Gear

**Travel planning platform for Pakistan.** Two core features:

- **🎁 Budget planner** (`/planner`) — *"I have Rs X, where can I go?"* → ranked destinations you can afford, with full cost breakdown.
- **🗺️ Plan a specific trip** (`/trip`) — any place → any place (e.g. Hunza → Karachi) with real road distance, drive time, fuel, stay, food and total.

Plus destination guides, 80+ starting-city pages, route intelligence (weather, tolls, docs), rentals/services catalogs, and live OGRA fuel prices.

| | |
|---|---|
| **Stack** | Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript |
| **Status** | Live travel platform — static export (Netlify), no backend / API keys |
| **Repo** | github.com/mujtaba9598-hasan/Dare2GearWebApp |
| **Key files** | `src/lib/data.ts` · `src/lib/planner.ts` (engine) · `src/lib/content.ts` · `src/lib/city-attractions.ts` · `src/data/road-distances.json` (real OSRM distances) |
| **Backlog** | see [ROADMAP.md](ROADMAP.md); **deferred-to-VPS items in [DEFERRED.md](DEFERRED.md)** |
| **Deploy** | Static export (`output: 'export'` → `out/`). Netlify config in `netlify.toml`. Also works on plain shared hosting. |

---

## 📸 PLANNED (next session): real destination & city photos + lightbox

> **Reminder for the next working session.** The user will provide image folders.

**What the user will deliver:** folders of **actual photos** for destinations and cities.
- Each **folder name** = the destination or city (e.g. `hunza/`, `lahore/`).
- Each **file name inside** = the place/spot it depicts (e.g. `attabad-lake.jpg`).

**What to do when the photos arrive:**
1. **Use only the provided photos.** Remove every generic / internet-fetched image
   (current Pexels heroes in `public/destinations/*.jpg`, `public/scenery/*`,
   `public/hotels/*`) and replace with the user's real ones. (Panjpeer already uses
   real user photos — keep those.)
2. Place them under `public/destinations/<id>/` and `public/cities/<id>/`, mapped to
   each spot/place by filename.
3. **Caption from filename:** turn the file name into a decent, human-readable label
   (e.g. `attabad-lake.jpg` → "Attabad Lake") and overlay it in a **corner of the image**.
4. **Lightbox ("lightstudio"):** clicking any photo opens it fullscreen with
   **zoom in / zoom out** (and pan) and a close button. Build a reusable client
   component and use it for destination spots/galleries and city places.

Status: **ready and waiting for the folders.**

---

## 🆕 First-time setup on a new machine (READ THIS FIRST)

The repo contains **only source code (~37 files)**. Dependencies (`node_modules`,
20k+ files) and the build cache (`.next`) are **gitignored** — they are *generated
locally*, not stored in the repo. That's why the download is tiny; nothing is missing.

**Setup steps (for an AI or a developer):**

1. **Check prerequisites.** Run `node --version` (need ≥18.18) and `git --version`.
2. **If a tool is missing, install it, then continue:**
   - **Node.js** — Windows: `winget install OpenJS.NodeJS.LTS` · macOS: `brew install node` · Linux: `sudo apt install nodejs npm`
   - **Git** — Windows: `winget install Git.Git` · macOS: `brew install git` · Linux: `sudo apt install git`
3. **Install dependencies (this generates `node_modules/`):**
   ```bash
   npm install
   ```
4. **Run it:** `npm run dev` → open http://localhost:3000
5. **(Optional) regenerate derived files:** `npm run gen:distances`

> No API keys, database, or paid services required for Phase 1. Internet is needed
> once for `npm install`. Pushing changes back needs GitHub auth (`gh auth login`).

---

## 🚀 Scripts

| Command | Does |
|---------|------|
| `npm run dev` | Dev server (hot reload) |
| `npm run build` | Production build (generates `.next/`) |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run gen:distances` | Rebuild `DISTANCES.md` + `data/distances.csv` (legacy estimate) |
| `npm run gen:roads` | Rebuild the **real** OSRM road-distance matrix (`src/data/road-distances.json`) |
| `npm run update:fuel` | Fetch official fuel prices → update JSON |
| `npm run check:fuel` | Report price freshness (flags stale data) |

---

## 📂 Structure

```
src/lib/data.ts            # 🔑 81 cities, 17 destinations, 20 vehicles, prices
src/lib/planner.ts         # 🔑 Cost engine + planPointToPoint (any-to-any)
src/lib/content.ts         # Destination guides: spots, tracks, hotels, en-route
src/lib/city-attractions.ts# "Places to see" for every origin city
src/lib/catalog.ts         # Rentals & services categories
src/lib/route-info.ts      # Tolls, CC rules, docs, weather URL (Pillar 2)
src/lib/contact.ts         # WhatsApp / email links (no backend)
src/data/road-distances.json # 🔑 REAL OSRM road distance + drive-time matrix
src/data/fuel-prices.json  # 🔑 OGRA fuel prices (auto-updated weekly)
src/app/                   # /, /planner, /trip, /destinations/[id], /cities/[id],
                           # /rentals/[category], /services/[slug], /list-your-property
src/components/             # navbar (dropdowns), getting-there, trip-planner,
                           # savings-panel, hotel-card, explore-card, icons, …
scripts/                   # generate-road-distances.ts (OSRM), update-fuel-prices.ts
.github/workflows/fuel-price-check.yml   # fuel freshness emailer (2nd & 17th)
```

---

## 🧮 How the engine works (`src/lib/planner.ts`)

Per destination, from the user's inputs:

- **Distance & drive time** = **real OSRM/OpenStreetMap road route**, precomputed into `src/data/road-distances.json` (run `npm run gen:roads` to refresh). Great-circle × terrain factor is only a fallback for missing pairs.
- **Convoy** = `ceil(travelers ÷ vehicle seats)` — fuel & tolls scale with this
- **Fuel** = `round-trip km ÷ km/L × fuel price × convoy`
- **Hotel** = `tier rate × dest cost-factor × nights × people` (per person/night; standard ≈ Rs 1,500)
- **Food** = `tier rate × dest cost-factor × people × days` (standard ≈ Rs 1,500/person/day)
- **Misc** = tolls (per 100 km × convoy) + per-person activities + 10% buffer
- **Feasibility** = fits budget **and** enough days to drive there & back
- **Ranking** → Top picks · Also within reach · Stretch goals

All pure TypeScript, no network calls — results are instant.

---

## ⛽ Fuel prices

Single source of truth: `src/data/fuel-prices.json` (OGRA — Petrol 403.78, HSD
402.78, effective 23 May 2026). Shown on the landing + planner pages with date and
source. OGRA revises ~1st & 16th monthly.

**Keep current (all free, no API key):** edit the JSON manually · `npm run update:fuel`
(best-effort scrape, verify before commit) · the GitHub Action emails you when prices
go stale · or a scheduled AI refresh. Note: free price-aggregator scraping is
unreliable, so the project favours a verified JSON + reminders.

---

## 👥 Vehicle seating & convoys

Each vehicle has seats (bike 2, small car 4, sedan 5, SUV 7–8). Groups bigger than
one vehicle become a **convoy**, multiplying fuel + tolls (hotels/food stay
per-person). Shown in the form hint and results.

---

## 📜 Build log (latest first)

- **2026-05-31** — Fuel prices updated (Petrol 381.78, eff. 30 May, per OGRA/PSO); weekly auto-update routine.
- **2026-05-31** — **Real OSRM road distances + drive times** replace the straight-line estimate; +21 cities (81 total).
- **2026-05-31** — **Any-to-any trip planner** (`/trip`) added as a separate feature; nav "Plan" dropdown.
- **2026-05-31** — 80+ **starting-city pages** with researched "places to see"; per-person stay/food rates.
- **2026-05-31** — **Rebrand to Dare2Gear**; static-export + `netlify.toml`; deployed to Netlify.
- **2026-05-31** — Route Intelligence (weather, tolls, CC rules, docs, en-route, road-condition flow).
- **2026-05-31** — Destination guides (spots, dangerous tracks, hotel listings, photos); Explore gallery.
- **2026-05-27** — Lean README + new-machine setup; backlog moved to `ROADMAP.md`.
- **2026-05-27** — Live fuel prices (OGRA), on-site display, updater + freshness CI.
- **2026-05-27** — Vehicle seating + convoy logic.
- **2026-05-27** — 50 more cities (60 total, grouped by province) + distance reference.
- **2026-05-27** — Phase-1 MVP built + pushed: engine, landing, planner, design system.

---

## ⚠️ Disclaimer

All costs and distances are **estimates** for planning only — verify fuel, hotels and
road conditions before travelling. Drive safe.
