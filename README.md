# 🏔️ Dare to Gear

**Smart travel budget planner for Pakistan.** Enter your budget, group size, days,
starting city and vehicle → it calculates fuel, hotels and food, then recommends
which destinations you can afford (Murree → Hunza → Fairy Meadows) with a full cost
breakdown and how much you'll have left over.

| | |
|---|---|
| **Stack** | Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript |
| **Status** | Phase 1 MVP — works fully offline, no API keys/backend needed |
| **Repo** | github.com/mujtaba9598-hasan/Dare2GearWebApp |
| **Key files** | `src/lib/data.ts` (data) · `src/lib/planner.ts` (cost engine) |
| **Backlog** | see [ROADMAP.md](ROADMAP.md) for features to pick from |
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
| `npm run gen:distances` | Rebuild `DISTANCES.md` + `data/distances.csv` |
| `npm run update:fuel` | Fetch official fuel prices → update JSON |
| `npm run check:fuel` | Report price freshness (flags stale data) |

---

## 📂 Structure

```
src/lib/data.ts          # 🔑 Data: 60 cities, 15 destinations, 20 vehicles, prices
src/lib/planner.ts       # 🔑 Cost + recommendation engine (pure functions)
src/lib/format.ts        # PKR / km formatting
src/data/fuel-prices.json# 🔑 Single source of truth for fuel prices (OGRA)
src/app/                 # layout, landing (page.tsx), planner/page.tsx, globals.css
src/components/           # navbar, footer, planner-form, results-view,
                         # destination-card, cost-donut, fuel-prices, icons
scripts/                 # generate-distances.ts, update-fuel-prices.ts
DISTANCES.md, data/distances.csv   # 900-route distance reference (generated)
.github/workflows/fuel-price-check.yml  # fuel-price freshness CI (2nd & 17th)
```

---

## 🧮 How the engine works (`src/lib/planner.ts`)

Per destination, from the user's inputs:

- **Distance** = great-circle × terrain road-factor (1.35 highway → 1.65 rough)
- **Convoy** = `ceil(travelers ÷ vehicle seats)` — fuel & tolls scale with this
- **Fuel** = `round-trip km ÷ km/L × fuel price × convoy`
- **Hotel** = `tier rate × dest cost-factor × nights × rooms` (rooms = ⌈people/2⌉)
- **Food** = `tier rate × dest cost-factor × people × days`
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

- **2026-05-27** — Lean README + new-machine setup; backlog moved to `ROADMAP.md`.
- **2026-05-27** — Live fuel prices (OGRA), on-site display, updater + freshness CI.
- **2026-05-27** — Vehicle seating + convoy logic.
- **2026-05-27** — 50 more cities (60 total, grouped by province) + distance reference.
- **2026-05-27** — Phase-1 MVP built + pushed: engine, landing, planner, design system.

---

## ⚠️ Disclaimer

All costs and distances are **estimates** for planning only — verify fuel, hotels and
road conditions before travelling. Drive safe.
