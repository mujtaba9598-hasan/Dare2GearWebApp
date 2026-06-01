// One-shot importer: copies the user-provided real photos into /public/photos
// and generates src/lib/photos.ts (a typed manifest of {src, caption} per place).
// Filenames are the spot names -> reworked into clean captions. Generic numbered
// files (e.g. "NALTOR 001") get a blank caption and show as plain gallery shots.
//
// Run:  node scripts/import-photos.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DEST = path.join(ROOT, "D2G (9 DESTINATIONS)", "D2G (9 DESTINATIONS)");
const SRC_CITY = path.join(ROOT, "PUNJAB");
const SRC_SINDH = path.join(ROOT, "SINDH", "SINDH");
const SRC_KPK = path.join(ROOT, "KPK", "KPK");
const SRC_BALOCH = path.join(ROOT, "BALOCHISTAN", "Balochistan");
const SRC_OTHER = path.join(ROOT, "OTHER CITIES");
const OUT_PUBLIC = path.join(ROOT, "public", "photos");
const OUT_MANIFEST = path.join(ROOT, "src", "lib", "photos.ts");

// folder name (as on disk) -> destination id in data.ts
const DEST_IDS = {
  ASTORE: "astore",
  "BABOON VALLEY": "baboonvalley",
  HUNZA: "hunza",
  KHAPLU: "khaplu",
  NALTAR: "naltar",
  "NOORI TOP": "nooritop",
  "RAATI GALI": "raatigali",
  SHIGAR: "shigar",
  SKARDU: "skardu",
};

// Punjab folder name (as on disk) -> origin city id in data.ts
const CITY_IDS = {
  "Ahmadpur East": "ahmadpureast",
  Attock: "attock",
  Bahawalnagar: "bahawalnagar",
  Bahawalpur: "bahawalpur",
  Bhakkar: "bhakkar",
  Burewala: "burewala",
  Chakwal: "chakwal",
  Chichawatni: "chichawatni",
  Chiniot: "chiniot",
  Chishtian: "chishtian",
  Daska: "daska",
  "Dera Ghazi Khan": "dgkhan",
  Faisalabad: "faisalabad",
  Gojra: "gojra",
  Gujranwala: "gujranwala",
  Gujrat: "gujrat",
  Hafizabad: "hafizabad",
  Jaranwala: "jaranwala",
  Jhang: "jhang",
  Jhelum: "jhelum",
  Kamalia: "kamalia",
  Kamoke: "kamoke",
  Kasur: "kasur",
  Khanewal: "khanewal",
  Khanpur: "khanpur",
  Khushab: "khushab",
  "Kot Adu": "kotadu",
  lahore: "lahore",
  "Mandi Bahauddin": "mandibahauddin",
  Mianwali: "mianwali",
  Multan: "multan",
  Muzaffargarh: "muzaffargarh",
  Narowal: "narowal",
  Okara: "okara",
  Pakpattan: "pakpattan",
  "Rahim Yar Khan": "rahimyarkhan",
  Rawalpindi: "rawalpindi",
  Sadiqabad: "sadiqabad",
  Sahiwal: "sahiwal",
  Sargodha: "sargodha",
  Sheikhupura: "sheikhupura",
  sialkot: "sialkot",
  "Toba Tek Singh": "tobateksingh",
  Vehari: "vehari",
  "Wah Cantonment": "wahcantt",
  Wazirabad: "wazirabad",
};

// Sindh folder name (as on disk) -> origin city id in data.ts
const SINDH_IDS = {
  DADU: "dadu",
  Hyderabad: "hyderabad",
  ISLAMABAD: "islamabad",
  Jacobabad: "jacobabad",
  Kandhkot: "kandhkot",
  Karachi: "karachi",
  Khairpur: "khairpur",
  Larkana: "larkana",
  "Mirpur Khas": "mirpurkhas",
  Nawabshah: "nawabshah",
  Shikarpur: "shikarpur",
  Sukkur: "sukkur",
  "Tando Adam": "tandoadam",
  "Tando Allahyar": "tandoallahyar",
  Thatta: "thatta",
};

