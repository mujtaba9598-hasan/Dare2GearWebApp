// Dare2Gear — Route Intelligence helpers (Pillar 2).
// Pure functions + static guidance. No backend; the only live data is weather,
// fetched client-side from the free, no-key Open-Meteo API.

import type { Destination, GeoPoint } from "./data";

// ---------------------------------------------------------------------------
// Toll estimates now live in planner.ts (`tripTolls`) — tolls apply to the
// motorway / expressway portion only, so they need the corridor route split, not
// just the total distance. Bikes are toll-free (banned from motorways).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Bike-legal routing note
// ---------------------------------------------------------------------------
export function bikeRouteNote(): string {
  return "Motorbikes are not allowed on Pakistan's motorways (M-1, M-2, etc.). Plan your ride along the GT Road and national highways (N-series) instead — it's slower but legal and far more scenic.";
}

// ---------------------------------------------------------------------------
// Bike CC guidance — by terrain & budget tier
// ---------------------------------------------------------------------------
export interface CcGuidance {
  level: "any" | "125" | "150";
  text: string;
}

export function bikeCcGuidance(dest: Destination): CcGuidance {
  if (dest.terrain === "rough" || dest.tier === "high") {
    return {
      level: "150",
      text: "150cc+ strongly recommended. 70cc bikes struggle on steep, high-altitude climbs here and are not advised — and some tracks effectively need a bigger machine.",
    };
  }
  if (dest.terrain === "mixed") {
    return {
      level: "125",
      text: "125cc+ recommended. A 70cc is doable but slow and strained on the longer climbs.",
    };
  }
  return {
    level: "any",
    text: "Any bike is fine on this route — even a 70cc handles it comfortably.",
  };
}

// ---------------------------------------------------------------------------
// Documents & permits
// ---------------------------------------------------------------------------
export const TRAVEL_DOCUMENTS: string[] = [
  "Original CNIC (plus a couple of photocopies)",
  "Valid driving licence",
  "Vehicle registration / bike papers",
  "Helmet — legally required for bikes on highways",
];

/** Destinations near borders / the LoC where check-posts or permits apply. */
const PERMIT_ZONES = new Set([
  "khunjerab",
  "neelum",
  "rawalakot",
  "chitral",
  "fairymeadows",
  "deosai",
  "astore",
]);

export function permitNote(dest: Destination): string | null {
  if (!PERMIT_ZONES.has(dest.id)) return null;
  return "Near a border / restricted zone: keep your CNIC handy for security check-posts, and foreign travellers may need an NOC. Register at posts where asked.";
}

// ---------------------------------------------------------------------------
// Google Maps directions link
// ---------------------------------------------------------------------------
export function googleMapsDirLink(origin: GeoPoint, dest: Destination): string {
  const o = `${origin.lat},${origin.lng}`;
  const d = `${dest.lat},${dest.lng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}&travelmode=driving`;
}

// ---------------------------------------------------------------------------
// Weather (Open-Meteo) — codes + URL builder
// ---------------------------------------------------------------------------
export function weatherApiUrl(lat: number, lng: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current: "temperature_2m,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "3",
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

/** Map a WMO weather code to a short label + emoji. */
export function weatherInfo(code: number): { label: string; icon: string } {
  if (code === 0) return { label: "Clear", icon: "☀️" };
  if (code <= 2) return { label: "Partly cloudy", icon: "🌤️" };
  if (code === 3) return { label: "Overcast", icon: "☁️" };
  if (code <= 48) return { label: "Fog", icon: "🌫️" };
  if (code <= 57) return { label: "Drizzle", icon: "🌦️" };
  if (code <= 67) return { label: "Rain", icon: "🌧️" };
  if (code <= 77) return { label: "Snow", icon: "🌨️" };
  if (code <= 82) return { label: "Showers", icon: "🌦️" };
  if (code <= 86) return { label: "Snow showers", icon: "🌨️" };
  return { label: "Thunderstorm", icon: "⛈️" };
}
