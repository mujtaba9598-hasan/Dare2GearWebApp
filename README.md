# 🏔️ Dare to Gear — Smart Travel Budget Planner for Pakistan

> **Tell us your budget. We'll tell you how far you can go.**

Dare to Gear turns the cash in your pocket into a real, costed trip plan. You enter
your budget, group size, days off, starting city and your vehicle — and the app
calculates fuel, hotels and food, then recommends exactly which Pakistani
destinations you can afford, from Murree to Hunza and Fairy Meadows.

---

## 📑 Table of Contents

1. [The Idea / Requirement](#-the-idea--requirement)
2. [Current Progress (Phase 1 ✅)](#-current-progress--phase-1-done)
3. [Tech Stack](#-tech-stack)
4. [Getting Started](#-getting-started)
5. [Project Structure](#-project-structure)
6. [How the Calculation Engine Works](#-how-the-calculation-engine-works)
7. [Fuel Prices](#-fuel-prices-kept-current-free-no-api-key)
8. [Vehicle Seating & Convoys](#-vehicle-seating--convoys)
9. [Feature Backlog — Pick What's Next](#-feature-backlog--pick-whats-next)
10. [Build Log](#-build-log)
11. [Disclaimer](#-disclaimer)

---

## 🎯 The Idea / Requirement

**Dare to Gear** is a touring-company website for Pakistan whose core feature is a
**smart travel budget planner + trip recommendation system**.

The website should let a user enter:

- 💰 **Budget** (e.g. 50,000 PKR)
- 👥 **Number of travelers**
- 📅 **Days available**
- 🏙️ **Starting city**
- 🏍️ **Vehicle type** (Bike / Car / SUV) + model + fuel average (km/L)
- 🏨 **Hotel preference** (Cheap / Standard / Luxury)

And the website should tell them:

- ✅ **How far** they can travel and **how many kilometres** they can cover
- ✅ **Which cities / tourist destinations** they can realistically visit
- ✅ Detailed estimated expenses for **fuel, accommodation, food and other costs**
- ✅ The **total trip cost** and whether it fits the budget and the days available

**Example:** *"I have 50,000 PKR, 2 people, a car, and 4 days, starting from Lahore"*
→ the planner recommends Naran & Kaghan, shows the full cost breakdown, and tells
you how much you'll have left over.

---

## ✅ Current Progress — Phase 1 (Done)

A **fully working MVP** has been built. The calculator works **completely offline**
using a built-in Pakistan travel dataset — **no API keys or backend required yet.**

### What's built

| Area | Status | Notes |
|------|--------|-------|
| 🏠 Landing page | ✅ | Hero, sample plan card, "how it works", budget-sorted destinations, CTA |
| 🧮 Trip planner page | ✅ | Full input form → instant ranked results |
| ⚙️ Budget calculation engine | ✅ | Fuel, hotel, food, tolls + buffer, feasibility |
| 🗺️ Destination recommender | ✅ | Ranks "Top picks", "Also within reach", "Stretch goals" |
| 📊 Cost-breakdown donut chart | ✅ | Per-trip visual breakdown (custom SVG, no chart library) |
| 🏙️ 60 origin cities | ✅ | Every province, grouped by province in the dropdown |
| 📏 Distance reference | ✅ | Auto-generated `DISTANCES.md` + `data/distances.csv` (900 routes) |
| 👥 Vehicle seating & convoys | ✅ | Multiple vehicles when group exceeds seats; fuel + tolls scale |
| ⛽ Live fuel prices | ✅ | OGRA rates shown on site + single-source JSON + freshness automation |
| 🎨 Design system | ✅ | Clean minimal: teal + amber on slate, Sora/Inter fonts, SVG icons |
| 📱 Responsive + accessible | ✅ | Mobile-first, keyboard focus states, labelled inputs |

### Built-in data (editable in `src/lib/data.ts`)

- **60 starting cities** across every province — Karachi, Lahore, Islamabad,
  Peshawar, Quetta plus 50 more (Gujranwala, Sialkot, Bahawalpur, Multan, Larkana,
  Mardan, Abbottabad, Gwadar, Mirpur AJK, and many others), grouped by province in
  the planner dropdown.
- **15 destinations** — Murree, Naran, Swat, Neelum, Hunza, Skardu, Gilgit, Chitral,
  Fairy Meadows, Deosai, Khunjerab, Gorakh Hill, Kund Malir and more, each tagged with
  region, budget tier, cost factor, scenic score, best season and attractions.
- **~20 vehicle presets** — bikes (Honda CD 70, CG 125…), cars (Alto, Corolla,
  Civic…), SUVs (Fortuner, Prado, Land Cruiser…) with real km/L averages **and
  seating capacity** (used for convoy maths).
- **Editable pricing knobs** — fuel prices (petrol/diesel/hi-octane), hotel rates per
  tier, food rates per tier. These are isolated so a **live API can replace them later
  without touching the engine.**

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 16** (App Router) |
| UI | **React 19** |
| Styling | **Tailwind CSS v4** |
| Language | **TypeScript** |
| Fonts | Sora (display) + Inter (body) via `next/font` |
| Icons | Custom inline SVG set (Lucide-style) |

---

## 🚀 Getting Started

> Requires **Node.js 18.18+** (developed on Node 25). Comes with npm.

```bash
# 1. Clone the repo
git clone https://github.com/mujtaba9598-hasan/Dare2GearWebApp.git
cd Dare2GearWebApp

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
# → open http://localhost:3000

# 4. Production build (optional)
npm run build
npm start
```

### Available scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the local dev server (hot reload) |
| `npm run build` | Create an optimized production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run gen:distances` | Regenerate `DISTANCES.md` + `data/distances.csv` from the dataset |
| `npm run update:fuel` | Fetch latest official fuel prices and update `src/data/fuel-prices.json` |
| `npm run check:fuel` | Report parsed-vs-stored prices and flag if stored data is stale |

---

## 📂 Project Structure

```
.github/workflows/
└── fuel-price-check.yml    # Scheduled freshness check that emails you (2nd & 17th)
DISTANCES.md                # Reference: one-way road km, every city → destination
data/
└── distances.csv           # Same data, machine-readable (900 routes)
scripts/
├── generate-distances.ts   # Regenerates DISTANCES.md + distances.csv (npx tsx)
└── update-fuel-prices.ts   # Fetches/validates official fuel prices, updates JSON
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, navbar + footer
│   ├── globals.css         # Tailwind theme tokens (brand colors, fonts, utilities)
│   ├── page.tsx            # Landing page
│   └── planner/
│       └── page.tsx        # Trip planner page
├── components/
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── icons.tsx           # SVG icon set
│   ├── planner-form.tsx    # The interactive input form (client component)
│   ├── results-view.tsx    # Results dashboard (summary + recommendations)
│   ├── destination-card.tsx# Single destination plan card
│   ├── cost-donut.tsx      # SVG cost-breakdown donut
│   └── fuel-prices.tsx     # Live fuel-price bar + card
├── data/
│   └── fuel-prices.json    # 🔑 Single source of truth for fuel prices (OGRA)
└── lib/
    ├── data.ts             # 🔑 Dataset: cities, destinations, vehicles, prices
    ├── planner.ts          # 🔑 Calculation + recommendation engine (pure functions)
    └── format.ts           # PKR / km formatting helpers
```

**The two files that matter most:** `src/lib/data.ts` (the data) and
`src/lib/planner.ts` (the maths). Everything else is presentation.

---

## 🧮 How the Calculation Engine Works

For every destination, given the user's inputs, the engine in `src/lib/planner.ts`:

1. **Distance** — great-circle (haversine) distance between origin and destination,
   multiplied by a terrain road-winding factor (1.35 highway → 1.65 rough mountain
   track) to approximate real road distance.
2. **Convoy** — `vehicles needed = ceil(travelers ÷ vehicle seats)`. Fuel and
   tolls below are multiplied by this (each vehicle drives the whole route).
3. **Fuel** = `(round-trip km ÷ km-per-litre) × live fuel price × vehicles`
   (fuel price comes from `src/data/fuel-prices.json`)
4. **Hotel** = `tier rate × destination cost-factor × nights × rooms`
   (rooms = travelers ÷ 2, nights = days − 1)
5. **Food** = `tier rate × destination cost-factor × travelers × days`
6. **Misc** = tolls/permits (per 100 km × vehicles) + per-person activities + 10% buffer
7. **Total** = fuel + hotel + food + misc
8. **Feasibility** — checks the total fits the **budget** *and* that there are
   **enough days** to realistically drive there and back (based on terrain-adjusted
   driving speed).
9. **Ranking** — destinations are scored by scenic value + how well they use the
   budget, then split into **Top picks**, **Also within reach**, and **Stretch goals**.

It's all pure TypeScript — no network calls — so results are instant.

---

## ⛽ Fuel Prices (kept current, free, no API key)

Fuel prices are the most time-sensitive input, so they live in **one source of
truth**: [`src/data/fuel-prices.json`](src/data/fuel-prices.json) — with the
values, effective date and the official source URL. The whole app reads from it,
and the planner + landing page **display the current rates** with the date and an
OGRA source link.

Current values are the official **OGRA** notification (Petrol Rs 403.78/L, HSD
Rs 402.78/L, effective 23 May 2026). Petrol & diesel are OGRA-regulated and
revised about every 15 days (around the 1st and 16th); hi-octane is not regulated
and varies by company.

**How to keep it updated — all free, no API key required:**

| Option | How | Reliability |
|--------|-----|-------------|
| ✍️ **Manual edit** | Open `src/data/fuel-prices.json`, change the numbers + `effectiveDate`. 10 seconds. | ⭐⭐⭐ Always works |
| 🤖 **Assistive script** | `npm run update:fuel` scrapes the public OGRA/PSO pages. Has guards (rejects garbage / identical petrol=diesel). **Eyeball before committing** — free price aggregators are inconsistent. | ⭐⭐ Best-effort |
| 🔔 **GitHub Action** | `.github/workflows/fuel-price-check.yml` runs on the 2nd & 17th and **emails you** if stored prices look stale, so you never forget. Uses the built-in token. | ⭐⭐⭐ Reliable reminder |
| 🗓️ **Scheduled AI refresh** | A twice-monthly Claude routine (`/schedule`) can look up the official rate, update the JSON and push — most reliable since the numbers are read with judgment, not regex. | ⭐⭐⭐ |

> **On API keys:** none are needed for any option above. There is no free official
> OGRA JSON API; paid commodity-price APIs exist but aren't required. The honest
> takeaway from testing: free web-scraping of price aggregators is *inconsistent*,
> so the project favours a verified JSON + reminders over silently committing
> scraped numbers.

---

## 👥 Vehicle Seating & Convoys

Each vehicle has a realistic seating capacity (bike = 2, small car = 4, sedan = 5,
SUV = 7–8). If the group is larger than one vehicle holds, the planner assumes a
**convoy** — `vehicles needed = ceil(travelers ÷ seats)` — and multiplies the
**fuel and tolls** accordingly (each vehicle drives the whole route), while hotels
and food stay per-person. The convoy size and its cost impact are shown in the
form hint and the results.

---

## 🧭 Feature Backlog — Pick What's Next

The full menu of features for the planner. ✅ = built, ⬜ = candidate to choose.
Tick a box (or just say which ones) and they get built in order.

### Core planning & calculation
- [x] Budget calculator (fuel, hotel, food, tolls, buffer)
- [x] Multi-vehicle convoy logic by seating capacity
- [ ] Day-by-day itinerary builder (route stops, overnight halts)
- [ ] Multi-destination / multi-city trips in one plan
- [ ] Return vs one-way / loop route options
- [ ] Per-person cost split ("each person pays Rs X")
- [ ] Adjustable buffer % and custom expense lines (tickets, permits, shopping)
- [ ] Reverse mode — pick a destination, get the minimum budget needed
- [ ] Best-time-to-go / season suitability per destination

### Live data & integrations
- [x] Live fuel prices (OGRA)
- [ ] Real road distance & routing (Google Maps / OpenRouteService)
- [ ] Live weather + forecast per destination
- [ ] Real hotel listings & prices (Booking.com / local APIs)
- [ ] Currency display + USD/PKR for foreign tourists
- [ ] Fuel-station locations along the route
- [ ] Road condition / closure alerts (snow, landslides)

### AI features
- [ ] AI chat assistant ("I have 60k, 2 people, a bike — plan it")
- [ ] Natural-language trip generation
- [ ] Smart re-planning ("make it 1 day shorter / Rs 10k cheaper")
- [ ] Personalized suggestions from past trips

### Maps & visuals
- [ ] Interactive map with route + pinned destinations
- [ ] Destination photo galleries
- [ ] Elevation / terrain profile of the drive
- [ ] Photo / 360° previews of spots

### User accounts & social
- [ ] Sign up / login
- [ ] Save, name & revisit trips
- [ ] Share trip plan via link
- [ ] Download / print plan as PDF
- [ ] Reviews & ratings for destinations / hotels
- [ ] Community trip templates ("copy this plan")

### Booking & monetization
- [ ] Hotel booking with commission
- [ ] Curated tour packages / guided trips
- [ ] Sponsored / featured hotels & ads
- [ ] Premium planner subscription
- [ ] Affiliate links (gear, insurance, rentals)

### Trip safety & logistics
- [ ] Packing checklist (auto by season / destination)
- [ ] Emergency contacts & nearby hospitals / police
- [ ] Required permits info (e.g. NOC for restricted areas)
- [ ] Group coordination (invite travelers, split costs)
- [ ] Offline plan download (no signal in the north)

### Content & discovery
- [ ] Destination guides / blog
- [ ] "Trending this season" & curated collections
- [ ] Filters (family-friendly, adventure, budget, accessible)
- [ ] Comparison view (compare 2–3 destinations side by side)

### UX polish
- [ ] Dark mode
- [ ] Urdu / multi-language support
- [ ] Mobile app (PWA or React Native)
- [ ] Email / WhatsApp the plan to yourself

### Backend (enables many of the above)
- [ ] Node.js + Express (or Next API routes) + MongoDB
- [ ] User accounts, saved trips, reviews storage

> **How to extend:** the pricing knobs (`FUEL_PRICES`, `HOTEL_RATES`, `FOOD_RATES`)
> and the dataset live in `src/lib/data.ts`. Swap those for live API calls and the
> calculation engine keeps working unchanged.

---

## 📜 Build Log

All work to date (most recent first). Pushed to
[github.com/mujtaba9598-hasan/Dare2GearWebApp](https://github.com/mujtaba9598-hasan/Dare2GearWebApp).

- **2026-05-27** — README brought fully up to date with progress + feature backlog.
- **2026-05-27** — Live fuel prices: OGRA values (Petrol 403.78 / HSD 402.78), single
  JSON source of truth, on-site price display, updater script, freshness GitHub Action.
- **2026-05-27** — Vehicle seating capacities + convoy logic (fuel & tolls scale with
  vehicles needed); convoy notices in form and results.
- **2026-05-27** — Added 50 more origin cities (60 total) grouped by province;
  generated `DISTANCES.md` + `data/distances.csv` (900 routes).
- **2026-05-27** — Pushed Phase-1 MVP to GitHub with detailed README.
- **2026-05-27** — Phase-1 MVP built: dataset, calculation + recommender engine,
  landing page, planner page, cost-breakdown donut, clean minimal design system.

---

## ⚠️ Disclaimer

All costs and distances are **estimates** for planning purposes only. Real fuel
prices, hotel rates and road conditions vary. Always carry an emergency buffer and
check current conditions before travelling. **Drive safe and travel responsibly.**

---

*Built with ❤️ for Pakistan's explorers.*
