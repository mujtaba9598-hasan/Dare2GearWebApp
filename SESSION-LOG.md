# 🧾 Session Log

A running record of work sessions, decisions, and what's pending. Latest first.

---

## Session — 2026-06-06 (cont.) — 10 new destinations

**Summary:** Added 10 new northern destinations from a folder drop, with photos,
corridor routing and image compression.

### Shipped
- **10 new destinations** (`data.ts`, total now **38**): `balakot`, `batakundi`,
  `battagram`, `goldenvalley` (Golen/Chitral), `haramosh`, `ishkoman`,
  `lowaritop`, `nakyal`, `siranvalley`, `thuipass`. Researched coords/region/
  tier/terrain/best-months/blurb/attractions.
- **Photos** imported via `scripts/import-photos.mjs` (new `New Destinations`
  folder→id map, gitignored raw source): copied to `public/photos/destinations/
  <id>/`, captions auto-derived, `photos.ts` regenerated. The importer's
  `loadExisting` MERGE preserved the hand-edited leepa/panjpeer/broghil/
  dudipatsar/shimshal galleries (verified). Existing **Pir Chinasi** also got its
  4 real photos.
- **Routing** (`corridors.ts`): all 10 route via the Islamabad corridor with
  researched legs (GB ones — Haramosh/Ishkoman/Thui — get a Babusar summer
  shortcut). `macroOfRegion` extended with `Hazara` + scoped `Golen`/`Lowari`
  tokens so existing Chitral/Broghil stay PLAINS. Distances verified sane (e.g.
  Karachi→Haramosh 1,962 km; none fall back to estimates).
- **Image optimisation**: oversized new photos downscaled to ≤1600px via sharp —
  Golden Valley **16 MB → 0.33 MB**, plus batakundi/karambar/lowari/thui.

### Key decisions
- Corridor legs + coords for the new places are **researched approximations**
  (lowest confidence: Golden Valley = Golen Gol valley near Chitral Gol; Thui
  Pass = remote Yarkhun–Ishkoman trekking pass). Routed via hub deterministically
  rather than re-running `gen:roads`, to avoid churning the whole OSRM matrix and
  the existing validated distances.

### Pending / next
- Refine the 10 new corridor legs + coords via `gen:roads` / Google spot-checks.
- Write long-form guide content for the 10 new places (they have data + photo
  galleries but not the richer pages older destinations have).

---

## Session — 2026-06-06

**Summary:** Copy/label renames across the site + a realistic, motorway-only
toll model (bikes toll-free), with one-way and round-trip shown separately.

### Shipped
- **Hotel classes renamed** (`data.ts` `HOTEL_TIER_LABELS`): Cheap → **Economy**,
  Standard → **Premium**, Luxury unchanged. Homepage value-prop bullet "Cheap to
  luxury" → "Economy to luxury". Internal keys (`cheap/standard/luxury`) and all
  pricing untouched.
- **Two planners renamed**: Budget planner → **Smart Trip Planner**, Specific
  trip → **Custom Trip Planner** — navbar "Plan" dropdown + the `/planner`
  eyebrow and `/trip` badge.
- **Rentals & Gear menu** (`catalog.ts` `navLabel`): **Rental Bikes / Camping
  Gears / Riding Gadgets / Touring Accessories** (Overview unchanged).
- **Services menu** (`catalog.ts` `navLabel`): **Travel Photographer / Expert
  Touring Advice / Partner Discounts** (Overview unchanged). Slugs/URLs and page
  `title`s unchanged in both menus.
- **Realistic toll model** (`planner.ts`): tolls now apply to the **motorway /
  plains portion only** at **Rs 4/km** (car class-1), reusing the corridor route
  split — `origin → Islamabad` = tolled motorway, `Islamabad → north` = toll-free
  KKH plus a fixed **expressway/tunnel allowance** (GB/Kaghan Rs 1,500, AJK
  Rs 600). **Bikes pay nothing** (banned from motorways; national highways
  toll-free). New `tripTolls()` returns **one-way + round-trip**; wired into the
  budget planner, nearby city trips, `/trip` results, and the destination
  "Getting there" panel. Dropped the old flat Rs 1.5/km (planner) and Rs 1.8/km
  (`route-info.ts`) estimates.
