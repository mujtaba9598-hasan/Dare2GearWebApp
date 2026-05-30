// Dare2Gear — budget calculation + trip recommendation engine.
// Pure functions, no external APIs. Swap the pricing knobs in data.ts for a
// live feed later without touching this file.

import {
  DESTINATIONS,
  FUEL_PRICES,
  HOTEL_RATES,
  FOOD_RATES,
  ORIGINS,
  VEHICLES,
  type Destination,
  type GeoPoint,
  type HotelTier,
  type VehicleModel,
} from "./data";
// Real road distances + drive times (OSRM/OpenStreetMap), precomputed offline by
// scripts/generate-road-distances.ts. Indexed by place id.
import roadData from "@/data/road-distances.json";

const ROAD_INDEX: Record<string, number> = {};
roadData.ids.forEach((id, i) => {
  ROAD_INDEX[id] = i;
});

function matrixCell(grid: (number | null)[][], aId: string, bId: string): number | null {
  const ai = ROAD_INDEX[aId];
  const bi = ROAD_INDEX[bId];
  if (ai === undefined || bi === undefined) return null;
  const v = grid[ai]?.[bi];
  return v == null ? null : v;
}

/** Real one-way driving distance (km) between any two places, from the matrix. */
export function roadDistanceBetween(a: GeoPoint, b: GeoPoint): number | null {
  return matrixCell(roadData.km as (number | null)[][], a.id, b.id);
}

/** Real one-way driving time (minutes) between any two places, from the matrix. */
export function roadMinutesBetween(a: GeoPoint, b: GeoPoint): number | null {
  return matrixCell(roadData.min as (number | null)[][], a.id, b.id);
}

export interface PlanInput {
  budget: number;
  people: number;
  days: number;
  originId: string;
  vehicleId: string;
  /** override the preset mileage (km/l) — optional */
  kmPerLiter?: number;
  hotelTier: HotelTier;
}

export interface CostBreakdown {
  fuel: number;
  hotel: number;
  food: number;
  misc: number;
  total: number;
}

export interface DestinationPlan {
  destination: Destination;
  /** one-way road distance (km) */
  distanceKm: number;
  roundTripKm: number;
  /** total litres burned across ALL vehicles in the convoy */
  liters: number;
  vehiclesNeeded: number;
  drivingHoursOneWay: number;
  minDaysNeeded: number;
  costs: CostBreakdown;
  withinBudget: boolean;
  enoughDays: boolean;
  feasible: boolean;
  /** how much of the budget the trip uses, 0-1+ */
  budgetUsed: number;
  /** ranking score (higher = better recommendation) */
  score: number;
  /** human note when not fully feasible */
  note?: string;
}

export interface PlanResult {
  origin: GeoPoint;
  vehicle: VehicleModel;
  effectiveKmPerLiter: number;
  /** how many of the chosen vehicle the group needs to fit everyone */
  vehiclesNeeded: number;
  seatsPerVehicle: number;
  /** total seats vs. travelers — true when one vehicle isn't enough */
  needsMultipleVehicles: boolean;
  /** farthest one-way distance reachable if ~45% of budget went to fuel */
  maxReachKm: number;
  recommended: DestinationPlan[];
  feasible: DestinationPlan[];
  stretch: DestinationPlan[];
  all: DestinationPlan[];
}

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance between two coordinates. */
function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** One-way road distance (km). Uses the real OSRM matrix; falls back to a
 * great-circle × terrain estimate only if a pair is missing from the matrix. */
export function roadDistanceKm(origin: GeoPoint, dest: Destination): number {
  const real = roadDistanceBetween(origin, dest);
  if (real != null && real > 0) return real;
  const straight = haversineKm(origin, dest);
  const factor =
    dest.terrain === "highway" ? 1.35 : dest.terrain === "mixed" ? 1.5 : 1.65;
  return Math.round(straight * factor);
}

/** Average driving speed (km/h) including stops, by terrain — fallback only. */
function avgSpeed(dest: Destination): number {
  return dest.terrain === "highway" ? 55 : dest.terrain === "mixed" ? 42 : 32;
}

/** One-way driving time (hours). Uses the real OSRM matrix; falls back to
 * distance ÷ terrain speed if the pair is missing. */
function roadDriveHours(origin: GeoPoint, dest: Destination): number {
  const min = roadMinutesBetween(origin, dest);
  if (min != null && min > 0) return Math.round((min / 60) * 10) / 10;
  return Math.round((roadDistanceKm(origin, dest) / avgSpeed(dest)) * 10) / 10;
}

const round = (n: number) => Math.round(n);

export function getVehicle(id: string): VehicleModel {
  return VEHICLES.find((v) => v.id === id) ?? VEHICLES[0];
}

export function getOrigin(id: string): GeoPoint {
  return ORIGINS.find((o) => o.id === id) ?? ORIGINS[0];
}

