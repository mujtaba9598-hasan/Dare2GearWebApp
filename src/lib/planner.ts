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
  isRestrictedDestination,
  isRestrictedOrigin,
  type Destination,
  type GeoPoint,
  type OriginCity,
  type HotelTier,
  type VehicleModel,
} from "./data";
import { cityPlaces } from "./city-attractions";
// Real road distances + drive times (OSRM/OpenStreetMap), precomputed offline by
// scripts/generate-road-distances.ts. Indexed by place id.
import roadData from "@/data/road-distances.json";
// Corridor routing — keeps northern trips on real Pakistani roads (via the
// Islamabad / GT-Road corridor) instead of impossible lines across the India
// border. See corridors.ts for the why and the validated legs.
import {
  ISLAMABAD_ID,
  corridorLeg,
  hasBabusarOption,
  isBabusarSeason,
  macroOfRegion,
  macroOfProvince,
  defaultRouteForMonth,
  type Macro,
  type Leg,
  type RouteChoice,
} from "./corridors";

export type { RouteChoice } from "./corridors";
export { hasBabusarOption, defaultRouteForMonth, isBabusarSeason };

/** A one-way trip at or under this distance is treated as a same-day round trip:
 * no overnight hotel — just fuel and a day's food. */
export const DAY_TRIP_KM = 100;

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

/** Raw matrix one-way driving distance (km) — direct route, no corridor logic. */
function matrixKm(a: GeoPoint, b: GeoPoint): number | null {
  return matrixCell(roadData.km as (number | null)[][], a.id, b.id);
}

/** Raw matrix one-way driving time (minutes) — direct route, no corridor logic. */
function matrixMin(a: GeoPoint, b: GeoPoint): number | null {
  return matrixCell(roadData.min as (number | null)[][], a.id, b.id);
}

// ---------------------------------------------------------------------------
// Corridor-aware distance. Northern regions (Gilgit-Baltistan, Azad Kashmir,
// northern KP) connect to the country only through the Islamabad corridor, so
// any cross-region trip that touches the north is composed as
//   origin → Islamabad  +  Islamabad → destination (validated leg).
// This eliminates the impossible "via Jammu / across India" shortcuts.
// ---------------------------------------------------------------------------
const PLACE_MACRO: Record<string, Macro> = {};
DESTINATIONS.forEach((d) => {
  PLACE_MACRO[d.id] = macroOfRegion(d.region);
});
ORIGINS.forEach((o) => {
  // Destinations win if an id somehow overlaps; cities map by province.
  if (PLACE_MACRO[o.id] === undefined) PLACE_MACRO[o.id] = macroOfProvince(o.province);
});

function macroOf(id: string): Macro {
  return PLACE_MACRO[id] ?? "PLAINS";
}

interface Measured extends Leg {
  /** true when the value came from a great-circle estimate, not real road data */
  estimated: boolean;
}

/** Resolve an optional route choice to a concrete one (Babusar in summer,
 *  Besham otherwise) using the current month. */
function resolveRoute(route?: RouteChoice): RouteChoice {
  return route ?? defaultRouteForMonth(new Date().getMonth());
}

/** Direct (non-corridor) distance: real matrix where present, else a
 *  great-circle estimate. Safe for plains↔plains and within-region pairs. */
function directMeasure(a: GeoPoint, b: GeoPoint): Measured {
  const km = matrixKm(a, b);
  if (km != null && km > 0) {
    const min = matrixMin(a, b);
    return { km, min: min != null && min > 0 ? min : Math.round((km / 45) * 60), estimated: false };
  }
  const est = Math.round(haversineKm(a, b) * 1.45);
  return { km: est, min: Math.round((est / 40) * 60), estimated: true };
}

/** Distance from a place to the Islamabad hub. Northern destinations use their
 *  validated corridor leg; everything else uses the real origin→Islamabad road
 *  distance (a route that never crosses the India border). */
