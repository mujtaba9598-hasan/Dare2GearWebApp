// Dare2Gear — Biker Practicality System
// ---------------------------------------------------------------------------
// Turns each destination's structured facts (terrain, region, budget tier,
// best season, known danger tracks, en-route towns) into 11 rider-focused
// readiness signals. It deliberately derives from existing data instead of
// hand-listing shops/coordinates, so every destination gets consistent,
// defensible guidance — and adding a new destination needs no extra authoring.

import type { Destination } from "./data";
import { enRouteFor } from "./content";

export type SignalLevel = "good" | "moderate" | "warn";

export interface BikerSignal {
  /** Stable key — also used to pick the icon in the UI. */
  key:
    | "road"
    | "danger"
    | "climbs"
    | "offroad"
    | "fuel"
    | "network"
    | "mechanic"
    | "puncture"
    | "weather"
    | "fatigue"
    | "rest";
  label: string;
  /** Short status shown as a coloured badge. */
  value: string;
  /** One-line practical explanation. */
  detail: string;
  level: SignalLevel;
}

/**
 * 0 = accessible (plains / well-served hills)
 * 1 = moderately remote (mid-mountain valleys)
 * 2 = remote (high north / expedition country)
 */
function remoteness(d: Destination): 0 | 1 | 2 {
  const r = d.region.toLowerCase();
  if (r.includes("gilgit-baltistan") || r.includes("ghanche") || d.tier === "high") {
    return 2;
  }
  if (
    r.includes("azad kashmir") ||
    r.includes("kpk") ||
    r.includes("kaghan") ||
    r.includes("swat") ||
    r.includes("chitral") ||
    r.includes("neelum") ||
    d.terrain === "rough"
  ) {
    return 1;
  }
  return 0;
}

/** Nearest "civilisation" reference for spares/fuel wording. */
function nearestHub(d: Destination): string {
  const r = d.region.toLowerCase();
  if (r.includes("gilgit-baltistan") || r.includes("ghanche")) return "Gilgit / Skardu";
  if (r.includes("kaghan")) return "Mansehra / Balakot";
  if (r.includes("swat")) return "Mingora";
  if (r.includes("chitral")) return "Chitral town";
  if (r.includes("azad kashmir") || r.includes("neelum")) return "Muzaffarabad";
  if (r.includes("kpk")) return "Abbottabad";
  return "the nearest town";
}

const pick = <T,>(rem: 0 | 1 | 2, a: T, b: T, c: T): T => (rem === 0 ? a : rem === 1 ? b : c);

