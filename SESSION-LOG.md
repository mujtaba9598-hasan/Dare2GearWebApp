# 🧾 Session Log

A running record of work sessions, decisions, and what's pending. Latest first.

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