function hubMeasure(g: GeoPoint, route: RouteChoice): Measured {
  if (g.id === ISLAMABAD_ID) return { km: 0, min: 0, estimated: false };
  const leg = corridorLeg(g.id, route);
  if (leg) return { ...leg, estimated: false };
  const isb = geoById(ISLAMABAD_ID);
  const km = matrixCell(roadData.km as (number | null)[][], g.id, ISLAMABAD_ID);
  if (km != null && km > 0) {
    const min = matrixCell(roadData.min as (number | null)[][], g.id, ISLAMABAD_ID);
    return { km, min: min != null && min > 0 ? min : Math.round((km / 50) * 60), estimated: false };
  }
  const est = isb ? Math.round(haversineKm(g, isb) * 1.45) : 0;
  return { km: est, min: Math.round((est / 50) * 60), estimated: true };
}

/** The one true distance function: real Pakistani road distance + drive time
 *  between any two places, routed through the Islamabad corridor when the trip
 *  crosses into (or between) the northern regions. */
function corridorMeasure(a: GeoPoint, b: GeoPoint, route: RouteChoice): Measured {
  if (a.id === b.id) return { km: 0, min: 0, estimated: false };
  const ra = macroOf(a.id);
  const rb = macroOf(b.id);
  const touchesNorth = ra !== "PLAINS" || rb !== "PLAINS";
  // Plains↔plains, or two places in the SAME northern region → direct routing
  // is already on real Pakistani roads (no India crossing).
  if (!touchesNorth || ra === rb) return directMeasure(a, b);
  // Cross-region trip touching the north → go through the Islamabad hub.
  const la = hubMeasure(a, route);
  const lb = hubMeasure(b, route);
  return { km: la.km + lb.km, min: la.min + lb.min, estimated: la.estimated || lb.estimated };
}

/** Corridor-aware one-way driving distance (km) between any two places. */
export function roadDistanceBetween(a: GeoPoint, b: GeoPoint, route?: RouteChoice): number {
  return corridorMeasure(a, b, resolveRoute(route)).km;
}