export function bikerPracticality(d: Destination): BikerSignal[] {
  const rem = remoteness(d);
  const hub = nearestHub(d);
  const stops = enRouteFor(d.id);

  // ---- 1. Road conditions (terrain) ----
  const road: BikerSignal = {
    key: "road",
    label: "Road conditions",
    ...(d.terrain === "highway"
      ? { value: "Good", detail: "Paved, well-maintained highway most of the way.", level: "good" as const }
      : d.terrain === "mixed"
        ? { value: "Mixed", detail: "Paved main road with broken and patchy stretches.", level: "moderate" as const }
        : { value: "Rough", detail: "Narrow, broken mountain road — ride slow and stay alert.", level: "warn" as const }),
  };

  // ---- 2. Dangerous patches ----
  const danger: BikerSignal = {
    key: "danger",
    label: "Dangerous patches",
    ...(d.terrain === "rough"
      ? {
          value: "High",
          detail: "Cliff-edge sections, blind hairpins and landslide-prone zones.",
          level: "warn" as const,
        }
      : d.terrain === "mixed"
        ? {
            value: "Some",
            detail: "A few narrow ledges and rockfall-prone bends — pass with care.",
            level: "moderate" as const,
          }
        : {
            value: "Few",
            detail: "Mostly safe; usual highway hazards (traffic, fog patches).",
            level: "good" as const,
          }),
  };

  // ---- 3. Steep climbs ----
  const climbs: BikerSignal = {
    key: "climbs",
    label: "Steep climbs",
    ...pick(
      rem,
      { value: "Gentle", detail: "Easy gradients — comfortable for any bike.", level: "good" as const },
      { value: "Moderate", detail: "Steep switchback sections; drop a gear and keep momentum.", level: "moderate" as const },
      { value: "Demanding", detail: "Long sustained climbs to high passes — taxes small-cc bikes.", level: "warn" as const },
    ),
  };

  // ---- 4. Off-road sections ----
  const offroad: BikerSignal = {
    key: "offroad",
    label: "Off-road sections",
    ...(d.terrain === "rough"
      ? { value: "Yes", detail: "Unpaved jeep track for the final stretch — knobbly tyres help.", level: "warn" as const }
      : d.terrain === "mixed"
        ? { value: "Short", detail: "A few short unpaved or under-construction patches.", level: "moderate" as const }
        : { value: "None", detail: "Fully sealed road — no off-road riding needed.", level: "good" as const }),
  };

  // ---- 5. Fuel station coverage ----
  const fuel: BikerSignal = {
    key: "fuel",
    label: "Fuel coverage",
    ...pick(
      rem,
      { value: "Frequent", detail: "Pumps all along the route — no need to carry spare fuel.", level: "good" as const },
      { value: "Adequate", detail: `Fill up in towns; top off before leaving ${hub}.`, level: "moderate" as const },
      { value: "Sparse", detail: `Long gaps past ${hub} — fill up and carry a spare can.`, level: "warn" as const },
    ),
  };

  // ---- 6. Mobile network ----
  const network: BikerSignal = {
    key: "network",
    label: "Mobile network",
    ...pick(
      rem,
      { value: "Strong", detail: "Reliable 4G coverage throughout the route.", level: "good" as const },
      { value: "Patchy", detail: "Solid in towns, drops out in deeper valleys.", level: "moderate" as const },
      { value: "Weak", detail: "Long dead zones — SCOM works best in the far north.", level: "warn" as const },
    ),
  };

  // ---- 7. Mechanic locations ----
  const mechanic: BikerSignal = {
    key: "mechanic",
    label: "Mechanics",
    ...pick(
      rem,
      { value: "Easy", detail: "Workshops widely available along the way.", level: "good" as const },
      { value: "In towns", detail: `Reliable mechanics in ${hub} and larger towns.`, level: "moderate" as const },
      { value: "Scarce", detail: `Only in main towns — carry basic tools and key spares.`, level: "warn" as const },
    ),
  };

  // ---- 8. Puncture shops ----
  const puncture: BikerSignal = {
    key: "puncture",
    label: "Puncture shops",
    ...pick(
      rem,
      { value: "Common", detail: "Easy to find a puncture-wala on the main road.", level: "good" as const },
      { value: "Limited", detail: "Found in towns; rare on remote stretches.", level: "moderate" as const },
      { value: "Rare", detail: "Almost none past the towns — carry a repair kit and spare tube.", level: "warn" as const },
    ),
  };

  // ---- 9. Weather warnings (season + remoteness) ----
  const weather: BikerSignal = {
    key: "weather",
    label: "Weather warnings",
    ...pick(
      rem,
      { value: "Mild", detail: `Best ${d.bestMonths}. Summer heat and the odd rain shower.`, level: "good" as const },
      { value: "Watch", detail: `Best ${d.bestMonths}. Rain brings fog and slippery bends — check the forecast.`, level: "moderate" as const },
      { value: "Serious", detail: `Ride only ${d.bestMonths}. Snow and landslides shut high passes off-season.`, level: "warn" as const },
    ),
  };

  // ---- 10. Rider fatigue level ----
  const fatigueScore = rem + (d.terrain === "rough" ? 2 : d.terrain === "mixed" ? 1 : 0);
  const fatigue: BikerSignal = {
    key: "fatigue",
    label: "Rider fatigue",
    ...(fatigueScore <= 1
      ? { value: "Low", detail: "Manageable as a single day's ride.", level: "good" as const }
      : fatigueScore === 2
        ? { value: "Moderate", detail: "Plan at least one overnight halt to stay fresh.", level: "moderate" as const }
        : fatigueScore === 3
          ? { value: "High", detail: "Long and tiring — break it into 2 stages.", level: "warn" as const }
          : { value: "Severe", detail: "Long and technical — 2+ day staged ride is essential.", level: "warn" as const }),
  };

  // ---- 11. Ideal rest stops ----
  const rest: BikerSignal = {
    key: "rest",
    label: "Ideal rest stops",
    ...(stops.length > 0
      ? {
          value: `${stops.length} stops`,
          detail: stops.slice(0, 3).map((s) => s.name).join(" · ") + (stops.length > 3 ? " …" : ""),
          level: "good" as const,
        }
      : pick(
          rem,
          { value: "Frequent", detail: "Plenty of roadside dhabas and towns to break the ride.", level: "good" as const },
          { value: "In towns", detail: `Use ${hub} and valley towns as natural halts.`, level: "moderate" as const },
          { value: "Plan ahead", detail: `Few services beyond ${hub} — plan halts before you set off.`, level: "moderate" as const },
        )),
  };

  return [road, danger, climbs, offroad, fuel, network, mechanic, puncture, weather, fatigue, rest];
}