- **M-Tag toll breakdown**: toll display now shows **One Side** and **Round Trip**,
  each split **With M-Tag / Without M-Tag** (no tag = double toll at e-tag motorway
  plazas, NHA/FWO policy). New reusable `TollBreakdown` component wired into the
  destination "Getting there" panel and `/trip` results; trip totals use the
  With-M-Tag figure. Bikes show a toll-free note.

### Key decisions
- **Toll only on motorways/expressways**, never the whole distance — bikes can't
  use motorways (M-5 etc.) and national highways are largely toll-free.
- Rate calibrated against a real Karachi → Skardu breakdown: 1,419 km motorway ×
  Rs 4 + Rs 1,500 Hazara/tunnels = **~Rs 7,176 one-way / Rs 14,352 round trip**,
  squarely inside the user's stated Rs 6,000–9,500 one-way range.

### Pending (carried over)
- Redesign fork: light theme (Sample 1) + toggle, inner pages, image optimisation.
- **Domain transfer** blocked until **2026-06-09** (4-day hold; see
  `DOMAIN-TRANSFER-README.md`).
- **Logo** not yet generated/wired into header + favicon.
- Verify approx coords for `baboonvalley` / `nooritop`; compress
  `mianwali/namal-lake.png` (~16 MB).

---

## Session — 2026-06-05

**Summary:** Small homepage copy/colour tweaks + realism fixes to the original,
and a **separate dark-theme redesign fork** taken to a live landing page.

### Shipped (original app — `Dare2GearWebApp`)
- **Hero heading copy** — "Tell us your budget." → **"Tell us your budget and
  vehicle."**; later dropped "riding" → final wording "budget and vehicle".
- **Hero heading colours** — line 1 ("Tell us your budget and vehicle.") set to
  **black**; line 2 ("We'll tell you how far you can go.") now **fully green**
  (`text-brand-600`).
- **Hero paragraph trimmed** — removed the "from a short trip to a neighbouring
  town to the peaks of Hunza and Fairy Meadows." clause (earlier "short hop" had
  been changed to "short trip"). Now: "…your money can take you — Whatever's in
  your pocket, we'll turn it into a trip."
- **Honda CB 150F mileage** `data.ts` — **40 → 35 km/l** (realistic for touring
  / northern roads).
- **Per-destination min-day floors** `planner.ts` — added `DEST_MIN_DAYS`
  override on top of the generic 6-day far-north floor: **Hunza 7**, **Skardu
  8** days (other northern spots stay at 6). Applies in both the budget planner
  and `/trip`.

### Redesign fork (separate project — NOT this repo)
- Created `Downloads/d2g-redesign` as an **independent copy** (own git history,
  own GitHub repo `Dare2GearRedesign`, own host). The original is untouched.
- Re-skinned the **landing page only** to a dark + lime "adventure touring" look
  from supplied mockups (`image sample 2.jpeg`): grunge hero, interactive
  planner card, destinations carousel, dark navbar/footer. Real data/photos/links.
- Deployed to **GitHub Pages**:
  https://mujtaba9598-hasan.github.io/Dare2GearRedesign/ (Actions workflow,
  `basePath=/Dare2GearRedesign`, slim repo — only landing assets tracked).
- Full details + limitations live in that repo's `README.md`.

### Pending
- Redesign: light theme (Sample 1) + working toggle; inner pages; image
  optimisation. Original app continues on Cloudflare Workers as before.

---

## Session — 2026-06-03

**Summary:** Search fix, realistic trip-day planning, per-spot detail panels,
and a flat per-person cost model.

### Shipped
- **Search click fix** — dropdown results now navigate on click for partial
  queries (e.g. "Sialkot"/"Sialkot Fort" after typing "SIA"). Replaced the
  fragile blur-timer close in `city-search.tsx` with click-outside detection.
- **Realistic, vehicle-aware trip days** (`planner.ts`):
  - Bikes ride ~6 driving h/day in the mountains, cars/4x4 ~9 → long rides need
    more travel days (Sialkot/Lahore → Skardu by bike ≈ 3 days each way).
  - Sightseeing days scale with the destination (1–3).
  - **6-day minimum** for the far-flung north (Gilgit-Baltistan / Ghanche /
    expedition-tier) in BOTH the budget planner and `/trip`. (User confirmed
    "keep" after a brief "remove".)
  - New `needMoreDays` bucket + a "Worth it — with a few more days" section in
    results, with an "add N days" nudge. `/trip` shows the same advisory.
