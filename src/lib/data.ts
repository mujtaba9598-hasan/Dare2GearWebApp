// Dare to Gear — Pakistan travel dataset
// All coordinates are approximate. Distances are derived at runtime
// (great-circle distance x road-winding factor) so any origin works.

export type FuelType = "petrol" | "diesel" | "hi-octane";
export type VehicleClass = "bike" | "car" | "suv";
export type HotelTier = "cheap" | "standard" | "luxury";
export type BudgetTier = "low" | "medium" | "high";

export interface GeoPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface OriginCity extends GeoPoint {
  province: string;
}

export interface Destination extends GeoPoint {
  region: string;
  tier: BudgetTier;
  /** 1.0 = baseline cost of living. Remote north costs more to stay/eat. */
  costFactor: number;
  /** 0-100, used to rank "must-see" value within a budget. */
  scenicScore: number;
  bestMonths: string;
  blurb: string;
  attractions: string[];
  /** rough road condition: paved highways vs. rough mountain track */
  terrain: "highway" | "mixed" | "rough";
}

export interface VehicleModel {
  id: string;
  name: string;
  class: VehicleClass;
  /** kilometres per litre */
  kmPerLiter: number;
  fuel: FuelType;
}

// ----------------------------------------------------------------------------
// Origin cities
// ----------------------------------------------------------------------------
export const ORIGINS: OriginCity[] = [
  { id: "karachi", name: "Karachi", province: "Sindh", lat: 24.8607, lng: 67.0011 },
  { id: "hyderabad", name: "Hyderabad", province: "Sindh", lat: 25.396, lng: 68.3578 },
  { id: "sukkur", name: "Sukkur", province: "Sindh", lat: 27.7052, lng: 68.8574 },
  { id: "lahore", name: "Lahore", province: "Punjab", lat: 31.5204, lng: 74.3587 },
  { id: "faisalabad", name: "Faisalabad", province: "Punjab", lat: 31.4504, lng: 73.135 },
  { id: "multan", name: "Multan", province: "Punjab", lat: 30.1575, lng: 71.5249 },
  { id: "islamabad", name: "Islamabad", province: "Capital", lat: 33.6844, lng: 73.0479 },
  { id: "rawalpindi", name: "Rawalpindi", province: "Punjab", lat: 33.5651, lng: 73.0169 },
  { id: "peshawar", name: "Peshawar", province: "KPK", lat: 34.0151, lng: 71.5249 },
  { id: "quetta", name: "Quetta", province: "Balochistan", lat: 30.1798, lng: 66.975 },
];