// ===========================================================================
// Road Difficulty & Vehicle Recommendation System
// ===========================================================================
// Given the rider/driver's vehicle, score how suitable it is for the final
// approach, warn about low-cc + pillion + luggage combos, and — where the last
// leg is genuinely 4x4-only — point to the last safe parking spot and a local
// jeep-fare estimate. Specific parking points / fares are best-effort estimates
// (clearly labelled); everything else derives from each route's terrain so new
// destinations work with no extra authoring.

export type VehicleKind = "bike" | "car" | "suv";
/** Engine sizes we let a rider pick from. */
export type BikeCc = 70 | 100 | 125 | 150 | 250;

export interface RouteAccess {
  /** Comfortable minimum engine size for the climb/terrain. */
  minBikeCc: BikeCc;
  /** The final leg realistically needs a hired 4x4 jeep, not your own vehicle. */
  jeepRequired: boolean;
  /** Whether an ordinary car can complete the approach at all. */
  carCanFinish: boolean;
  /** Where you leave your own vehicle before the jeep leg. */
  lastSafeParking?: string;
  /** Qualitative note about the jeep leg (what it covers) — NO price; jeep
   *  fares are never fixed and must be agreed locally on the spot. */
  jeepNote?: string;
  /** Season-specific caution shown with the recommendation. */
  seasonal?: string;
}

// Per-destination overrides for the well-known off-road approaches. Anything
// not listed falls back to terrain-derived defaults (see routeAccess()).
const ACCESS: Record<string, Partial<RouteAccess>> = {
  fairymeadows: {
    minBikeCc: 250,
    jeepRequired: true,
    carCanFinish: false,
    lastSafeParking: "Raikot Bridge (Karakoram Highway)",
    jeepNote: "jeep to Tato, then a 3–4 hr trek to the meadows",
    seasonal: "The Raikot jeep track is snow-blocked roughly Nov–Apr.",
  },
  baboonvalley: {
    minBikeCc: 150,
    jeepRequired: true,
    carCanFinish: false,
    lastSafeParking: "the last metalled roadhead before the valley",
    jeepNote: "local 4x4 for the unpaved final stretch",
  },
  nooritop: {
    minBikeCc: 150,
    jeepRequired: true,
    carCanFinish: false,
    lastSafeParking: "Naran / Sharan roadhead",
    jeepNote: "muddy & rocky — 4x4 only",
    seasonal: "Rain turns the top to deep mud; July–Sept is safest.",
  },
  naltar: {
    minBikeCc: 150,
    jeepRequired: true,
    carCanFinish: false,
    lastSafeParking: "Nomal village (off the KKH near Gilgit)",
    jeepNote: "rough jeep track up from Nomal",
  },
  raatigali: {
    minBikeCc: 150,
    jeepRequired: true,
    carCanFinish: false,
    lastSafeParking: "Dowarian (Neelum Valley road)",
    jeepNote: "jeep to the lake car-park, then a short trek",
  },
  deosai: {
    minBikeCc: 150,
    jeepRequired: false,
    carCanFinish: false,
    lastSafeParking: "Skardu (or Chilim check-post)",
    jeepNote: "full-day 4x4 hire across the plains",
    seasonal: "The plateau is only open roughly Jul–Sep; snow-bound otherwise.",
  },
  leepa: {
    minBikeCc: 150,
    jeepRequired: false,
    carCanFinish: true,
    seasonal: "Reshian Gali pass holds snow into spring — steep, slippery off-season.",
  },
  astore: {
    minBikeCc: 150,
    jeepRequired: true,
    carCanFinish: false,
    lastSafeParking: "Astore town / Tarashing",
    jeepNote: "for the Rama Lake / Nanga Parbat side",
  },
  khaplu: { minBikeCc: 150, jeepRequired: false, carCanFinish: true },
  chitral: {
    minBikeCc: 150,
    jeepRequired: false,
    carCanFinish: true,
    seasonal: "Lowari Tunnel aside, the Kalash side tracks get washed out in heavy rain.",
  },
  neelum: { minBikeCc: 125, jeepRequired: false, carCanFinish: true },
  gorakh: {
    minBikeCc: 125,
    jeepRequired: false,
    carCanFinish: false,
    lastSafeParking: "Wahi Pandhi",
    jeepNote: "4x4 recommended for the final plateau climb",
  },
};

/** Resolve a destination's access profile: per-place override over terrain defaults. */
export function routeAccess(d: Destination): RouteAccess {
  const base: RouteAccess =
    d.terrain === "highway"
      ? { minBikeCc: 70, jeepRequired: false, carCanFinish: true }
      : d.terrain === "mixed"
        ? { minBikeCc: 125, jeepRequired: false, carCanFinish: true }
        : { minBikeCc: 150, jeepRequired: true, carCanFinish: false };
  return { ...base, ...ACCESS[d.id] };
}

