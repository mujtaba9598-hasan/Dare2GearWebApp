// Global Smart Search index.
// Covers EVERYTHING across Pakistan that the site knows about, not just cities:
//   • Cities (every province)            • Destinations / valleys
//   • Lakes, passes, mountains, viewpoints, treks, villages, forts, shrines…
//   • Off-road / dangerous tracks        • City attractions
// Each spot links to its parent city/destination page. Results filter live as
// the user types (prefix-first ranking in the search component).

import { ORIGINS, DESTINATIONS, isRestrictedDestination } from "./data";
import { CONTENT, SPOT_LABELS } from "./content";
import { CITY_PLACES, CITY_PLACE_LABELS } from "./city-attractions";

export type SearchKind = "City" | "Destination" | "Spot";

export interface SearchItem {
  key: string;
  name: string;
  /** Parent place / area, shown as a subtitle. */
  sub: string;
  /** Short type chip, e.g. "City", "Trip", "Lake", "Pass". */
  tag: string;
  href: string;
  kind: SearchKind;
}

// Short, friendly chip labels for spot categories.
const SPOT_TAG: Record<string, string> = {
  lake: "Lake",
  valley: "Valley",
  fort: "Fort",
  viewpoint: "Viewpoint",
  trek: "Trek",
  town: "Village",
  beach: "Beach",
  religious: "Shrine",
  wildlife: "Wildlife",
  glacier: "Glacier",
  // city-place categories
  shrine: "Shrine",
  park: "Park",
  museum: "Museum",
  bazaar: "Bazaar",
  historical: "Historic",
  nature: "Nature",
  garden: "Garden",
};

const tagFor = (category: string, fallback: string) => SPOT_TAG[category] ?? fallback;

let CACHE: SearchItem[] | null = null;

/** Combined, de-duplicated global index for search. */
export function searchItems(): SearchItem[] {
  if (CACHE) return CACHE;

  const out: SearchItem[] = [];
  const seen = new Set<string>(); // de-dupe by lowercased name (first wins)
  const add = (it: SearchItem) => {
    const k = it.name.trim().toLowerCase();
    if (!k || seen.has(k)) return;
    seen.add(k);
    out.push(it);
  };

  // 1) Destinations (and their spots / tracks) — highest priority.
  for (const d of DESTINATIONS) {
    if (isRestrictedDestination(d)) continue;
    const href = `/destinations/${d.id}`;
    add({ key: `d-${d.id}`, name: d.name, sub: d.region, tag: "Trip", href, kind: "Destination" });

    const c = CONTENT[d.id];
    if (!c) continue;
    for (const s of c.spots) {
      add({
        key: `ds-${d.id}-${s.name}`,
        name: s.name,
        sub: `${SPOT_LABELS[s.category]} · ${d.name}`,
        tag: tagFor(s.category, "Spot"),
        href,
        kind: "Spot",
      });
    }
    for (const t of c.tracks ?? []) {
      add({
        key: `dt-${d.id}-${t.name}`,
        name: t.name,
        sub: `Off-road track · ${d.name}`,
        tag: "Off-road",
        href,
        kind: "Spot",
      });
    }
  }

  // 2) Cities (and their attractions).
  for (const o of ORIGINS) {
    const href = `/cities/${o.id}`;
    add({ key: `c-${o.id}`, name: o.name, sub: o.province, tag: "City", href, kind: "City" });

    for (const p of CITY_PLACES[o.id] ?? []) {
      add({
        key: `cp-${o.id}-${p.name}`,
        name: p.name,
        sub: `${CITY_PLACE_LABELS[p.category]} · ${o.name}`,
        tag: tagFor(p.category, "Spot"),
        href,
        kind: "Spot",
      });
    }
  }

  CACHE = out;
  return CACHE;
}
