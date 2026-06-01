# 🏔️ Dare2Gear

**Travel planning platform for Pakistan.** Two core features:

- **🎁 Budget planner** (`/planner`) — *"I have Rs X, where can I go?"* → ranked destinations you can afford, with full cost breakdown.
- **🗺️ Plan a specific trip** (`/trip`) — any place → any place (e.g. Hunza → Karachi) with real road distance, drive time, fuel, stay, food and total.

Plus destination guides, 90+ starting-city pages, nearby-city day-trip suggestions, route intelligence (weather, tolls, docs), rentals/services catalogs, and live OGRA fuel prices.

| | |
|---|---|
| **Stack** | Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript |
| **Status** | Live travel platform — static export (Netlify), no backend / API keys |
| **Repo** | github.com/mujtaba9598-hasan/Dare2GearWebApp |
| **Key files** | `src/lib/data.ts` · `src/lib/planner.ts` (engine) · `src/lib/content.ts` · `src/lib/city-attractions.ts` · `src/data/road-distances.json` (real OSRM distances) |
| **Backlog** | see [ROADMAP.md](ROADMAP.md); **deferred-to-VPS items in [DEFERRED.md](DEFERRED.md)** |
| **Deploy** | Static export (`output: 'export'` → `out/`). Netlify config in `netlify.toml`. Also works on plain shared hosting. |

---

## 📸 Real photos + zoom lightbox (DONE — 2026-06-01)

Real, user-provided photos now power **21 destinations and 79 cities (437
photos)** across all provinces. Each photo shows its **name in a bar under the
image** and opens a **click-to-zoom lightbox** (zoom buttons + wheel + drag-pan
+ arrow keys + Esc).

**How it works**
- Photos live in `public/photos/{destinations,cities}/<id>/<slug>.<ext>`.
- `src/lib/photos.ts` is the **auto-generated** manifest (`{src, caption}` per
  place). **Do not hand-edit** — regenerate it with the importer.
- `src/components/photo-gallery.tsx` is the reusable gallery + lightbox.
- Heroes and `/destinations` thumbnails prefer a real photo via `destHero()`.

**To add more photos (quick action for next session)**
1. Make one folder per place: **folder name = the place**, **file names = the
   spots** (e.g. `Hunza/Attabad Lake.jpg`). Generic numbered files (e.g.
   `BABOON 001.jpg`) become un-captioned gallery shots.
2. If it's a **new** place, add the folder→id mapping in
   `scripts/import-photos.mjs` (and add the destination to `src/lib/data.ts` +
   a `CONTENT` entry in `src/lib/content.ts`).
3. Run `node scripts/import-photos.mjs` → copies photos + regenerates
   `src/lib/photos.ts`.
4. `npm run build` to verify, then commit + push (Netlify auto-deploys).

> **Still on scenery placeholders** (no real photos yet): `panjpeer`, and the
> three new AJK destinations `leepa`, `gangachoti`, `pirchinasi`. **TODO:**
> verify approximate coords for `baboonvalley` & `nooritop` in `data.ts`;
> compress the ~16 MB `mianwali/namal-lake.png`.

---

## 🔒 Restricted regions — Balochistan is OFF (how to turn it back ON)

For safety reasons, **Balochistan is hidden from every part of the site that
*recommends or promotes* a place** — silently, with **no on-screen warning**.
It is **not deleted**, just switched off behind one flag.

**The single switch** lives in `src/lib/data.ts`:

```ts
export const RESTRICTED_PROVINCES: ReadonlySet<string> = new Set(["Balochistan"]);
```

**To re-enable Balochistan later (when the situation improves):**
change that line to an **empty set** and redeploy —

```ts
export const RESTRICTED_PROVINCES: ReadonlySet<string> = new Set([]);
```

That one edit instantly brings everything back. Then `npm run build`, commit, push
(Netlify auto-deploys). To restrict a different province instead, just put its name
in the set (e.g. `new Set(["KPK"])`).

| Surface | While restricted |
|---|---|
| Budget planner recommendations | Balochistan **never suggested** |
| Budget planner "start from" dropdown | Balochistan cities **not listed** |
| `/destinations` explore gallery + home featured | Kund Malir **hidden** |
| Destination guide pages | Balochistan guide **not built** (404 on direct hit) |
| `/cities` browse + city detail pages | **KEPT** — Quetta, Gwadar, etc. stay searchable |
| Any-to-any `/trip` calculator | **KEPT** — e.g. Karachi → Quetta still gives a rough distance/cost only |

> Driven by helpers `isRestrictedProvince / isRestrictedOrigin / isRestrictedDestination`
> in `src/lib/data.ts`. Currently the only Balochistan destination is `kundmalir`
> (Kund Malir, region "Balochistan Coast").

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
| `node scripts/import-photos.mjs` | Import real photos from source folders → `public/photos` + regenerate `src/lib/photos.ts` |
| `npm run update:fuel` | Fetch official fuel prices → update JSON |
| `npm run check:fuel` | Report price freshness (flags stale data) |

---

## 📂 Structure

```
src/lib/data.ts            # 🔑 91 cities, 25 destinations, 20 vehicles, prices
src/lib/planner.ts         # 🔑 Cost engine + planPointToPoint (any-to-any)
src/lib/content.ts         # Destination guides: spots, tracks, hotels, en-route
src/lib/city-attractions.ts# "Places to see" for every origin city
src/lib/photos.ts          # 🔑 AUTO-GENERATED real-photo manifest (do not edit)
src/lib/catalog.ts         # Rentals & services categories
src/lib/route-info.ts      # Tolls, CC rules, docs, weather URL (Pillar 2)
src/lib/contact.ts         # WhatsApp / email links (no backend)
src/data/road-distances.json # 🔑 REAL OSRM road distance + drive-time matrix
src/data/fuel-prices.json  # 🔑 OGRA fuel prices (auto-updated weekly)
src/app/                   # /, /planner, /trip, /destinations/[id], /cities/[id],
                           # /rentals/[category], /services/[slug], /list-your-property
src/components/             # navbar (dropdowns), getting-there, trip-planner,
                           # savings-panel, hotel-card, explore-card, icons, …
src/components/photo-gallery.tsx # captioned gallery + click-to-zoom lightbox
scripts/                   # import-photos.mjs (real photos → public + manifest),
                           # generate-road-distances.ts (OSRM), update-fuel-prices.ts
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

- **2026-06-01** — **Nearby-city suggestions** + **sub-100km day trips** (no hotel) in the budget planner; any-to-any /trip now estimates distances for places missing from the OSRM matrix. Real photos for 16 Explorer destinations; +3 AJK destinations (Leepa, Ganga Choti, Pir Chinasi); Ziarat + Kund Malir added as cities. Now **91 cities / 25 destinations / 437 photos**.
- **2026-06-01** — **Balochistan restricted** from all automated discovery (security), reversible via `RESTRICTED_PROVINCES` in `data.ts`; cities kept for manual search. See "🔒 Restricted regions" above.
- **2026-06-01** — Real photos for **Sindh/KPK/Balochistan cities** (148 photos, 33 cities); `/cities` cards now show photo thumbnails; importer is now merge-safe.
- **2026-06-01** — Added **8 AJK origin cities** (Muzaffarabad, Kotli, Bagh, Bhimber, Palandri, Hattian Bala, Athmuqam, Forward Kahuta) with researched spots.
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