- **Per-spot detail panel** — clicking a photo's **caption** (e.g. "Basho
  Valley") opens a focused modal (`spot-detail-modal.tsx`) with that spot's OWN
  vehicle/cc recommendation + practicality, computed for the spot (terrain
  derived from its category + parent via `lib/spots.ts`), not the whole region.
  Wired into `photo-gallery.tsx` (captions become buttons when `parentId` +
  `parentKind` are passed); enabled on destination AND city pages. Clicking the
  **photo** still zooms as before.
- **Flat per-person cost model** — food & stay now bill the flat per-person-
  per-day tier rate with **no remote cost-factor premium**: cheap **1000**,
  standard **1500**, luxury **2000** (each, for both meals and lodging), scaling
  only with people × days. e.g. 2 luxury travellers = Rs 4000 food + Rs 4000
  stay/day anywhere. (`HOTEL_RATES`/`FOOD_RATES` luxury 3500/3000 → 2000/2000;
  removed `* costFactor` from hotel/food in `planDestination` &
  `planPointToPoint`.) Planner tier label fixed to "/person·night".

### Notes
- `dest.costFactor` / `TripPlace.costFactor` are no longer applied to lodging or
  food (kept on the type; unused in cost now). Reintroduce as an explicit line
  item if a remote premium is wanted again.
- Deleted the `new locations/` raw upload folder after its 19 images were copied
  into `public/photos/destinations/{broghil,dudipatsar,shimshal,leepa}` and
  committed.

---

## Session — 2026-06-02

**Summary:** Global search, a route-practicality / vehicle-fit system, 3 new
northern destinations, and several UI fixes. Destinations **25 → 28**.

### Shipped
- **Global Smart Search** — new `src/lib/search-index.ts` indexes **everything**:
  every city (all provinces), every destination, and **every spot inside them**
  (lakes, valleys, passes, viewpoints, treks, villages, off-road/danger tracks,
  city attractions). Component renamed `CitySearch → SiteSearch`
  (`src/components/city-search.tsx`) with prefix-first live autocomplete,
  keyboard nav, highlight, and type chips (City / Trip / Lake / Pass…). Mounted
  in the **/cities hero** and in the **nav bar** (compact on desktop, full-width
  in the mobile drawer).
- **Route practicality & vehicle fit** — new `src/lib/biker.ts` +
  `src/components/biker-practicality.tsx` on **every destination page**:
  - 11 readiness signals (road, dangerous patches, steep climbs, off-road, fuel
    / network / mechanic / puncture coverage, weather, rider fatigue, rest
    stops), all derived from terrain / region / season / en-route towns.
  - Interactive recommender: pick **bike cc / car / 4x4 + pillion + luggage** →
    0–100 suitability score, auto-warnings, **last safe parking** (Google Maps
    link) and a park-&-hire-jeep recommendation for 4x4-only approaches.
  - **No jeep-fare numbers** — per user, fares aren't fixed; the system says to
    **agree the rate on the spot**. `RouteAccess.jeepNote` carries only a
    qualitative description, never a price.
  - Recommended vehicle type + cc tagged with a **"Best"** badge.
  - Per-place access data hand-authored for the off-road spots (Fairy Meadows,
    Baboon Valley, Noori Top, Naltar, Raati Gali, Deosai, Astore, Leepa,
    Gorakh…); everything else uses terrain-derived defaults.
- **3 new destinations** (full guide pages): **Broghil Valley** (Upper Chitral),
  **Dudipatsar Lake** (Kaghan), **Shimshal Valley** (Hunza) — data + CONTENT +
  real photo galleries from the user's `new locations/` upload.
- **Leepa Valley photos** — 5 real named spot photos (Reshian Gali, Dao Khun,
  Chananian, Leepa Bazaar, Naullishaw) wired in; **Panjpeer** 3 real photos
  wired earlier this session. Both off the scenery placeholders now.
- **Bike rename** — generic bike (40 km/L) → **"Touring Bike 250cc" @ 30 km/L**
  (`bike-other`).
- **Nav Explore menu** restructured: All destinations, Starting cities, then a
  **"Top 10 places to see"** heading + 10 destinations tagged **GB / AJK / KPK**.
- **Fuel price bar** restyled bolder (amber-100 fill, amber-400 border + left
  accent stripe) while keeping text dark/readable.