// KPK folder name (as on disk) -> origin city id in data.ts
const KPK_IDS = {
  Abbottabad: "abbottabad",
  Bannu: "bannu",
  Charsadda: "charsadda",
  "Dera Ismail Khan": "dikhan",
  Haripur: "haripur",
  Kohat: "kohat",
  Mansehra: "mansehra",
  Mardan: "mardan",
  Mingora: "mingora",
  Nowshera: "nowshera",
  Peshawar: "peshawar",
  Swabi: "swabi",
};

// Balochistan folder name (as on disk) -> origin city id in data.ts
const BALOCH_IDS = {
  Chaman: "chaman",
  Gwadar: "gwadar",
  Khuzdar: "khuzdar",
  Quetta: "quetta",
  Sibi: "sibi",
  Turbat: "turbat",
};

// "OTHER CITIES" folder name (as on disk) -> DESTINATION id in data.ts.
// These are tourist destinations, not origin cities. Some already have photos
// from the original 9-destinations batch; the union merge keeps both sets.
const OTHER_DEST_IDS = {
  "Chitral & Kalash": "chitral",
  "Deosai Plains": "deosai",
  "Fairy Meadows": "fairymeadows",
  Gilgit: "gilgit",
  "Gorakh Hill": "gorakh",
  KHAPLU: "khaplu",
  "Khunjerab Pass": "khunjerab",
  MURREE: "murree",
  "NALTAR VALLEY": "naltar",
  "Naran & Kaghan": "naran",
  "Nathia Gali": "nathiagali",
  "Neelum Valley": "neelum",
  "NOORI TOP": "nooritop",
  "RAATI GALI": "raatigali",
  "Rawalakot (Pearl Valley)": "rawalakot",
  "Swat & Kalam": "swat",
};

// Skip these source photos entirely (e.g. a place that turned out not to exist).
const SKIP_SRC = new Set(["/photos/cities/daska/daska-fort-kot-daska.jpg"]);