// ----------------------------------------------------------------------------
// Destinations
// ----------------------------------------------------------------------------
export const DESTINATIONS: Destination[] = [
  // --- Near / low budget ---
  {
    id: "murree",
    name: "Murree",
    region: "Punjab Hills",
    lat: 33.9078,
    lng: 73.3903,
    tier: "low",
    costFactor: 1.05,
    scenicScore: 62,
    bestMonths: "Mar–Oct, Dec (snow)",
    blurb: "Pakistan's classic hill station — pine forests, Mall Road and easy access.",
    attractions: ["Mall Road", "Patriata Chairlift", "Pindi Point", "Kashmir Point"],
    terrain: "highway",
  },
  {
    id: "nathiagali",
    name: "Nathia Gali",
    region: "Galyat, KPK",
    lat: 34.0717,
    lng: 73.3858,
    tier: "low",
    costFactor: 1.05,
    scenicScore: 68,
    bestMonths: "Apr–Oct",
    blurb: "Cool pine-clad ridge between Murree and Abbottabad with forest walks.",
    attractions: ["Mukshpuri Trek", "Governor House", "Pipeline Walk"],
    terrain: "highway",
  },
  {
    id: "naran",
    name: "Naran & Kaghan",
    region: "Kaghan Valley, KPK",
    lat: 34.9089,
    lng: 73.6517,
    tier: "low",
    costFactor: 1.15,
    scenicScore: 80,
    bestMonths: "May–Sep",
    blurb: "Alpine valley of glacial rivers, meadows and the famous Saif-ul-Malook lake.",
    attractions: ["Lake Saif-ul-Malook", "Lulusar Lake", "Babusar Top", "Shogran"],
    terrain: "mixed",
  },
  {
    id: "swat",
    name: "Swat & Kalam",
    region: "Swat Valley, KPK",
    lat: 35.4915,
    lng: 72.5805,
    tier: "low",
    costFactor: 1.1,
    scenicScore: 78,
    bestMonths: "Apr–Oct",
    blurb: "The 'Switzerland of Pakistan' — green valleys, rivers and Malam Jabba resort.",
    attractions: ["Kalam", "Mahodand Lake", "Malam Jabba", "Ushu Forest"],
    terrain: "mixed",
  },
  {
    id: "neelum",
    name: "Neelum Valley",
    region: "Azad Kashmir",
    lat: 34.5892,
    lng: 73.9076,
    tier: "low",
    costFactor: 1.1,
    scenicScore: 79,
    bestMonths: "May–Oct",
    blurb: "A long emerald river valley dotted with villages, waterfalls and lakes.",
    attractions: ["Keran", "Sharda", "Ratti Gali Lake", "Arang Kel"],
    terrain: "rough",
  },
  {
    id: "gorakh",
    name: "Gorakh Hill",
    region: "Sindh",
    lat: 26.8333,
    lng: 67.3,
    tier: "low",
    costFactor: 1.0,
    scenicScore: 55,
    bestMonths: "Nov–Feb",
    blurb: "Sindh's only hill station — a high desert plateau famous for cold nights.",
    attractions: ["Sunset Point", "Camping plateau", "Star gazing"],
    terrain: "rough",
  },
  {
    id: "kundmalir",
    name: "Kund Malir & Hingol",
    region: "Balochistan Coast",
    lat: 25.52,
    lng: 65.5,
    tier: "low",
    costFactor: 1.05,
    scenicScore: 64,
    bestMonths: "Nov–Feb",
    blurb: "Golden beach where the desert meets the sea, inside Hingol National Park.",
    attractions: ["Kund Malir Beach", "Princess of Hope", "Hinglaj Temple", "Mud volcanoes"],
    terrain: "highway",
  },

  // --- Medium budget ---
  {
    id: "hunza",
    name: "Hunza (Karimabad)",
    region: "Gilgit-Baltistan",
    lat: 36.3167,
    lng: 74.65,
    tier: "medium",
    costFactor: 1.25,
    scenicScore: 95,
    bestMonths: "Apr–Oct (Apr blossom)",
    blurb: "Iconic valley of orchards, ancient forts and 7,000m peaks ringing the horizon.",
    attractions: ["Baltit Fort", "Altit Fort", "Attabad Lake", "Eagle's Nest", "Passu Cones"],
    terrain: "highway",
  },
  {
    id: "skardu",
    name: "Skardu",
    region: "Gilgit-Baltistan",
    lat: 35.2971,
    lng: 75.6333,
    tier: "medium",
    costFactor: 1.3,
    scenicScore: 92,
    bestMonths: "Apr–Oct",
    blurb: "Gateway to the Karakoram — cold deserts, turquoise lakes and giant peaks.",
    attractions: ["Shangrila Lake", "Upper Kachura", "Shigar Fort", "Cold Desert", "Deosai"],
    terrain: "mixed",
  },
  {
    id: "gilgit",
    name: "Gilgit",
    region: "Gilgit-Baltistan",
    lat: 35.9208,
    lng: 74.3083,
    tier: "medium",
    costFactor: 1.2,
    scenicScore: 75,
    bestMonths: "Apr–Oct",
    blurb: "The bustling hub of the north and a base for Hunza, Naltar and Fairy Meadows.",
    attractions: ["Naltar Valley", "Kargah Buddha", "Rakaposhi View"],
    terrain: "highway",
  },
  {
    id: "chitral",
    name: "Chitral & Kalash",
    region: "KPK",
    lat: 35.8511,
    lng: 71.7864,
    tier: "medium",
    costFactor: 1.25,
    scenicScore: 84,
    bestMonths: "May–Sep",
    blurb: "Remote valleys below Tirich Mir, home to the unique Kalash culture.",
    attractions: ["Kalash Valleys", "Shandur Pass", "Chitral Fort", "Garam Chashma"],
    terrain: "rough",
  },
  {
    id: "astore",
    name: "Astore Valley",
    region: "Gilgit-Baltistan",
    lat: 35.3667,
    lng: 74.8589,
    tier: "medium",
    costFactor: 1.2,
    scenicScore: 82,
    bestMonths: "Jun–Sep",
    blurb: "Quiet alpine valley leading to Rama Lake and the Nanga Parbat base.",
    attractions: ["Rama Lake", "Rama Meadows", "Nanga Parbat View"],
    terrain: "rough",
  },

  // --- High budget / expedition ---
  {
    id: "fairymeadows",
    name: "Fairy Meadows",
    region: "Gilgit-Baltistan",
    lat: 35.3892,
    lng: 74.5786,
    tier: "high",
    costFactor: 1.45,
    scenicScore: 97,
    bestMonths: "Jun–Sep",
    blurb: "A grassy plateau facing the sheer 8,126m face of Nanga Parbat — a jeep + trek.",
    attractions: ["Nanga Parbat Base Camp", "Beyal Camp", "Raikot Jeep Track"],
    terrain: "rough",
  },
  {
    id: "deosai",
    name: "Deosai Plains",
    region: "Gilgit-Baltistan",
    lat: 34.9667,
    lng: 75.4167,
    tier: "high",
    costFactor: 1.4,
    scenicScore: 90,
    bestMonths: "Jul–Sep",
    blurb: "The 'Land of Giants' — the world's second-highest plateau and brown-bear country.",
    attractions: ["Sheosar Lake", "Bara Pani", "Wildflower plains"],
    terrain: "rough",
  },
  {
    id: "khunjerab",
    name: "Khunjerab Pass",
    region: "Gilgit-Baltistan",
    lat: 36.8508,
    lng: 75.4111,
    tier: "high",
    costFactor: 1.4,
    scenicScore: 88,
    bestMonths: "May–Oct",
    blurb: "The highest paved border crossing on earth (4,693m) at the China frontier.",
    attractions: ["Pak-China Border", "Khunjerab National Park", "Passu Glacier"],
    terrain: "highway",
  },
];