### Decisions / notes
- `src/lib/photos.ts` is now **hand-edited** for places outside the importer's
  source roots (panjpeer, leepa, broghil, dudipatsar, shimshal) — the raw
  importer folders were deleted, so the one-shot importer no longer round-trips
  these. Manual additions are marked with a comment.
- **Baboon Valley ≠ Bashoo Valley** — they are *separate* places. A mid-session
  rename of Baboon→Bashoo was **reverted**. Bashoo Valley is **not yet** in the
  dataset (needs region / coords / photos to add as a new destination).

### Pending / told user
- New destinations (broghil, dudipatsar, shimshal) + baboonvalley/nooritop use
  **approximate coords** — refine for exact planner distances.
- **Bashoo Valley** to be added as a separate destination once coords/photos
  arrive.

## Session — 2026-06-01 (part 3)

**Summary:** Big content + planner-feature batch. Cities **90**, destinations
**25**, **485 photos** (90 cities + 21 destinations with real photos).

### Shipped
- **Photos** — real photos for **16 Explorer destinations** (Murree, Naran,
  Swat, Neelum, Nathia Gali, Gilgit, Chitral, Deosai, Khunjerab, Fairy Meadows,
  Gorakh, Rawalakot + new spots merged into Khaplu/Naltar/Noori Top/Raati Gali)
  and **9 AJK cities** (Muzaffarabad, Mirpur, Bagh, Bhimber, Palandri, Hattian
  Bala, Athmuqam, Forward Kahuta, Kotli) + **Kund Malir & Ziarat** cities.
  Importer now **union-merges** per id (`mergePhotoMaps`) so re-runs never drop
  existing photos.
- **Ziarat + Kund Malir** added as Balochistan **cities**; Kund Malir removed as
  a destination (its guide content deleted). Both stay hidden from auto-discovery
  (Balochistan restriction) but searchable + usable in manual /trip.
- **3 AJK destinations** in Explorer: **Leepa Valley, Ganga Choti (Bagh),
  Pir Chinasi (Muzaffarabad)** — full CONTENT guides (scenery placeholders).
- **Honda CG 125** default mileage **45 → 40** km/L (manual override kept).
- **Nearby-city suggestions** — budget planner now has a "Closer to home" section
  recommending nearby cities + their attractions within budget (Sialkot→Narowal,
  Karachi→Hyderabad…), closest first, restricted provinces excluded.
- **Sub-100km day trips** — one-way ≤100 km ⇒ no hotel, fuel + one day's food,
  labelled "short day trip". Applies to budget planner + any-to-any /trip.
- **/trip great-circle fallback** — places not yet in the OSRM matrix (AJK cities,
  Ziarat, Kund Malir, new AJK destinations) now return a rough estimate instead
  of "no route data".
- **Navbar** Explore menu now links 4 AJK city pages (Muzaffarabad, Mirpur, Bagh,
  Kotli).
- **Homepage hero** copy broadened: province-to-province, city-to-city, short
  day trips and long adventures — "whatever's in your pocket, we'll turn it into
  a trip."
- **Removed**: Daska Fort (no such fort — photo + spot deleted), **Muridke**
  (removed from Punjab cities).

