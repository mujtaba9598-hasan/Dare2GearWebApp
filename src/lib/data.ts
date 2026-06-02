// Dare2Gear — Pakistan travel dataset
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
  /** realistic comfortable seating capacity (incl. driver) */
  seats: number;
}

// ----------------------------------------------------------------------------
// Temporarily restricted areas (security situation).
// Places in a restricted province are hidden from every AUTOMATED surface —
// budget recommendations, the explore gallery, home features and destination
// guide pages — with NO on-screen warning. They stay fully browsable on the
// /cities pages and usable in the manual any-to-any trip calculator.
// To re-enable a region later, just remove it from this set. No data is deleted.
// ----------------------------------------------------------------------------
export const RESTRICTED_PROVINCES: ReadonlySet<string> = new Set(["Balochistan"]);

export function isRestrictedProvince(province: string): boolean {
  return RESTRICTED_PROVINCES.has(province);
}

/** Origin city in a restricted province (e.g. Quetta). */
export function isRestrictedOrigin(o: OriginCity): boolean {
  return RESTRICTED_PROVINCES.has(o.province);
}

/** Destination whose region falls in a restricted province (e.g. Kund Malir → "Balochistan Coast"). */
export function isRestrictedDestination(d: Destination): boolean {
  return [...RESTRICTED_PROVINCES].some((p) => d.region.includes(p));
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

  // --- Punjab ---
  { id: "gujranwala", name: "Gujranwala", province: "Punjab", lat: 32.1617, lng: 74.1883 },
  { id: "sialkot", name: "Sialkot", province: "Punjab", lat: 32.4945, lng: 74.5229 },
  { id: "bahawalpur", name: "Bahawalpur", province: "Punjab", lat: 29.3956, lng: 71.6836 },
  { id: "sargodha", name: "Sargodha", province: "Punjab", lat: 32.0836, lng: 72.6711 },
  { id: "sahiwal", name: "Sahiwal", province: "Punjab", lat: 30.6682, lng: 73.1114 },
  { id: "sheikhupura", name: "Sheikhupura", province: "Punjab", lat: 31.7131, lng: 73.9783 },
  { id: "rahimyarkhan", name: "Rahim Yar Khan", province: "Punjab", lat: 28.4202, lng: 70.2952 },
  { id: "jhang", name: "Jhang", province: "Punjab", lat: 31.2681, lng: 72.3181 },
  { id: "gujrat", name: "Gujrat", province: "Punjab", lat: 32.5731, lng: 74.0789 },
  { id: "kasur", name: "Kasur", province: "Punjab", lat: 31.1187, lng: 74.4504 },
  { id: "okara", name: "Okara", province: "Punjab", lat: 30.8138, lng: 73.4534 },
  { id: "dgkhan", name: "Dera Ghazi Khan", province: "Punjab", lat: 30.0561, lng: 70.6403 },
  { id: "chiniot", name: "Chiniot", province: "Punjab", lat: 31.7202, lng: 72.9783 },
  { id: "mianwali", name: "Mianwali", province: "Punjab", lat: 32.5853, lng: 71.5436 },
  { id: "bhakkar", name: "Bhakkar", province: "Punjab", lat: 31.6333, lng: 71.0667 },
  { id: "jhelum", name: "Jhelum", province: "Punjab", lat: 32.9425, lng: 73.7257 },
  { id: "attock", name: "Attock", province: "Punjab", lat: 33.7667, lng: 72.3597 },
  { id: "chakwal", name: "Chakwal", province: "Punjab", lat: 32.9303, lng: 72.8553 },
  { id: "vehari", name: "Vehari", province: "Punjab", lat: 30.0419, lng: 72.3489 },
  { id: "khanewal", name: "Khanewal", province: "Punjab", lat: 30.3017, lng: 71.9321 },
  { id: "muzaffargarh", name: "Muzaffargarh", province: "Punjab", lat: 30.0703, lng: 71.1933 },
  { id: "tobateksingh", name: "Toba Tek Singh", province: "Punjab", lat: 30.9709, lng: 72.4826 },
  { id: "hafizabad", name: "Hafizabad", province: "Punjab", lat: 32.0709, lng: 73.6883 },
  { id: "mandibahauddin", name: "Mandi Bahauddin", province: "Punjab", lat: 32.5861, lng: 73.4914 },
  { id: "narowal", name: "Narowal", province: "Punjab", lat: 32.1014, lng: 74.8728 },

  // --- Sindh ---
  { id: "larkana", name: "Larkana", province: "Sindh", lat: 27.56, lng: 68.2264 },
  { id: "nawabshah", name: "Nawabshah", province: "Sindh", lat: 26.2442, lng: 68.41 },
  { id: "mirpurkhas", name: "Mirpur Khas", province: "Sindh", lat: 25.5276, lng: 69.0111 },
  { id: "jacobabad", name: "Jacobabad", province: "Sindh", lat: 28.282, lng: 68.4376 },
  { id: "shikarpur", name: "Shikarpur", province: "Sindh", lat: 27.9556, lng: 68.6382 },
  { id: "thatta", name: "Thatta", province: "Sindh", lat: 24.7461, lng: 67.9243 },
  { id: "dadu", name: "Dadu", province: "Sindh", lat: 26.7319, lng: 67.7758 },
  { id: "khairpur", name: "Khairpur", province: "Sindh", lat: 27.5295, lng: 68.7592 },
  { id: "tandoadam", name: "Tando Adam", province: "Sindh", lat: 25.7667, lng: 68.6622 },

  // --- KPK ---
  { id: "mardan", name: "Mardan", province: "KPK", lat: 34.1989, lng: 72.0231 },
  { id: "abbottabad", name: "Abbottabad", province: "KPK", lat: 34.1495, lng: 73.1995 },
  { id: "mansehra", name: "Mansehra", province: "KPK", lat: 34.3333, lng: 73.1968 },
  { id: "kohat", name: "Kohat", province: "KPK", lat: 33.5869, lng: 71.4414 },
  { id: "swabi", name: "Swabi", province: "KPK", lat: 34.1206, lng: 72.4697 },
  { id: "nowshera", name: "Nowshera", province: "KPK", lat: 34.0153, lng: 71.9747 },
  { id: "dikhan", name: "Dera Ismail Khan", province: "KPK", lat: 31.8313, lng: 70.9019 },
  { id: "bannu", name: "Bannu", province: "KPK", lat: 32.9889, lng: 70.6056 },
  { id: "charsadda", name: "Charsadda", province: "KPK", lat: 34.1453, lng: 71.7308 },
  { id: "haripur", name: "Haripur", province: "KPK", lat: 33.9947, lng: 72.9342 },

  // --- Balochistan ---
  { id: "gwadar", name: "Gwadar", province: "Balochistan", lat: 25.1264, lng: 62.3225 },
  { id: "turbat", name: "Turbat", province: "Balochistan", lat: 26.0031, lng: 63.0544 },
  { id: "khuzdar", name: "Khuzdar", province: "Balochistan", lat: 27.812, lng: 66.617 },
  { id: "chaman", name: "Chaman", province: "Balochistan", lat: 30.9214, lng: 66.4597 },
  { id: "sibi", name: "Sibi", province: "Balochistan", lat: 29.543, lng: 67.8773 },
  { id: "ziarat", name: "Ziarat", province: "Balochistan", lat: 30.3817, lng: 67.7264 },
  { id: "kundmalir", name: "Kund Malir", province: "Balochistan", lat: 25.52, lng: 65.5 },

  // --- Azad Kashmir ---
  { id: "mirpurajk", name: "Mirpur (AJK)", province: "Azad Kashmir", lat: 33.1478, lng: 73.7517 },
  { id: "muzaffarabad", name: "Muzaffarabad", province: "Azad Kashmir", lat: 34.37, lng: 73.4711 },
  { id: "kotli", name: "Kotli", province: "Azad Kashmir", lat: 33.5156, lng: 73.9022 },
  { id: "bagh", name: "Bagh", province: "Azad Kashmir", lat: 33.98, lng: 73.77 },
  { id: "bhimber", name: "Bhimber", province: "Azad Kashmir", lat: 32.975, lng: 74.079 },
  { id: "palandri", name: "Palandri", province: "Azad Kashmir", lat: 33.7167, lng: 73.6896 },
  { id: "hattianbala", name: "Hattian Bala", province: "Azad Kashmir", lat: 34.17, lng: 73.74 },
  { id: "athmuqam", name: "Athmuqam", province: "Azad Kashmir", lat: 34.5847, lng: 73.905 },
  { id: "forwardkahuta", name: "Forward Kahuta", province: "Azad Kashmir", lat: 33.85, lng: 74.083 },

  // --- Additional cities (population list, 2026) ---
  { id: "mingora", name: "Mingora", province: "KPK", lat: 34.7795, lng: 72.3614 },
  { id: "wahcantt", name: "Wah Cantonment", province: "Punjab", lat: 33.7986, lng: 72.7236 },
  { id: "kamoke", name: "Kamoke", province: "Punjab", lat: 31.974, lng: 74.2235 },
  { id: "burewala", name: "Burewala", province: "Punjab", lat: 30.1575, lng: 72.6814 },
  { id: "sadiqabad", name: "Sadiqabad", province: "Punjab", lat: 28.3091, lng: 70.1295 },
  { id: "khanpur", name: "Khanpur", province: "Punjab", lat: 28.6471, lng: 70.662 },
  { id: "gojra", name: "Gojra", province: "Punjab", lat: 31.15, lng: 72.6861 },
  { id: "bahawalnagar", name: "Bahawalnagar", province: "Punjab", lat: 29.9947, lng: 73.2536 },
  { id: "pakpattan", name: "Pakpattan", province: "Punjab", lat: 30.3431, lng: 73.3858 },
  { id: "jaranwala", name: "Jaranwala", province: "Punjab", lat: 31.3339, lng: 73.4194 },
  { id: "chishtian", name: "Chishtian", province: "Punjab", lat: 29.7975, lng: 72.8578 },
  { id: "daska", name: "Daska", province: "Punjab", lat: 32.3242, lng: 74.35 },
  { id: "ahmadpureast", name: "Ahmadpur East", province: "Punjab", lat: 29.1428, lng: 71.2606 },
  { id: "kamalia", name: "Kamalia", province: "Punjab", lat: 30.7258, lng: 72.6447 },
  { id: "wazirabad", name: "Wazirabad", province: "Punjab", lat: 32.45, lng: 74.12 },
  { id: "khushab", name: "Khushab", province: "Punjab", lat: 32.2961, lng: 72.3531 },
  { id: "kotadu", name: "Kot Adu", province: "Punjab", lat: 30.4711, lng: 70.9644 },
  { id: "chichawatni", name: "Chichawatni", province: "Punjab", lat: 30.5361, lng: 72.7011 },
  { id: "kandhkot", name: "Kandhkot", province: "Sindh", lat: 28.2362, lng: 69.1769 },
  { id: "tandoallahyar", name: "Tando Allahyar", province: "Sindh", lat: 25.46, lng: 68.7178 },
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
    id: "panjpeer",
    name: "Panjpeer Rocks",
    region: "Potohar, Punjab",
    lat: 33.7783,
    lng: 73.4736,
    tier: "low",
    costFactor: 1.0,
    scenicScore: 58,
    bestMonths: "Mar–Jun, Sep–Nov",
    blurb: "A dramatic sandstone ridge on the Potohar Plateau — a short, popular sunrise hike near Islamabad.",
    attractions: ["Sunrise Viewpoint", "Sandstone Boulders", "Ridge Hike", "Camping"],
    terrain: "mixed",
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
    id: "rawalakot",
    name: "Rawalakot (Pearl Valley)",
    region: "Azad Kashmir",
    lat: 33.8578,
    lng: 73.7604,
    tier: "low",
    costFactor: 1.1,
    scenicScore: 72,
    bestMonths: "Apr–Oct",
    blurb: "The 'Pearl Valley' of Poonch — pine ridges, the calm Banjosa Lake and the sweeping meadows of Toli Pir.",
    attractions: ["Banjosa Lake", "Toli Pir", "Sudhan Gali", "Tatta Pani"],
    terrain: "mixed",
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
    id: "leepa",
    name: "Leepa Valley",
    region: "Jhelum Valley, Azad Kashmir",
    lat: 34.1517,
    lng: 73.9869,
    tier: "low",
    costFactor: 1.1,
    scenicScore: 77,
    bestMonths: "May–Oct",
    blurb: "A terraced emerald valley near the LoC, famed for red rice, apple and walnut orchards and wooden Kashmiri houses.",
    attractions: ["Reshian Gali", "Dao Khun", "Chananian", "Leepa Bazaar"],
    terrain: "rough",
  },
  {
    id: "gangachoti",
    name: "Ganga Choti (Bagh)",
    region: "Bagh, Azad Kashmir",
    lat: 33.9667,
    lng: 73.6167,
    tier: "low",
    costFactor: 1.05,
    scenicScore: 74,
    bestMonths: "May–Sep",
    blurb: "A 3,044m meadow summit above Sudhan Gali — one of Kashmir's most popular and scenic day hikes.",
    attractions: ["Sudhan Gali", "Las Danna", "Pir Kanthi", "Dhirkot"],
    terrain: "rough",
  },
  {
    id: "pirchinasi",
    name: "Pir Chinasi",
    region: "Muzaffarabad, Azad Kashmir",
    lat: 34.3333,
    lng: 73.5833,
    tier: "low",
    costFactor: 1.05,
    scenicScore: 70,
    bestMonths: "Apr–Oct",
    blurb: "A 2,900m shrine-topped ridge east of Muzaffarabad with sweeping Neelum-valley views and paragliding.",
    attractions: ["Pir Chinasi Shrine", "Saral Lake", "Patika", "Lohar Gali"],
    terrain: "mixed",
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
  {
    id: "khaplu",
    name: "Khaplu",
    region: "Ghanche, Gilgit-Baltistan",
    lat: 35.1497,
    lng: 76.3403,
    tier: "medium",
    costFactor: 1.3,
    scenicScore: 86,
    bestMonths: "May–Oct",
    blurb: "An ancient royal valley on the Shyok River — terraced orchards, a restored palace and the gateway to the Hushe peaks (K6, K7, Masherbrum).",
    attractions: ["Khaplu Palace", "Chaqchan Mosque", "Hushe Valley", "Shyok River", "Saling"],
    terrain: "mixed",
  },
  {
    id: "shigar",
    name: "Shigar Valley",
    region: "Shigar, Gilgit-Baltistan",
    lat: 35.4239,
    lng: 75.7361,
    tier: "medium",
    costFactor: 1.3,
    scenicScore: 85,
    bestMonths: "Apr–Oct",
    blurb: "A green river valley of apricot orchards and old forts on the road to the Baltoro and K2 — home to the restored Serena Shigar Fort.",
    attractions: ["Serena Shigar Fort", "Blind Lake", "Amburiq Mosque", "Khilingrong Mosque", "Shigar Valley"],
    terrain: "mixed",
  },
  {
    id: "naltar",
    name: "Naltar Valley",
    region: "Gilgit-Baltistan",
    lat: 36.1667,
    lng: 74.1833,
    tier: "medium",
    costFactor: 1.25,
    scenicScore: 88,
    bestMonths: "Apr–Oct (Dec–Feb for ski)",
    blurb: "A pine-forested valley above Gilgit famous for its vivid blue lakes and Pakistan's premier ski slope, reached by a rough jeep track from Nomal.",
    attractions: ["Naltar Lakes", "Naltar Ski Resort", "Pine forests", "Strawberry Valley"],
    terrain: "rough",
  },
  {
    id: "nooritop",
    name: "Noori Top",
    region: "Kaghan Valley, KPK",
    lat: 34.9,
    lng: 73.75,
    tier: "medium",
    costFactor: 1.2,
    scenicScore: 84,
    bestMonths: "Jun–Sep",
    blurb: "A high alpine top above the Kaghan Valley with sweeping meadows and views toward Malika Parbat — reached by a tough off-road climb.",
    attractions: ["Summit meadows", "Malika Parbat View", "Alpine camping", "Wildflower slopes"],
    terrain: "rough",
  },
  {
    id: "raatigali",
    name: "Raati Gali",
    region: "Neelum Valley, Azad Kashmir",
    lat: 34.78,
    lng: 74.28,
    tier: "medium",
    costFactor: 1.2,
    scenicScore: 86,
    bestMonths: "Jun–Sep",
    blurb: "A stunning glacial alpine lake high above Dawarian in the Neelum Valley, ringed by snowfields and reached by a jeep ride and a short trek.",
    attractions: ["Raati Gali Lake", "Alpine meadows", "Glacier streams", "Camping"],
    terrain: "rough",
  },
  {
    id: "baboonvalley",
    name: "Bashoo Valley",
    region: "Gilgit-Baltistan",
    lat: 36.0,
    lng: 74.0,
    tier: "medium",
    costFactor: 1.25,
    scenicScore: 80,
    bestMonths: "Apr–Oct",
    blurb: "A quiet, lesser-known green valley in the north — meadows, streams and mountain views away from the crowds.",
    attractions: ["Valley meadows", "Mountain views", "Camping", "Riverside walks"],
    terrain: "rough",
  },
  {
    id: "dudipatsar",
    name: "Dudipatsar Lake",
    region: "Kaghan Valley, KPK",
    lat: 35.0667,
    lng: 73.9167,
    tier: "medium",
    costFactor: 1.2,
    scenicScore: 90,
    bestMonths: "Jul–Sep",
    blurb: "An emerald alpine lake at 3,800m ringed by snow-streaked peaks — reached by a jeep to Besal and a steep day-trek through wildflower meadows.",
    attractions: ["Dudipatsar Lake", "Besal", "Wildflower meadows", "Alpine trek"],
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
  {
    id: "broghil",
    name: "Broghil Valley",
    region: "Upper Chitral, KPK",
    lat: 36.8667,
    lng: 73.3667,
    tier: "high",
    costFactor: 1.45,
    scenicScore: 89,
    bestMonths: "Jul–Sep",
    blurb: "A remote high-altitude valley of yak pastures and Wakhi villages on the Afghan Pamir border — the rugged gateway to the glacial Karombar Lake.",
    attractions: ["Karombar Lake", "Qalandar Uween Lake", "Yak pastures", "Wakhi villages", "Broghil Pass"],
    terrain: "rough",
  },
  {
    id: "shimshal",
    name: "Shimshal Valley",
    region: "Gilgit-Baltistan",
    lat: 36.4406,
    lng: 75.2997,
    tier: "high",
    costFactor: 1.4,
    scenicScore: 90,
    bestMonths: "May–Oct",
    blurb: "Hunza's highest village at 3,100m, reached by a dramatic cliff-hanging jeep road — a mountaineers' valley and gateway to the Shimshal Pass Pamir pastures.",
    attractions: ["Shimshal Pass", "Pamir pastures", "Shimshal village", "Cliff jeep road", "Minglik Sar views"],
    terrain: "rough",
  },
];

// ----------------------------------------------------------------------------
// Vehicles
// ----------------------------------------------------------------------------
export const VEHICLES: VehicleModel[] = [
  // Bikes (rider + 1 pillion)
  { id: "cd70", name: "Honda CD 70", class: "bike", kmPerLiter: 55, fuel: "petrol", seats: 2 },
  { id: "cg125", name: "Honda CG 125", class: "bike", kmPerLiter: 40, fuel: "petrol", seats: 2 },
  { id: "ybr125", name: "Yamaha YBR 125", class: "bike", kmPerLiter: 42, fuel: "petrol", seats: 2 },
  { id: "gs150", name: "Suzuki GS 150", class: "bike", kmPerLiter: 40, fuel: "petrol", seats: 2 },
  { id: "cb150", name: "Honda CB 150F", class: "bike", kmPerLiter: 40, fuel: "petrol", seats: 2 },
  { id: "bike-other", name: "Touring Bike 250cc", class: "bike", kmPerLiter: 30, fuel: "petrol", seats: 2 },

  // Cars
  { id: "alto", name: "Suzuki Alto", class: "car", kmPerLiter: 18, fuel: "petrol", seats: 4 },
  { id: "wagonr", name: "Suzuki Wagon R", class: "car", kmPerLiter: 16, fuel: "petrol", seats: 4 },
  { id: "cultus", name: "Suzuki Cultus", class: "car", kmPerLiter: 14, fuel: "petrol", seats: 4 },
  { id: "mehran", name: "Suzuki Mehran", class: "car", kmPerLiter: 14, fuel: "petrol", seats: 4 },
  { id: "corolla", name: "Toyota Corolla", class: "car", kmPerLiter: 12, fuel: "petrol", seats: 5 },
  { id: "civic", name: "Honda Civic", class: "car", kmPerLiter: 11, fuel: "petrol", seats: 5 },
  { id: "yaris", name: "Toyota Yaris", class: "car", kmPerLiter: 14, fuel: "petrol", seats: 5 },
  { id: "car-other", name: "Other / generic car", class: "car", kmPerLiter: 13, fuel: "petrol", seats: 5 },

  // SUVs
  { id: "brv", name: "Honda BR-V", class: "suv", kmPerLiter: 12, fuel: "petrol", seats: 7 },
  { id: "sportage", name: "Kia Sportage", class: "suv", kmPerLiter: 11, fuel: "petrol", seats: 5 },
  { id: "fortuner", name: "Toyota Fortuner", class: "suv", kmPerLiter: 9, fuel: "diesel", seats: 7 },
  { id: "prado", name: "Toyota Prado", class: "suv", kmPerLiter: 8, fuel: "diesel", seats: 7 },
  { id: "landcruiser", name: "Toyota Land Cruiser", class: "suv", kmPerLiter: 6, fuel: "diesel", seats: 8 },
  { id: "suv-other", name: "Other / generic SUV", class: "suv", kmPerLiter: 9, fuel: "petrol", seats: 7 },
];

// ----------------------------------------------------------------------------
// Pricing knobs (editable defaults — easy to swap for a live API later)
// ----------------------------------------------------------------------------

// Fuel prices live in src/data/fuel-prices.json — the single source of truth,
// kept current from official OGRA notifications (see scripts/update-fuel-prices.ts).
import fuelData from "@/data/fuel-prices.json";

export const FUEL_PRICES: Record<FuelType, number> = {
  petrol: fuelData.perLiter.petrol,
  diesel: fuelData.perLiter.diesel,
  "hi-octane": fuelData.perLiter["hi-octane"],
};

export const FUEL_PRICE_META = {
  effectiveDate: fuelData.effectiveDate,
  lastChecked: fuelData.lastChecked,
  source: fuelData.source,
  sourceUrl: fuelData.sourceUrl,
  note: fuelData.note,
};

/** PKR per person per night, before per-destination cost factor. */
export const HOTEL_RATES: Record<HotelTier, number> = {
  cheap: 1000,
  standard: 1500,
  luxury: 3500,
};

/** PKR per person per day, before per-destination cost factor. */
export const FOOD_RATES: Record<HotelTier, number> = {
  cheap: 1000,
  standard: 1500,
  luxury: 3000,
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