// ----------------------------------------------------------------------------
// Vehicles
// ----------------------------------------------------------------------------
export const VEHICLES: VehicleModel[] = [
  // Bikes
  { id: "cd70", name: "Honda CD 70", class: "bike", kmPerLiter: 55, fuel: "petrol" },
  { id: "cg125", name: "Honda CG 125", class: "bike", kmPerLiter: 45, fuel: "petrol" },
  { id: "ybr125", name: "Yamaha YBR 125", class: "bike", kmPerLiter: 42, fuel: "petrol" },
  { id: "gs150", name: "Suzuki GS 150", class: "bike", kmPerLiter: 40, fuel: "petrol" },
  { id: "cb150", name: "Honda CB 150F", class: "bike", kmPerLiter: 40, fuel: "petrol" },
  { id: "bike-other", name: "Other / generic bike", class: "bike", kmPerLiter: 40, fuel: "petrol" },

  // Cars
  { id: "alto", name: "Suzuki Alto", class: "car", kmPerLiter: 18, fuel: "petrol" },
  { id: "wagonr", name: "Suzuki Wagon R", class: "car", kmPerLiter: 16, fuel: "petrol" },
  { id: "cultus", name: "Suzuki Cultus", class: "car", kmPerLiter: 14, fuel: "petrol" },
  { id: "mehran", name: "Suzuki Mehran", class: "car", kmPerLiter: 14, fuel: "petrol" },
  { id: "corolla", name: "Toyota Corolla", class: "car", kmPerLiter: 12, fuel: "petrol" },
  { id: "civic", name: "Honda Civic", class: "car", kmPerLiter: 11, fuel: "petrol" },
  { id: "yaris", name: "Toyota Yaris", class: "car", kmPerLiter: 14, fuel: "petrol" },
  { id: "car-other", name: "Other / generic car", class: "car", kmPerLiter: 13, fuel: "petrol" },

  // SUVs
  { id: "brv", name: "Honda BR-V", class: "suv", kmPerLiter: 12, fuel: "petrol" },
  { id: "sportage", name: "Kia Sportage", class: "suv", kmPerLiter: 11, fuel: "petrol" },
  { id: "fortuner", name: "Toyota Fortuner", class: "suv", kmPerLiter: 9, fuel: "diesel" },
  { id: "prado", name: "Toyota Prado", class: "suv", kmPerLiter: 8, fuel: "diesel" },
  { id: "landcruiser", name: "Toyota Land Cruiser", class: "suv", kmPerLiter: 6, fuel: "diesel" },
  { id: "suv-other", name: "Other / generic SUV", class: "suv", kmPerLiter: 9, fuel: "petrol" },
];

// ----------------------------------------------------------------------------
// Pricing knobs (editable defaults — easy to swap for a live API later)
// ----------------------------------------------------------------------------
export const FUEL_PRICES: Record<FuelType, number> = {
  petrol: 272,
  diesel: 278,
  "hi-octane": 295,
};

/** PKR per room (2 people) per night, before per-destination cost factor. */
export const HOTEL_RATES: Record<HotelTier, number> = {
  cheap: 2500,
  standard: 6000,
  luxury: 15000,
};

/** PKR per person per day, before per-destination cost factor. */
export const FOOD_RATES: Record<HotelTier, number> = {
  cheap: 1200,
  standard: 2500,
  luxury: 5000,
};

export const HOTEL_TIER_LABELS: Record<HotelTier, string> = {
  cheap: "Cheap — guesthouses, hostels & camps",
  standard: "Standard — 3-star hotels",
  luxury: "Luxury — resorts & premium stays",
};

export const VEHICLE_CLASS_LABELS: Record<VehicleClass, string> = {
  bike: "Bike",
  car: "Car",
  suv: "SUV / 4x4",
};

export const BUDGET_TIER_LABELS: Record<BudgetTier, string> = {
  low: "Budget-friendly",
  medium: "Mid-range",
  high: "Premium / expedition",
};
