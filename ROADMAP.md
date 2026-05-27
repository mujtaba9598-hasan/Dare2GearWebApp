# Feature Backlog

Pick what to build next. `[x]` = built, `[ ]` = candidate.

## Core planning
- [x] Budget calculator (fuel, hotel, food, tolls, buffer)
- [x] Multi-vehicle convoy logic by seating capacity
- [ ] Day-by-day itinerary builder (stops, overnight halts)
- [ ] Multi-destination / multi-city trips
- [ ] One-way / loop route options
- [ ] Per-person cost split
- [ ] Adjustable buffer % + custom expense lines
- [ ] Reverse mode (pick destination → min budget needed)
- [ ] Season suitability per destination

## Live data & integrations
- [x] Live fuel prices (OGRA)
- [ ] Real road distance & routing (Google Maps / OpenRouteService)
- [ ] Live weather per destination
- [ ] Real hotel listings & prices
- [ ] USD/PKR currency display
- [ ] Fuel-station locations on route
- [ ] Road closure / snow alerts

## AI
- [ ] Chat assistant ("60k, 2 people, a bike — plan it")
- [ ] Natural-language trip generation
- [ ] Smart re-planning ("1 day shorter / 10k cheaper")
- [ ] Personalized suggestions from history

## Maps & visuals
- [ ] Interactive map with route + pins
- [ ] Destination photo galleries
- [ ] Elevation / terrain profile
- [ ] 360° previews

## Accounts & social
- [ ] Login / signup
- [ ] Save & revisit trips
- [ ] Share plan via link
- [ ] PDF download / print
- [ ] Reviews & ratings
- [ ] Community trip templates

## Booking & monetization
- [ ] Hotel booking (commission)
- [ ] Tour packages / guided trips
- [ ] Sponsored hotels & ads
- [ ] Premium subscription
- [ ] Affiliate links (gear, insurance, rentals)

## Safety & logistics
- [ ] Packing checklist (by season/destination)
- [ ] Emergency contacts & nearby hospitals/police
- [ ] Permits info (NOC for restricted areas)
- [ ] Group coordination (invite, split costs)
- [ ] Offline plan download

## Content & discovery
- [ ] Destination guides / blog
- [ ] Trending / curated collections
- [ ] Filters (family, adventure, budget, accessible)
- [ ] Side-by-side destination comparison

## UX polish
- [ ] Dark mode
- [ ] Urdu / multi-language
- [ ] Mobile app (PWA or React Native)
- [ ] Email / WhatsApp the plan

## Backend (enables many above)
- [ ] Node/Express or Next API routes + MongoDB
- [ ] User accounts, saved trips, reviews storage

---

## Phase 2 priorities (original plan)
Google Maps distances → Weather API → Hotel API → backend (Node/Express + MongoDB)
→ AI chat assistant → monetization.

**Extension note:** pricing knobs (`FUEL_PRICES`, `HOTEL_RATES`, `FOOD_RATES`) and
the dataset live in `src/lib/data.ts`. Swap them for live API calls and the engine
(`src/lib/planner.ts`) keeps working unchanged.