### Key decisions
- `mergePhotoMaps` union keeps committed photos when source folders are absent
  (they're gitignored + ephemeral) — never regenerate the manifest from scratch.
- Day-trip threshold = `DAY_TRIP_KM = 100` (one-way) in `planner.ts`.
- Nearby cities drawn from existing ORIGINS that have `cityPlaces`, within budget.

### Hosting — migrated to Cloudflare (LIVE)
- Netlify free **bandwidth exceeded** (photo-heavy site). Moved to **Cloudflare
  Workers static assets** via `wrangler.jsonc` (`assets.directory: ./out`),
  build `npm run build`, deploy `npx wrangler deploy`. Unlimited bandwidth,
  root domain (no basePath). `.node-version`=20.
- **`package-lock.json` NOT committed** (gitignored): Cloudflare `npm ci`
  rejected the Windows-built lock over `@emnapi/*` Linux optional deps; without
  a lock it runs `npm install` and resolves fine. Trade-off: no build caching.
- Auto-deploys on push to main, same as before. `netlify.toml` left but unused.

### Pending / next session
- 4 destinations still on scenery placeholders (no real photos): `panjpeer`,
  `leepa`, `gangachoti`, `pirchinasi`.
- Optional: compress photos (~126 MB; 16 MB `mianwali/namal-lake.png`) for
  faster loads. Optional: custom domain (e.g. dare2gear.pk) in Cloudflare.
- Old TODOs: verify `baboonvalley`/`nooritop` coords; compress 16 MB
  `mianwali/namal-lake.png`.
- New cities (AJK, Ziarat, Kund Malir, AJK destinations) use the great-circle
  fallback for distances — run `gen:roads` (needs an OSRM that allows >100
  coords; public demo caps at 100) to upgrade them to real road distances.

---

## Session — 2026-06-01 (part 2)

**Summary:** Added 8 AJK cities, imported real photos for Sindh/KPK/Balochistan
cities, gave `/cities` cards photo thumbnails, and **restricted Balochistan**
from all automated discovery (security) in a reversible way.

### Shipped
- **8 new AJK origin cities** (Muzaffarabad, Kotli, Bagh, Bhimber, Palandri,
  Hattian Bala, Athmuqam, Forward Kahuta) + researched "places to see".
  Skipped Mirpur (=`mirpurajk`) & Rawalakot (already a destination).
- **148 real photos** for 33 existing Sindh/KPK/Balochistan cities. Importer
  (`scripts/import-photos.mjs`) now **merges** into the manifest instead of
  regenerating from scratch (ephemeral source folders no longer wipe entries).
- `/cities` cards now show a **real photo thumbnail** via `cityHero()`.
- Removed the **Daska Fort** spot + photo (no such fort exists).

### 🔒 Balochistan restriction (READ — important + reversible)
- Balochistan is hidden from everything that **recommends/promotes** a place
  (budget planner, explore gallery, home featured, destination guide pages) —
  **silently, no on-screen warning** (per user: a warning could stir tensions).
- **Kept manual:** `/cities` browse + Balochistan city pages stay searchable;
  the any-to-any `/trip` calculator still does e.g. Karachi → Quetta with a
  **rough distance/cost only** (no other services).
- **The switch:** `RESTRICTED_PROVINCES` in `src/lib/data.ts`. **To re-enable
  later:** change `new Set(["Balochistan"])` → `new Set([])`, build, commit,
  push. Full details + table in **README "🔒 Restricted regions"**.

### Pending / next session
- README counts are slightly stale now (says 81 cities / 221 photos; actually
  **89 cities**, **369 photos**, 79 cities-with-photos). Refresh when convenient.
- Earlier follow-ups still open: verify `baboonvalley` & `nooritop` coords;
  compress `mianwali/namal-lake.png` (~16 MB).

---

## Session — 2026-06-01

**Summary:** Replaced internet placeholder images with the user's own photos
(221 total) for 9 northern destinations + 46 Punjab cities, added a
click-to-zoom lightbox gallery with captions under each image, and added 5
new destinations that arrived as photo folders.

### Shipped
- **221 real photos imported** via `scripts/import-photos.mjs` (one-shot):
  copies into `public/photos/{destinations,cities}/<id>/<slug>.<ext>` and
  generates the typed manifest `src/lib/photos.ts` (`{src, caption}`; caption
  = reworked filename, **blank** for generic numbered shots like "NALTOR 001").
- **PhotoGallery** (`src/components/photo-gallery.tsx`, client component):
  caption shown **UNDER** each image in a dark `bg-ink` bar (always readable);
  lightbox with zoom buttons + mouse-wheel + drag-pan + arrow-key nav + Esc.
- Wired into **destination** & **city** detail pages; hero + the
  `/destinations` grid thumbnails (`explore-card.tsx`) now use a real photo
  via `destHero()`.
- **5 new destinations** (came as folders): `shigar`, `naltar`, `nooritop`,
  `raatigali`, `baboonvalley`.
- **Removed** the earlier standalone `sarfaranga` + `katpana` (Katpana is a
  Skardu spot in the folders; no Sarfaranga folder) and the placeholder
  images that had been used for `khaplu`.
- Raw source folders/zips gitignored — only `public/photos` is committed.

### Key decisions
- **Folders are the source of truth**: folder = place (mapped to its id),
  filename = spot name (→ caption). Re-run the importer after adding folders.
- Caption moved from "corner overlay" to a **bar under the image** (user:
  text on top of photos isn't always visible).

### Pending / next session
- **Verify coords** in `data.ts`: `baboonvalley` (36.0, 74.0) and `nooritop`
  (34.9, 73.75) are approximate guesses — they affect distance/fuel results.
- **Compress** `public/photos/cities/mianwali/namal-lake.png` (~16 MB).
- Destinations with **no photos yet** still use Pexels placeholders: murree,
  nathiagali, naran, swat, neelum, rawalakot, gorakh, kundmalir, gilgit,
  chitral, deosai, khunjerab, fairymeadows, panjpeer.
- **Logo**: 5 AI prompts provided (brand teal #0D9488 / amber #F59E0B / ink
  #0F172A). Logo not yet generated or wired into the header/favicon.

### To add more photos later (quick action)
1. Drop a folder per place; folder name = the place, file names = the spots.
2. Add the folder→id mapping in `scripts/import-photos.mjs` if it's a new place.
3. Run `node scripts/import-photos.mjs` → regenerates `src/lib/photos.ts`.
4. `npm run build` to verify, then commit + push (Netlify auto-deploys).

---

## Session — 2026-05-31

**Summary:** Expanded Dare2Gear from a single budget planner into a full travel
platform, fixed distance accuracy, and deployed to Netlify.

### Shipped
- **Rich destination guides** (`/destinations/[id]`): spots, hidden gems, **dangerous off-road tracks** (required bike + skill), **hotel listings** (≤ Rs 2,500, WhatsApp/email inquiry), photo gallery, **en-route stops**, and a **"Getting there"** panel (origin picker → route, live weather via Open-Meteo, tolls, bike CC rules, documents, road-condition request flow).
- **Explore gallery** (`/destinations`) + **dropdown navbar** (Explore / Plan / Rentals & Gear / Services) + footer links.
- **Budget planner v2**: per-person stay/food (≈ Rs 1,500 each), one-way vs round-trip split, "ways to save" + camping panel.
- **Any-to-any trip planner** (`/trip`): pick any place → any place (e.g. Hunza → Karachi); real distance, drive time, fuel, stay, food, tolls, total. Kept **separate** from the budget planner (per user).
- **Cities**: 81 origin cities total (added 21), each with a researched `/cities/[id]` "places to see" page.
- **New destinations**: Panjpeer Rocks (+ Narh Waterfall, real user photos), Rawalakot/Pearl Valley (AJK), Kumrat (under Swat), Baboon Meadows (under Neelum).
- **Rentals & Services** category pages (Coming Soon, inquiry-based): bikes/camping/gadgets/accessories; photographer/expert-advice/discounts.
- **List your property** page (contact-to-list; no self-upload).
- **Accurate distances**: replaced straight-line estimate with **real OSRM/OpenStreetMap** road distance + drive-time matrix (`src/data/road-distances.json`, via `npm run gen:roads`). e.g. Sialkot→Skardu now 849 km (was a wrong 495).
- **Rebrand** Dare to Gear → **Dare2Gear**.
- **Deploy**: static export (`output:'export'`) + `netlify.toml`; pushed to GitHub `main` (Netlify auto-deploys).
- **Fuel prices**: updated to OGRA/PSO 30 May 2026 (Petrol 381.78, HSD 380.78, HOBC 445). Scheduled **weekly Saturday** cloud routine auto-updates + pushes (runs remotely — no machine needed). Routine: https://claude.ai/code/routines/trig_01VLi7z8YarRJQHr1rwro5uS

### Key decisions
- **Hard constraint:** must run on **static / shared hosting** (no backend). Anything needing a server is parked in **`DEFERRED.md`**.
- Two features kept **separate & visible**: budget "surprise me" planner vs any-to-any trip.
- Photos: free Pexels placeholders for now; **real photos coming next session** (see below).
- Distances: free OSRM (OpenStreetMap) instead of paid Google API; precomputed so the site stays static.

### Pending / next session
- **📸 Real photos** (see README "PLANNED"): user provides folders (folder = place, filenames = spots). Replace all generic/Pexels images, caption from filename in a corner, add click-to-zoom **lightbox**. Research city attractions for any city still missing them.
- Optional: drop "Farooka" was skipped from the city list (low confidence) — add if wanted.

### Reminder books
- **`DEFERRED.md`** — features that need a VPS/backend (rental booking+payment+inventory; membership/paid expert advice). Build later.
- **README "📸 PLANNED"** — the photos + lightbox task.

### Contacts used (no-backend inquiry flow)
WhatsApp/Call **+92 300 9618442** · email **info@dare2gear.pk** (placeholder domain).
