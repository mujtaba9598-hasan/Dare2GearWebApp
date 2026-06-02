// Per-spot detail resolver.
// A photo caption / "things to see" entry (e.g. "Basho Valley", "Katpana Cold
// Desert") isn't a full Destination, but we still want to open a focused detail
// for it with its OWN vehicle recommendation. This builds a synthetic
// `Destination` for any spot — terrain derived from the spot's category and its
// parent place — so the same vehicle-fit engine (lib/biker.ts) can score it
// specifically, not the whole region.

import { DESTINATIONS, ORIGINS, type Destination } from "./data";
import { CONTENT } from "./content";
import { CITY_PLACES } from "./city-attractions";

export interface SpotContext {
  name: string;
  parentId: string;
  parentName: string;
  parentKind: "destination" | "city";
  /** short type label, e.g. "Lake", "Valley" (may be undefined if unmatched) */
  category?: string;
  blurb?: string;
  /** synthetic Destination so the vehicle-fit engine can score this spot alone */
  dest: Destination;
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Off-road / trail spots; valley/lake/viewpoint sit in between.
const ROUGH = new Set(["trek", "glacier"]);
const MIXED = new Set(["valley", "lake", "viewpoint", "wildlife", "nature", "beach"]);

function spotTerrain(
  category: string | undefined,
  region: string,
  parentTier: Destination["tier"] | "low",
  parentTerrain: Destination["terrain"],
): Destination["terrain"] {
  const northern = /gilgit-baltistan|ghanche/i.test(region) || parentTier === "high";
  if (!category) return parentTerrain;
  if (ROUGH.has(category)) return "rough";
  if (MIXED.has(category)) return northern || parentTerrain === "rough" ? "rough" : "mixed";
  // Forts, bazaars, shrines, museums, parks, towns — generally accessible.
  return parentTerrain === "rough" ? "mixed" : "highway";
}

/** Build a focused spot detail from a parent place + a spot/caption name. */
export function resolveSpot(
  parentId: string,
  parentKind: "destination" | "city",
  name: string,
): SpotContext | null {
  const key = name.trim().toLowerCase();
  if (!key) return null;

  if (parentKind === "destination") {
    const parent = DESTINATIONS.find((d) => d.id === parentId);
    if (!parent) return null;
    const spot = CONTENT[parentId]?.spots.find((s) => s.name.toLowerCase() === key);
    const terrain = spotTerrain(spot?.category, parent.region, parent.tier, parent.terrain);
    const dest: Destination = {
      ...parent,
      id: `${parentId}__${slug(name)}`,
      name,
      blurb: spot?.blurb ?? `${name} — a spot reached from ${parent.name}.`,
      attractions: [],
      terrain,
    };
    return {
      name,
      parentId,
      parentName: parent.name,
      parentKind,
      category: spot?.category,
      blurb: spot?.blurb,
      dest,
    };
  }

  const parent = ORIGINS.find((o) => o.id === parentId);
  if (!parent) return null;
  const place = (CITY_PLACES[parentId] ?? []).find((p) => p.name.toLowerCase() === key);
  const terrain = spotTerrain(place?.category, parent.province, "low", "highway");
  const dest: Destination = {
    id: `${parentId}__${slug(name)}`,
    name,
    region: parent.province,
    lat: parent.lat,
    lng: parent.lng,
    tier: "low",
    costFactor: 1.0,
    scenicScore: 60,
    bestMonths: "Year-round",
    blurb: place?.note ?? `${name} — a spot in ${parent.name}.`,
    attractions: [],
    terrain,
  };
  return {
    name,
    parentId,
    parentName: parent.name,
    parentKind,
    category: place?.category,
    blurb: place?.note,
    dest,
  };
}