// Fix captions where the source filename was truncated. Keyed by output src path.
const CAPTION_OVERRIDES = {
  "/photos/cities/kohat/tanda-wildlife-par.jpg": "Tanda Wildlife Park",
  "/photos/cities/mingora/mingora-bazaa.jpg": "Mingora Bazaar",
};

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Turn a filename (no ext) into a clean caption. Blank for generic numbered shots.
function rework(base) {
  if (/\d{2,3}$/.test(base.trim())) return ""; // e.g. "NALTOR 001"
  const s = base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return s
    .split(" ")
    .map((w) => {
      if (/\d/.test(w)) return w; // keep K2, K6, K7 etc as-is
      if (w.length <= 3 && w === w.toUpperCase()) return w; // acronyms: DG, DHA
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

function importFolder(srcRoot, folder, id, kind) {
  const srcDir = path.join(srcRoot, folder);
  const files = fs
    .readdirSync(srcDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();
  const destDir = path.join(OUT_PUBLIC, kind, id);
  fs.mkdirSync(destDir, { recursive: true });
  const photos = [];
  for (const f of files) {
    const ext = path.extname(f).toLowerCase().replace(".jpeg", ".jpg");
    const base = path.basename(f, path.extname(f));
    const caption = rework(base);
    const fileSlug = slug(base) || "photo";
    const outName = `${fileSlug}${ext}`;
    const src = `/photos/${kind}/${id}/${outName}`;
    if (SKIP_SRC.has(src)) continue;
    fs.copyFileSync(path.join(srcDir, f), path.join(destDir, outName));
    photos.push({ src, caption: CAPTION_OVERRIDES[src] ?? caption });
  }
  return photos;
}

// Union new photos into a base map per id, de-duping by src path. New photos are
// appended after existing ones, so already-imported (and caption-fixed) shots are
// preserved and only genuinely new spots get added. Never removes anything.
function mergePhotoMaps(base, add) {
  const out = { ...base };
  for (const [id, photos] of Object.entries(add)) {
    const existing = out[id] ?? [];
    const seen = new Set(existing.map((p) => p.src));
    out[id] = [...existing, ...photos.filter((p) => !seen.has(p.src))];
  }
  return out;
}

function buildMap(srcRoot, idMap, kind) {
  const out = {};
  for (const [folder, id] of Object.entries(idMap)) {
    if (!fs.existsSync(path.join(srcRoot, folder))) {
      console.warn(`! missing folder: ${folder} (keeping any existing photos)`);
      continue;
    }
    out[id] = importFolder(srcRoot, folder, id, kind);
  }
  return out;
}

// Load the already-generated manifest so a run with only SOME raw source folders
// present (they're gitignored and ephemeral) MERGES rather than wipes the rest.
// Only ids we actually re-import below are overwritten; everyone else is kept.
async function loadExisting() {
  if (!fs.existsSync(OUT_MANIFEST)) return { dest: {}, city: {} };
  const ts = fs.readFileSync(OUT_MANIFEST, "utf8");
  const js = ts
    .replace(/export interface Photo \{[\s\S]*?\}\r?\n/, "")
    .replace(/: Record<string, Photo\[\]>/g, "")
    .replace(/: Photo\[\]/g, "")
    .replace(/: string \| undefined/g, "")
    .replace(/\(id: string\)/g, "(id)");
  const tmp = path.join(ROOT, "scripts", ".photos.existing.mjs");
  fs.writeFileSync(tmp, js);
  try {
    const mod = await import("file://" + tmp.replace(/\\/g, "/") + "?t=" + process.hrtime.bigint());
    return { dest: mod.DESTINATION_PHOTOS ?? {}, city: mod.CITY_PHOTOS ?? {} };
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

const existing = await loadExisting();

// Each source is union-merged into the running map: missing folders keep their
// committed photos, present folders add any new spots without dropping old ones.
console.log("Importing destination photos...");
let destPhotos = existing.dest;
destPhotos = mergePhotoMaps(destPhotos, buildMap(SRC_DEST, DEST_IDS, "destinations"));
destPhotos = mergePhotoMaps(destPhotos, buildMap(SRC_OTHER, OTHER_DEST_IDS, "destinations"));

console.log("Importing city photos...");
let cityPhotos = existing.city;
cityPhotos = mergePhotoMaps(cityPhotos, buildMap(SRC_CITY, CITY_IDS, "cities"));
cityPhotos = mergePhotoMaps(cityPhotos, buildMap(SRC_SINDH, SINDH_IDS, "cities"));
cityPhotos = mergePhotoMaps(cityPhotos, buildMap(SRC_KPK, KPK_IDS, "cities"));
cityPhotos = mergePhotoMaps(cityPhotos, buildMap(SRC_BALOCH, BALOCH_IDS, "cities"));

const stringify = (obj) =>
  "{\n" +
  Object.entries(obj)
    .map(
      ([id, arr]) =>
        `  ${JSON.stringify(id)}: [\n` +
        arr
          .map((p) => `    { src: ${JSON.stringify(p.src)}, caption: ${JSON.stringify(p.caption)} },`)
          .join("\n") +
        "\n  ],",
    )
    .join("\n") +
  "\n}";

const banner = `// AUTO-GENERATED by scripts/import-photos.mjs — do not edit by hand.
// Real, user-provided photos for destinations & cities. Captions come from the
// original filenames (reworked); blank caption = generic gallery shot.

export interface Photo {
  /** Path under /public. */
  src: string;
  /** Clean spot name shown UNDER the image (blank for generic gallery shots). */
  caption: string;
}
`;

const body = `${banner}
export const DESTINATION_PHOTOS: Record<string, Photo[]> = ${stringify(destPhotos)};

export const CITY_PHOTOS: Record<string, Photo[]> = ${stringify(cityPhotos)};

export function destPhotos(id: string): Photo[] {
  return DESTINATION_PHOTOS[id] ?? [];
}

export function cityPhotos(id: string): Photo[] {
  return CITY_PHOTOS[id] ?? [];
}

/** First real photo for a place, used as the hero when available. */
export function destHero(id: string): string | undefined {
  return DESTINATION_PHOTOS[id]?.[0]?.src;
}

export function cityHero(id: string): string | undefined {
  return CITY_PHOTOS[id]?.[0]?.src;
}
`;

fs.writeFileSync(OUT_MANIFEST, body);

const dCount = Object.values(destPhotos).reduce((n, a) => n + a.length, 0);
const cCount = Object.values(cityPhotos).reduce((n, a) => n + a.length, 0);
console.log(`\nDone.`);
console.log(`  destinations: ${Object.keys(destPhotos).length} places, ${dCount} photos`);
console.log(`  cities:       ${Object.keys(cityPhotos).length} places, ${cCount} photos`);
console.log(`  manifest:     src/lib/photos.ts`);
