// Dare2Gear — real Pakistani road corridors.
//
// Why this file exists: the India–Pakistan border is closed, but raw routing
// engines (OSRM / OpenStreetMap) don't know that. Left alone they happily draw
// the geometrically-shortest line — straight across Indian Kashmir / Ladakh —
// for northern places like Skardu, Khaplu, Leepa or Neelum. Those routes are
// impossible to drive, yet they made the planner show far-too-short distances
// (and therefore wrong fuel + total cost).
//
// The fix mirrors how Pakistanis actually travel north: EVERYTHING funnels
// through the Islamabad / GT-Road corridor. So we route every northern trip as
//
//     origin → Islamabad  +  a validated Islamabad → destination "leg"
//
// The origin → Islamabad part is plain GT-Road / motorway driving the router
// handles correctly. The Islamabad → destination legs below were validated
// against OSRM *and* Google Maps. Spot checks that match Google:
//   • Sialkot → Leepa  = 219 + 224 = 443 km   (Google: 443 km)
//   • Sialkot → Shigar = 219 + 651 = 870 km   (Google: ~866 km)
//   • Sialkot → Skardu = 219 + 644 = 863 km   (Google: ~828 km)
//
// Re-validate these legs if the road network changes (new tunnels, the Babusar
// or Lowari upgrades, etc.).

export const ISLAMABAD_ID = "islamabad";

/** Macro travel region. Anything that isn't PLAINS reaches the rest of the
 *  country only through the Islamabad corridor. */
export type Macro = "GB" | "AJK" | "KPN" | "PLAINS";

/** Which KKH corridor to use for Gilgit-Baltistan trips. */
export type RouteChoice = "besham" | "babusar";

export interface Leg {
  km: number;
  min: number;
}

export interface CorridorLeg {
  /** All-season route — always open. For Gilgit-Baltistan this is the
   *  Besham / KKH (Indus) road; for everywhere else it's the only road. */
  allSeason: Leg;
  /** Summer-only shortcut over Babusar Top (≈ shorter than Besham). Present
   *  only for Gilgit-Baltistan destinations reached via Chilas. */
  babusar?: Leg;
}

// ---------------------------------------------------------------------------
// Validated Islamabad → destination legs (km / minutes).
// ---------------------------------------------------------------------------
export const CORRIDOR_LEGS: Record<string, CorridorLeg> = {
  // ---- Gilgit-Baltistan (KKH via Chilas) -------------------------------
  // Besham = all-season Indus road; Babusar Top = summer shortcut (~Jun–Oct).
  hunza: { allSeason: { km: 668, min: 499 }, babusar: { km: 572, min: 419 } },
  skardu: { allSeason: { km: 741, min: 559 }, babusar: { km: 644, min: 479 } },
  gilgit: { allSeason: { km: 585, min: 440 }, babusar: { km: 488, min: 360 } },
  astore: { allSeason: { km: 562, min: 433 }, babusar: { km: 465, min: 353 } },
  khaplu: { allSeason: { km: 852, min: 668 }, babusar: { km: 755, min: 588 } },
  shigar: { allSeason: { km: 748, min: 577 }, babusar: { km: 651, min: 497 } },
  naltar: { allSeason: { km: 622, min: 534 }, babusar: { km: 525, min: 454 } },
  baboonvalley: { allSeason: { km: 626, min: 469 }, babusar: { km: 530, min: 389 } },
  fairymeadows: { allSeason: { km: 501, min: 377 }, babusar: { km: 404, min: 296 } },
  deosai: { allSeason: { km: 659, min: 532 }, babusar: { km: 562, min: 452 } },
  khunjerab: { allSeason: { km: 837, min: 627 }, babusar: { km: 740, min: 547 } },

  // ---- Kaghan valley / Galyat / Swat (KPK) — single all-season road -----
  // Babusar Top is *past* Naran, so reaching Naran itself has no route choice.
  naran: { allSeason: { km: 252, min: 183 } },
  nooritop: { allSeason: { km: 263, min: 191 } },
  nathiagali: { allSeason: { km: 88, min: 75 } },
  swat: { allSeason: { km: 330, min: 249 } },

  // ---- Azad Kashmir — via Murree / Kohala / Muzaffarabad, never the LoC --
  neelum: { allSeason: { km: 210, min: 184 } },
  rawalakot: { allSeason: { km: 113, min: 86 } },
  // Leepa is hand-set: OSRM mis-maps the Leepa Valley road badly (it returns
  // 882–1140 km). Real Islamabad → Leepa is ~224 km via Muzaffarabad, which
  // makes Sialkot → Leepa = 443 km, matching Google exactly.
  leepa: { allSeason: { km: 224, min: 390 } },
  gangachoti: { allSeason: { km: 148, min: 109 } },
  pirchinasi: { allSeason: { km: 150, min: 117 } },
  raatigali: { allSeason: { km: 270, min: 251 } },
};

/** Map a destination's `region` string to its macro travel region. */
export function macroOfRegion(region: string): Macro {
  if (/Gilgit-Baltistan|Ghanche|Shigar/.test(region)) return "GB";
  if (/Azad Kashmir/.test(region)) return "AJK";
  if (/Kaghan|Swat Valley|Galyat/.test(region)) return "KPN";
  return "PLAINS";
}

/** Map an origin city's `province` to its macro travel region. */
export function macroOfProvince(province: string): Macro {
  if (/Azad Kashmir/.test(province)) return "AJK";
  if (/Gilgit|Baltistan/.test(province)) return "GB";
  return "PLAINS";
}

/** Does this destination offer a summer Babusar Top shortcut? */
export function hasBabusarOption(id: string): boolean {
  return Boolean(CORRIDOR_LEGS[id]?.babusar);
}

/** The Islamabad → destination leg for the chosen KKH corridor. Falls back to
 *  the all-season leg when the Babusar shortcut isn't available or selected. */
export function corridorLeg(id: string, route: RouteChoice): Leg | undefined {
  const entry = CORRIDOR_LEGS[id];
  if (!entry) return undefined;
  if (route === "babusar" && entry.babusar) return entry.babusar;
  return entry.allSeason;
}

// ---------------------------------------------------------------------------
// Babusar Top season — open roughly mid-June to mid-October; snow-closed the
// rest of the year, when the Besham (KKH) road is the only way through.
// ---------------------------------------------------------------------------
/** Is the Babusar Top pass realistically open on this date? (month is 0-based
 *  from Date.getMonth(): 5 = June … 9 = October.) */
export function isBabusarSeason(month: number): boolean {
  return month >= 5 && month <= 9; // Jun–Oct
}

/** Default corridor for a date: Babusar in summer, Besham otherwise. */
export function defaultRouteForMonth(month: number): RouteChoice {
  return isBabusarSeason(month) ? "babusar" : "besham";
}