function planDestination(
  input: PlanInput,
  origin: GeoPoint,
  vehicle: VehicleModel,
  kmPerLiter: number,
  vehiclesNeeded: number,
  dest: Destination,
): DestinationPlan {
  const distanceKm = roadDistanceKm(origin, dest);
  const roundTripKm = distanceKm * 2;
  // Every vehicle in the convoy drives the full route and burns its own fuel.
  const litersPerVehicle = roundTripKm / kmPerLiter;
  const liters = litersPerVehicle * vehiclesNeeded;
  const fuel = round(liters * FUEL_PRICES[vehicle.fuel]);

  const nights = Math.max(1, input.days - 1);
  // Stay is estimated per person per night (≈ Rs 1,500 standard).
  const hotel = round(HOTEL_RATES[input.hotelTier] * dest.costFactor * nights * input.people);

  const food = round(FOOD_RATES[input.hotelTier] * dest.costFactor * input.people * input.days);

  // misc = tolls/permits (per 100km, per vehicle) + per-person activities + 10% buffer
  const tolls = round((roundTripKm / 100) * 150 * vehiclesNeeded);
  const activities = round(input.people * 1500);
  const subtotal = fuel + hotel + food + tolls + activities;
  const buffer = round(subtotal * 0.1);
  const misc = tolls + activities + buffer;

  const total = fuel + hotel + food + misc;

  const drivingHoursOneWay = roadDriveHours(origin, dest);
  // need travel time both ways at ~9 driving hours/day, plus at least 1 full day to enjoy
  const travelDays = Math.ceil((drivingHoursOneWay * 2) / 9);
  const minDaysNeeded = Math.max(2, travelDays + 1);

  const withinBudget = total <= input.budget;
  const enoughDays = input.days >= minDaysNeeded;
  const feasible = withinBudget && enoughDays;
  const budgetUsed = total / input.budget;

  // Score: reward scenic value and good budget utilisation, penalise infeasible.
  let score = dest.scenicScore;
  if (!withinBudget) score -= 60 + (budgetUsed - 1) * 100;
  if (!enoughDays) score -= 25 * (minDaysNeeded - input.days);
  // sweet spot: using 55-90% of budget
  if (feasible) {
    if (budgetUsed >= 0.55 && budgetUsed <= 0.9) score += 10;
    else if (budgetUsed < 0.4) score -= 6; // leaves lots unused — maybe aim higher
  }

  let note: string | undefined;
  if (!withinBudget && !enoughDays) {
    note = `Over budget by Rs ${(total - input.budget).toLocaleString()} and needs ${minDaysNeeded}+ days.`;
  } else if (!withinBudget) {
    note = `Over budget by Rs ${(total - input.budget).toLocaleString()}.`;
  } else if (!enoughDays) {
    note = `Doable on budget but realistically needs ${minDaysNeeded}+ days.`;
  }

  return {
    destination: dest,
    distanceKm,
    roundTripKm,
    liters: Math.round(liters * 10) / 10,
    vehiclesNeeded,
    drivingHoursOneWay: Math.round(drivingHoursOneWay * 10) / 10,
    minDaysNeeded,
    costs: { fuel, hotel, food, misc, total },
    withinBudget,
    enoughDays,
    feasible,
    budgetUsed,
    score,
    note,
  };
}

export function planTrip(input: PlanInput): PlanResult {
  const origin = getOrigin(input.originId);
  const vehicle = getVehicle(input.vehicleId);
  const kmPerLiter =
    input.kmPerLiter && input.kmPerLiter > 0 ? input.kmPerLiter : vehicle.kmPerLiter;

  // Convoy size: how many of this vehicle are needed to seat everyone.
  const vehiclesNeeded = Math.max(1, Math.ceil(input.people / vehicle.seats));

  const all = DESTINATIONS.map((d) =>
    planDestination(input, origin, vehicle, kmPerLiter, vehiclesNeeded, d),
  ).sort((a, b) => b.score - a.score);

  const feasible = all.filter((p) => p.feasible);
  const recommended = feasible.slice(0, 3);
  // "stretch": just out of reach — slightly over budget or needs a couple more days
  const stretch = all
    .filter((p) => !p.feasible && (p.budgetUsed <= 1.4 || p.minDaysNeeded <= input.days + 2))
    .slice(0, 3);

  // Max reach: how far one-way you could drive spending ~45% of budget on fuel.
  // With a convoy, fuel burns N times faster, so reach shrinks accordingly.
  const fuelBudget = input.budget * 0.45;
  const litersAffordable = fuelBudget / FUEL_PRICES[vehicle.fuel];
  const maxReachKm = round((litersAffordable * kmPerLiter) / (2 * vehiclesNeeded));

  return {
    origin,
    vehicle,
    effectiveKmPerLiter: kmPerLiter,
    vehiclesNeeded,
    seatsPerVehicle: vehicle.seats,
    needsMultipleVehicles: vehiclesNeeded > 1,
    maxReachKm,
    recommended,
    feasible,
    stretch,
    all,
  };
}