/** Corridor-aware one-way driving time (minutes) between any two places. */
export function roadMinutesBetween(a: GeoPoint, b: GeoPoint, route?: RouteChoice): number {
  return corridorMeasure(a, b, resolveRoute(route)).min;
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
  /** Besham vs Babusar KKH corridor for Gilgit-Baltistan; defaults to in-season. */
  route?: RouteChoice;
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
  /** realistic days each way (vehicle-aware: bikes ride fewer hours/day) */
  travelDaysOneWay: number;
  /** days to actually explore the place once there */
  sightseeingDays: number;
  /** how many MORE days than the user picked this realistically needs (0 if ok) */
  extraDaysNeeded: number;
  /** ≤ DAY_TRIP_KM one-way — a same-day return, no overnight stay. */
  isDayTrip: boolean;
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

/** A short trip to a nearby city (with its own "places to see"), surfaced
 * alongside the far-flung destinations so small budgets still get ideas. */
export interface CityTrip {
  city: OriginCity;
  distanceKm: number;
  roundTripKm: number;
  isDayTrip: boolean;
  drivingHoursOneWay: number;
  vehiclesNeeded: number;
  costs: CostBreakdown;
  withinBudget: boolean;
  /** number of attractions we list for this city */
  placesToSee: number;
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
  /** within budget but realistically need more days than the user picked */
  needMoreDays: DestinationPlan[];
  all: DestinationPlan[];
  /** nearby cities worth a short/day trip, closest first, within budget */
  nearby: CityTrip[];
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

/** Look up the coordinates of any place (city or destination) by id. */
function geoById(id: string): GeoPoint | undefined {
  return ORIGINS.find((o) => o.id === id) ?? DESTINATIONS.find((d) => d.id === id);
}

/** One-way road distance (km) between two places — corridor-aware. */
function roadOrEstimateKm(a: GeoPoint, b: GeoPoint, route?: RouteChoice): number {
  return roadDistanceBetween(a, b, route);
}

/** One-way road distance (km), corridor-aware (routes northern trips via the
 *  Islamabad corridor). Optional `route` picks the Besham vs Babusar KKH
 *  corridor for Gilgit-Baltistan; defaults to the in-season choice. */
export function roadDistanceKm(origin: GeoPoint, dest: Destination, route?: RouteChoice): number {
  return roadDistanceBetween(origin, dest, route);
}

/** One-way driving time (hours), corridor-aware. */
function roadDriveHours(origin: GeoPoint, dest: Destination, route?: RouteChoice): number {
  return Math.round((roadMinutesBetween(origin, dest, route) / 60) * 10) / 10;
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
  const distanceKm = roadDistanceKm(origin, dest, input.route);
  const roundTripKm = distanceKm * 2;
  // Every vehicle in the convoy drives the full route and burns its own fuel.
  const litersPerVehicle = roundTripKm / kmPerLiter;
  const liters = litersPerVehicle * vehiclesNeeded;
  const fuel = round(liters * FUEL_PRICES[vehicle.fuel]);

  // A nearby spot (≤ 100 km one-way) is a same-day round trip: no overnight stay,
  // just one day's food. Otherwise stay per person per night (≈ Rs 1,500 standard).
  const isDayTrip = distanceKm <= DAY_TRIP_KM;
  const nights = isDayTrip ? 0 : Math.max(1, input.days - 1);
  const hotel = isDayTrip
    ? 0
    : round(HOTEL_RATES[input.hotelTier] * dest.costFactor * nights * input.people);

  const foodDays = isDayTrip ? 1 : input.days;
  const food = round(FOOD_RATES[input.hotelTier] * dest.costFactor * input.people * foodDays);

  // misc = tolls/permits (per 100km, per vehicle) + per-person activities + 10% buffer
  const tolls = round((roundTripKm / 100) * 150 * vehiclesNeeded);
  const activities = round(input.people * 1500);
  const subtotal = fuel + hotel + food + tolls + activities;
  const buffer = round(subtotal * 0.1);
  const misc = tolls + activities + buffer;

  const total = fuel + hotel + food + misc;

  const drivingHoursOneWay = roadDriveHours(origin, dest, input.route);
  // Realistic days: bikes can't safely ride as many hours/day as a car in the
  // mountains, so they need more travel days. A car/SUV does ~9 driving h/day;
  // a bike ~6. Plus real days to actually SEE the place (more for big northern
  // valleys with several lakes/forts to visit).
  const dailyDriveHours = vehicle.class === "bike" ? 6 : 9;
  const roundTripDriveHours = drivingHoursOneWay * 2;
  const travelDaysOneWay = Math.max(1, Math.ceil(drivingHoursOneWay / dailyDriveHours));
  const travelDaysRoundTrip = Math.max(1, Math.ceil(roundTripDriveHours / dailyDriveHours));
  const sightseeingFloor = dest.tier === "low" ? 1 : 2;
  const sightseeingDays = Math.min(
    3,
    Math.max(sightseeingFloor, Math.ceil(dest.attractions.length / 4)),
  );
  const minDaysNeeded = isDayTrip ? 1 : Math.max(2, travelDaysRoundTrip + sightseeingDays);

  const withinBudget = total <= input.budget;
  const enoughDays = input.days >= minDaysNeeded;
  const extraDaysNeeded = Math.max(0, minDaysNeeded - input.days);
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

  const rideWord = vehicle.class === "bike" ? "bike" : vehicle.class === "suv" ? "4x4" : "car";
  const dayPlural = (n: number) => (n === 1 ? "day" : "days");
  const daysAdvice =
    `on a ${rideWord} this realistically needs about ${minDaysNeeded} days ` +
    `(~${travelDaysOneWay} ${dayPlural(travelDaysOneWay)} each way + ${sightseeingDays} to explore)` +
    `${extraDaysNeeded > 0 ? ` — add ${extraDaysNeeded} ${dayPlural(extraDaysNeeded)}` : ""}`;

  let note: string | undefined;
  if (!withinBudget && !enoughDays) {
    note = `Over budget by Rs ${(total - input.budget).toLocaleString()}, and ${daysAdvice}.`;
  } else if (!withinBudget) {
    note = `Over budget by Rs ${(total - input.budget).toLocaleString()}.`;
  } else if (!enoughDays) {
    note = `Fits your budget, but ${daysAdvice}.`;
  } else if (isDayTrip) {
    note = "Short day trip — visit and drive back the same day (no overnight stay).";
  }

  return {
    destination: dest,
    distanceKm,
    roundTripKm,
    liters: Math.round(liters * 10) / 10,
    vehiclesNeeded,
    drivingHoursOneWay: Math.round(drivingHoursOneWay * 10) / 10,
    minDaysNeeded,
    travelDaysOneWay,
    sightseeingDays,
    extraDaysNeeded,
    isDayTrip,
    costs: { fuel, hotel, food, misc, total },
    withinBudget,
    enoughDays,
    feasible,
    budgetUsed,
    score,
    note,
  };
}

// ----------------------------------------------------------------------------
// Any-to-any ("Plan a specific trip") — every place can be a start or an end.
// ----------------------------------------------------------------------------
export interface TripPlace {
  id: string;
  name: string;
  kind: "city" | "destination";
  /** cost-of-living factor (1.0 for cities; richer for remote destinations) */
  costFactor: number;
}

export const ALL_PLACES: TripPlace[] = [
  // All cities stay selectable — incl. restricted provinces — so a manual
  // any-to-any calc (e.g. Karachi → Quetta) still returns a rough estimate.
  ...ORIGINS.map((o) => ({ id: o.id, name: o.name, kind: "city" as const, costFactor: 1.0 })),
  // Restricted destinations (their full guides) are dropped from discovery.
  ...DESTINATIONS.filter((d) => !isRestrictedDestination(d)).map((d) => ({
    id: d.id,
    name: d.name,
    kind: "destination" as const,
    costFactor: d.costFactor,
  })),
];

export interface TripInput {
  fromId: string;
  toId: string;
  vehicleId: string;
  kmPerLiter?: number;
  people: number;
  days: number;
  hotelTier: HotelTier;
  /** Besham vs Babusar KKH corridor for Gilgit-Baltistan; defaults to in-season. */
  route?: RouteChoice;
}

export interface TripResult {
  from: TripPlace;
  to: TripPlace;
  distanceKm: number;
  roundTripKm: number;
  driveHoursOneWay: number;
  vehiclesNeeded: number;
  effectiveKmPerLiter: number;
  fuelOneWay: number;
  fuelRoundTrip: number;
  hotel: number;
  food: number;
  tolls: number;
  buffer: number;
  total: number;
  /** ≤ DAY_TRIP_KM one-way — same-day return, no overnight stay. */
  isDayTrip: boolean;
  /** realistic days for this trip (vehicle-aware travel + time to explore) */
  recommendedDays: number;
  travelDaysOneWay: number;
  sightseeingDays: number;
  /** how many more days than picked it realistically needs (0 if ok) */
  extraDaysNeeded: number;
  enoughDays: boolean;
  /** true when distance came from the great-circle estimate, not road data. */
  estimated: boolean;
  /** the KKH corridor actually used (Besham / Babusar). */
  route: RouteChoice;
  /** true when the destination offers a summer Babusar Top shortcut. */
  babusarAvailable: boolean;
}

export function getPlace(id: string): TripPlace | undefined {
  return ALL_PLACES.find((p) => p.id === id);
}

/** Full cost for a specific A→B trip, corridor-aware (routes northern trips via
 *  the Islamabad corridor so impossible cross-border routes never appear). */
export function planPointToPoint(input: TripInput): TripResult | null {
  const from = getPlace(input.fromId);
  const to = getPlace(input.toId);
  if (!from || !to || from.id === to.id) return null;

  const ga = geoById(from.id);
  const gb = geoById(to.id);
  if (!ga || !gb) return null;

  const route = resolveRoute(input.route);
  const measured = corridorMeasure(ga, gb, route);
  const distanceKm = measured.km;
  const driveMin = measured.min;
  const estimated = measured.estimated;
  // A Babusar shortcut only exists when the destination is a Gilgit-Baltistan
  // place reached via Chilas AND the trip actually crosses into the north.
  const babusarAvailable =
    hasBabusarOption(to.id) && macroOf(from.id) !== macroOf(to.id);

  const vehicle = getVehicle(input.vehicleId);
  const kmPerLiter =
    input.kmPerLiter && input.kmPerLiter > 0 ? input.kmPerLiter : vehicle.kmPerLiter;
  const vehiclesNeeded = Math.max(1, Math.ceil(input.people / vehicle.seats));

  const roundTripKm = distanceKm * 2;
  const fuelRoundTrip = round((roundTripKm / kmPerLiter) * FUEL_PRICES[vehicle.fuel] * vehiclesNeeded);
  const fuelOneWay = round(fuelRoundTrip / 2);

  // ≤ 100 km one-way is a same-day round trip: no hotel, just a day's food.
  const isDayTrip = distanceKm <= DAY_TRIP_KM;
  const nights = isDayTrip ? 0 : Math.max(1, input.days - 1);
  const hotel = isDayTrip ? 0 : round(HOTEL_RATES[input.hotelTier] * to.costFactor * nights * input.people);
  const foodDays = isDayTrip ? 1 : input.days;
  const food = round(FOOD_RATES[input.hotelTier] * to.costFactor * input.people * foodDays);
  const tolls = round((roundTripKm / 100) * 150 * vehiclesNeeded);
  const subtotal = fuelRoundTrip + hotel + food + tolls;
  const buffer = round(subtotal * 0.1);
  const total = subtotal + buffer;

  const driveHoursOneWay =
    driveMin > 0 ? Math.round((driveMin / 60) * 10) / 10 : Math.round((distanceKm / 45) * 10) / 10;

  // Realistic days, vehicle-aware: bikes ride ~6 driving h/day in the mountains,
  // cars/4x4 ~9; plus time to actually explore (more for a destination than a city).
  const dailyDriveHours = vehicle.class === "bike" ? 6 : 9;
  const travelDaysOneWay = Math.max(1, Math.ceil(driveHoursOneWay / dailyDriveHours));
  const travelDaysRoundTrip = Math.max(1, Math.ceil((driveHoursOneWay * 2) / dailyDriveHours));
  const sightseeingDays = to.kind === "destination" ? 2 : 1;
  const recommendedDays = isDayTrip ? 1 : Math.max(2, travelDaysRoundTrip + sightseeingDays);
  const enoughDays = input.days >= recommendedDays;
  const extraDaysNeeded = Math.max(0, recommendedDays - input.days);

  return {
    from,
    to,
    distanceKm,
    roundTripKm,
    driveHoursOneWay,
    vehiclesNeeded,
    effectiveKmPerLiter: kmPerLiter,
    fuelOneWay,
    fuelRoundTrip,
    hotel,
    food,
    tolls,
    buffer,
    total,
    isDayTrip,
    recommendedDays,
    travelDaysOneWay,
    sightseeingDays,
    extraDaysNeeded,
    enoughDays,
    estimated,
    route,
    babusarAvailable,
  };
}

/** Cost of a short trip from the origin to a nearby city (cost-of-living 1.0). */
function planCityTrip(
  input: PlanInput,
  origin: GeoPoint,
  kmPerLiter: number,
  vehiclesNeeded: number,
  fuelType: VehicleModel["fuel"],
  city: OriginCity,
): CityTrip {
  const distanceKm = roadOrEstimateKm(origin, city, input.route);
  const roundTripKm = distanceKm * 2;
  const liters = (roundTripKm / kmPerLiter) * vehiclesNeeded;
  const fuel = round(liters * FUEL_PRICES[fuelType]);

  const isDayTrip = distanceKm <= DAY_TRIP_KM;
  const nights = isDayTrip ? 0 : Math.max(1, input.days - 1);
  const hotel = isDayTrip ? 0 : round(HOTEL_RATES[input.hotelTier] * nights * input.people);
  const foodDays = isDayTrip ? 1 : input.days;
  const food = round(FOOD_RATES[input.hotelTier] * input.people * foodDays);

  const tolls = round((roundTripKm / 100) * 150 * vehiclesNeeded);
  const activities = round(input.people * 1000);
  const subtotal = fuel + hotel + food + tolls + activities;
  const buffer = round(subtotal * 0.1);
  const misc = tolls + activities + buffer;
  const total = fuel + hotel + food + misc;

  const drivingHoursOneWay = Math.round((distanceKm / 50) * 10) / 10;

  return {
    city,
    distanceKm,
    roundTripKm,
    isDayTrip,
    drivingHoursOneWay,
    vehiclesNeeded,
    costs: { fuel, hotel, food, misc, total },
    withinBudget: total <= input.budget,
    placesToSee: cityPlaces(city.id).length,
  };
}

/** Nearby cities worth a short trip — closest first, within budget, and only
 * ones that actually have attractions listed. Restricted provinces excluded. */
export function nearbyCityTrips(
  input: PlanInput,
  origin: GeoPoint,
  kmPerLiter: number,
  vehiclesNeeded: number,
  fuelType: VehicleModel["fuel"],
): CityTrip[] {
  return ORIGINS.filter(
    (c) => c.id !== origin.id && !isRestrictedOrigin(c),
  )
    .map((c) => planCityTrip(input, origin, kmPerLiter, vehiclesNeeded, fuelType, c))
    .filter((t) => t.placesToSee > 0 && t.withinBudget && t.distanceKm > 0)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 6);
}

export function planTrip(input: PlanInput): PlanResult {
  const origin = getOrigin(input.originId);
  const vehicle = getVehicle(input.vehicleId);
  const kmPerLiter =
    input.kmPerLiter && input.kmPerLiter > 0 ? input.kmPerLiter : vehicle.kmPerLiter;

  // Convoy size: how many of this vehicle are needed to seat everyone.
  const vehiclesNeeded = Math.max(1, Math.ceil(input.people / vehicle.seats));

  // Restricted regions never appear as a budget recommendation.
  const all = DESTINATIONS.filter((d) => !isRestrictedDestination(d))
    .map((d) => planDestination(input, origin, vehicle, kmPerLiter, vehiclesNeeded, d))
    .sort((a, b) => b.score - a.score);

  const feasible = all.filter((p) => p.feasible);
  const recommended = feasible.slice(0, 3);
  // Affordable but realistically need more days than picked — surfaced with a
  // clear "add N days" suggestion instead of being wrongly shown as doable.
  const needMoreDays = all
    .filter((p) => p.withinBudget && !p.isDayTrip && !p.enoughDays)
    .sort((a, b) => a.extraDaysNeeded - b.extraDaysNeeded || b.score - a.score)
    .slice(0, 6);
  // "stretch": just out of budget reach (days handled by needMoreDays above).
  const stretch = all
    .filter((p) => !p.withinBudget && p.budgetUsed <= 1.4)
    .slice(0, 3);

  // Max reach: how far one-way you could drive spending ~45% of budget on fuel.
  // With a convoy, fuel burns N times faster, so reach shrinks accordingly.
  const fuelBudget = input.budget * 0.45;
  const litersAffordable = fuelBudget / FUEL_PRICES[vehicle.fuel];
  const maxReachKm = round((litersAffordable * kmPerLiter) / (2 * vehiclesNeeded));

  const nearby = nearbyCityTrips(input, origin, kmPerLiter, vehiclesNeeded, vehicle.fuel);

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
    needMoreDays,
    all,
    nearby,
  };
}
