/**
 * Keeps Pakistan fuel prices current from official OGRA notifications.
 *
 *   npx tsx scripts/update-fuel-prices.ts          # fetch & update
 *   npx tsx scripts/update-fuel-prices.ts --check   # report only, don't write
 *
 * FREE — no API key required. It reads the public OGRA / PSO web pages.
 * Petrol (MS) and High-Speed Diesel (HSD) are OGRA-regulated and revised around
 * the 1st and 16th of each month. Hi-octane (HOBC) is not regulated, so it is
 * left untouched unless found.
 *
 * The script validates every parsed number is in a sane range before writing,
 * and never overwrites good data with garbage. If parsing fails it exits 1 so a
 * CI job can flag it for a quick manual edit of src/data/fuel-prices.json.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const JSON_PATH = resolve(process.cwd(), "src/data/fuel-prices.json");

// Public sources, tried in order. First one that yields valid prices wins.
const SOURCES = [
  "https://www.ogra.org.pk/notified-petroleum-prices",
  "https://pakistanpetrolprices.com/",
  "https://governmentschemes.pk/current-petroleum-price-in-pakistan/",
];

const SANE_MIN = 120;
const SANE_MAX = 800;
const isSane = (n: number) => Number.isFinite(n) && n >= SANE_MIN && n <= SANE_MAX;

/** Pull the first fuel-price number that appears after a keyword.
 * OGRA-notified prices always carry 2 decimals (e.g. 403.78), so we require a
 * decimal first — that filters out stray integers like years or "Rs 202". */
function extractAfter(text: string, keywords: string[]): number | null {
  const patterns = [
    // strongly preferred: Rs/PKR then a 3-digit number WITH decimals
    (kw: string) =>
      new RegExp(`${kw}[^0-9]{0,40}?(?:rs\\.?|pkr)\\s*([0-9]{3}\\.[0-9]{2})`, "i"),
    // any 3-digit number with decimals near the keyword
    (kw: string) => new RegExp(`${kw}[^0-9]{0,40}?([0-9]{3}\\.[0-9]{2})`, "i"),
    // last resort: Rs/PKR then a bare 3-digit integer
    (kw: string) =>
      new RegExp(`${kw}[^0-9]{0,40}?(?:rs\\.?|pkr)\\s*([0-9]{3})(?![0-9.])`, "i"),
  ];
  for (const build of patterns) {
    for (const kw of keywords) {
      const m = text.match(build(kw));
      if (m) {
        const n = parseFloat(m[1]);
        if (isSane(n)) return n;
      }
    }
  }
  return null;
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DareToGearBot/1.0; +https://github.com/mujtaba9598-hasan/Dare2GearWebApp)",
        Accept: "text/html",
      },
    });
    if (!res.ok) {
      console.warn(`  · ${url} → HTTP ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.warn(`  · ${url} → ${(e as Error).message}`);
    return null;
  }
}

async function main() {
  const checkOnly = process.argv.includes("--check");
  let petrol: number | null = null;
  let diesel: number | null = null;
  let usedSource = "";

  for (const url of SOURCES) {
    console.log(`Fetching ${url} …`);
    const html = await fetchText(url);
    if (!html) continue;
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

    const p = extractAfter(text, ["petrol", "motor spirit", "\\bMS\\b"]);
    const d = extractAfter(text, ["high speed diesel", "high-speed diesel", "\\bHSD\\b", "diesel"]);

    // Petrol and diesel are essentially never identical to the paisa — if they
    // come out equal the keyword→value mapping collided, so reject and try next.
    if (p && d && Math.abs(p - d) > 0.01) {
      petrol = p;
      diesel = d;
      usedSource = url;
      break;
    }
    if (p && d) console.warn("  · parsed petrol == diesel, skipping (unreliable).");
  }

  if (!petrol || !diesel) {
    console.error(
      "\n✗ Could not parse petrol & diesel from any source.\n" +
        "  Edit src/data/fuel-prices.json by hand (values from " +
        SOURCES[0] +
        ").",
    );
    process.exit(1);
  }

  const current = JSON.parse(readFileSync(JSON_PATH, "utf8"));
  const today = new Date().toISOString().slice(0, 10);

  console.log(
    `\nParsed from ${usedSource}\n  Petrol: Rs ${petrol}/L (was ${current.perLiter.petrol})\n  Diesel: Rs ${diesel}/L (was ${current.perLiter.diesel})`,
  );

  const changed =
    petrol !== current.perLiter.petrol || diesel !== current.perLiter.diesel;

  if (checkOnly) {
    const daysOld = Math.floor(
      (Date.now() - new Date(current.lastChecked + "T00:00:00").getTime()) / 86_400_000,
    );
    console.log(
      changed
        ? "\n→ A source reports DIFFERENT prices than stored — please verify against OGRA and update."
        : "\n→ Stored prices match the source.",
    );
    console.log(`→ Stored prices last verified ${daysOld} day(s) ago.`);
    // OGRA revises ~every 15 days; flag for a human if stored data is going stale.
    if (daysOld > 18) {
      console.error(
        "\n✗ Fuel prices look stale. Verify at " +
          current.sourceUrl +
          " and run `npm run update:fuel` (or edit src/data/fuel-prices.json).",
      );
      process.exit(1);
    }
    process.exit(0);
  }

  current.perLiter.petrol = petrol;
  current.perLiter.diesel = diesel;
  current.lastChecked = today;
  if (changed) current.effectiveDate = today;

  writeFileSync(JSON_PATH, JSON.stringify(current, null, 2) + "\n", "utf8");
  console.log(
    changed
      ? `\n✓ Updated src/data/fuel-prices.json (effectiveDate ${today}).`
      : `\n✓ Prices unchanged; refreshed lastChecked to ${today}.`,
  );
}

main();
