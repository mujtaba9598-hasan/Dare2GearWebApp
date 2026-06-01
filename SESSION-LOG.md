# 🧾 Session Log

A running record of work sessions, decisions, and what's pending. Latest first.

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
