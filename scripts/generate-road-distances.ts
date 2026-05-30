/**
 * Builds a REAL road-distance + drive-time matrix between every place
 * (origin cities + destinations) using the free OSRM / OpenStreetMap routing
 * engine, and writes it to src/data/road-distances.json.
 *
 * The app reads this static file — no routing API is called at runtime, so the
 * site stays fully static (Netlify / shared hosting). Re-run this whenever the
 * places list changes.
 *
 * Run:  npx tsx scripts/generate-road-distances.ts
 */
import { writeFileSync } from "node:fs";
import { ORIGINS, DESTINATIONS } from "../src/lib/data";

interface Place {
  id: string;
  lat: number;
  lng: number;
}

// Every place can be a start AND an end (cities + destinations), so the matrix
// is symmetric across the full set — powering both the budget planner and the
// any-to-any trip planner.
const places: Place[] = [...ORIGINS, ...DESTINATIONS].map((p) => ({
  id: p.id,
  lat: p.lat,
  lng: p.lng,
}));

async function main() {
  const coords = places.map((p) => `${p.lng},${p.lat}`).join(";");
  const url = `https://router.project-osrm.org/table/v1/driving/${coords}?annotations=distance,duration`;

  console.log(`Requesting ${places.length}×${places.length} OSRM matrix…`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM HTTP ${res.status}`);
  const data = (await res.json()) as {
    code: string;
    distances: (number | null)[][];
    durations: (number | null)[][];
  };
  if (data.code !== "Ok") throw new Error(`OSRM code ${data.code}`);

  const km = data.distances.map((row) =>
    row.map((m) => (m == null ? null : Math.round(m / 1000))),
  );
  const min = data.durations.map((row) =>
    row.map((s) => (s == null ? null : Math.round(s / 60))),
  );

  const out = {
    source: "OSRM / OpenStreetMap (real driving routes)",
    generated: new Date().toISOString().slice(0, 10),
    ids: places.map((p) => p.id),
    km,
    min,
  };

  writeFileSync("src/data/road-distances.json", JSON.stringify(out), "utf8");

  // Quick sanity print
  const idx = (id: string) => out.ids.indexOf(id);
  const sample = (a: string, b: string) =>
    console.log(`  ${a} → ${b}: ${km[idx(a)]?.[idx(b)]} km, ${min[idx(a)]?.[idx(b)]} min`);
  console.log(`Wrote src/data/road-distances.json (${places.length} places).`);
  sample("sialkot", "skardu");
  sample("lahore", "hunza");
  sample("karachi", "swat");
}

main().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