/** The single best-fit vehicle for a route — used to tag the recommended pick. */
export function recommendedVehicle(d: Destination): { kind: VehicleKind; cc: BikeCc } {
  const access = routeAccess(d);
  const kind: VehicleKind =
    access.jeepRequired || !access.carCanFinish || d.terrain === "rough" ? "suv" : "car";
  return { kind, cc: access.minBikeCc };
}

export interface VehicleInput {
  kind: VehicleKind;
  /** Required when kind === "bike". */
  cc?: BikeCc;
  pillion: boolean;
  luggage: boolean;
}

export interface VehicleVerdict {
  /** 0–100 suitability. */
  score: number;
  level: SignalLevel;
  /** Plain-language headline. */
  headline: string;
  /** Specific cautions to show as a list. */
  warnings: string[];
  /** The single best recommendation (park & jeep, etc.). */
  recommendation: string;
  /** True when we advise leaving the vehicle and hiring a jeep. */
  suggestJeep: boolean;
}

const CC_ORDER: BikeCc[] = [70, 100, 125, 150, 250];

/** Google Maps search link for a named parking point. */
export function parkingMapsLink(name: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
}

export function assessVehicle(d: Destination, input: VehicleInput): VehicleVerdict {
  const access = routeAccess(d);
  const warnings: string[] = [];
  let score = 100;
  let suggestJeep = false;

  if (input.kind === "bike") {
    const cc = input.cc ?? 125;
    const need = CC_ORDER.indexOf(access.minBikeCc);
    const have = CC_ORDER.indexOf(cc);
    const gap = need - have; // >0 means under-powered
    if (gap > 0) {
      score -= gap * 22;
      warnings.push(
        `Your ${cc}cc is below the ${access.minBikeCc}cc this route really wants — expect strained, overheating climbs.`,
      );
    }
    if (d.terrain === "rough") {
      score -= 18;
      warnings.push("Loose, rocky off-road sections are hard work on any road bike.");
    } else if (d.terrain === "mixed") {
      score -= 8;
    }
    if (input.pillion) {
      score -= 10;
      if (gap > 0)
        warnings.push("Pillion weight on an under-powered bike makes steep climbs dangerous.");
    }
    if (input.luggage) {
      score -= 8;
    }
    if (input.pillion && input.luggage && gap >= 0 && d.terrain !== "highway") {
      warnings.push("Pillion + luggage detected — pack light and ride the climbs solo if you can.");
    }
  } else {
    // Car or SUV / 4x4
    const offroadOnly = !access.carCanFinish;
    if (input.kind === "car") {
      if (offroadOnly) {
        score -= 55;
        suggestJeep = true;
        warnings.push("A normal car cannot finish the off-road approach to this spot.");
      } else if (d.terrain === "rough") {
        score -= 30;
        warnings.push("Rough patches will scrape a low car — go slow and pick your line.");
      } else if (d.terrain === "mixed") {
        score -= 12;
      }
      if (input.luggage && input.pillion && d.terrain === "rough") {
        warnings.push("Fully loaded, a low car bottoms out easily on the rough sections.");
      }
    } else {
      // SUV / 4x4 — best tool, light penalties only
      if (d.terrain === "rough") score -= 8;
      if (offroadOnly && access.jeepRequired) {
        score -= 10;
        warnings.push("Even a 4x4 should have decent ground clearance and a low-range gearbox here.");
      }
    }
  }

  if (access.jeepRequired && input.kind !== "suv") {
    suggestJeep = true;
  }

  score = Math.max(5, Math.min(100, Math.round(score)));
  const level: SignalLevel = score >= 75 ? "good" : score >= 45 ? "moderate" : "warn";

  // Headline + recommendation
  let headline: string;
  if (level === "good") headline = "Good match — you're set for this route.";
  else if (level === "moderate") headline = "Doable with care — mind the warnings below.";
  else headline = "Risky match — this vehicle isn't ideal for the final approach.";

  let recommendation: string;
  if (suggestJeep) {
    const parkAt = access.lastSafeParking ?? "the last roadhead";
    const leg = access.jeepNote ? ` (${access.jeepNote})` : "";
    recommendation = `Park at ${parkAt} and hire a local 4x4 jeep for the last leg${leg}. Jeep fares are not fixed — agree the rate on the spot before you set off.`;
  } else if (level === "warn") {
    recommendation = "Consider a higher-cc bike or a 4x4 — or hire a local jeep for the hard section.";
  } else if (level === "moderate") {
    recommendation = "Fine if you ride/drive carefully, rest often and avoid bad weather.";
  } else {
    recommendation = "No changes needed — enjoy the ride.";
  }

  return { score, level, headline, warnings, recommendation, suggestJeep };
}
