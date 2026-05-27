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
7. [Future Roadmap (Phase 2 & 3)](#-future-roadmap)
8. [Disclaimer](#-disclaimer)

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
  Civic…), SUVs (Fortuner, Prado, Land Cruiser…) with real km/L averages.
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

---

## 📂 Project Structure

```
DISTANCES.md                # Reference: one-way road km, every city → destination
data/
└── distances.csv           # Same data, machine-readable (900 routes)
scripts/
└── generate-distances.ts   # Regenerates the two files above (npx tsx)
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
│   └── cost-donut.tsx      # SVG cost-breakdown donut
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
2. **Fuel** = `(round-trip km ÷ km-per-litre) × fuel price for that fuel type`
3. **Hotel** = `tier rate × destination cost-factor × nights × rooms`
   (rooms = travelers ÷ 2, nights = days − 1)
4. **Food** = `tier rate × destination cost-factor × travelers × days`
5. **Misc** = tolls/permits (per 100 km) + per-person activities + a 10% safety buffer
6. **Total** = fuel + hotel + food + misc
7. **Feasibility** — checks the total fits the **budget** *and* that there are
   **enough days** to realistically drive there and back (based on terrain-adjusted
   driving speed).
8. **Ranking** — destinations are scored by scenic value + how well they use the
   budget, then split into **Top picks**, **Also within reach**, and **Stretch goals**.

It's all pure TypeScript — no network calls — so results are instant.

---

## 🔮 Future Roadmap

These were part of the original vision and are **not built yet**. The codebase is
structured to make them straightforward to add.

### Phase 2 — Live data & backend
- [ ] 🗺️ **Google Maps API** — real road distances & routes instead of estimates
- [ ] ⛅ **Weather API** — live weather at each destination
- [ ] ⛽ **Live fuel price API** — auto-update petrol/diesel rates
- [ ] 🏨 **Hotel API** — real hotels with live prices and availability
- [ ] 🗄️ **Backend** — Node.js + Express + MongoDB to save trips & user accounts

### Phase 3 — AI & monetization
- [ ] 🤖 **AI chat assistant** — *"I have 60k, two people and a bike"* → conversational plan
- [ ] 💸 **Monetization** — hotel booking commissions, sponsored listings, tour
      packages, ads, and premium planner subscriptions
- [ ] 🖼️ Destination **photos** on cards
- [ ] 🌙 Dark mode
- [ ] 🔖 Save / share generated trip plans

> **How to extend:** the pricing knobs (`FUEL_PRICES`, `HOTEL_RATES`, `FOOD_RATES`)
> and the dataset live in `src/lib/data.ts`. Swap those for live API calls and the
> calculation engine keeps working unchanged.

---

## ⚠️ Disclaimer

All costs and distances are **estimates** for planning purposes only. Real fuel
prices, hotel rates and road conditions vary. Always carry an emergency buffer and
check current conditions before travelling. **Drive safe and travel responsibly.**

---

*Built with ❤️ for Pakistan's explorers.*
