/**
 * Generates a reference of one-way road distances (km) from every origin city
 * to every tourist destination, using the same engine the app uses.
 *
 * Run:  npx tsx scripts/generate-distances.ts
 * Output: DISTANCES.md (matrix) + data/distances.csv (machine-readable)
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { ORIGINS, DESTINATIONS } from "../src/lib/data";
import { roadDistanceKm } from "../src/lib/planner";

// Build matrix: origin -> { destId: km }
const rows = ORIGINS.map((o) => ({
  origin: o,
  distances: DESTINATIONS.map((d) => ({ dest: d, km: roadDistanceKm(o, d) })),
}));

// --- Markdown matrix ---
const header = ["City", "Province", ...DESTINATIONS.map((d) => d.name)];
const sep = header.map(() => "---");
const body = rows.map((r) => [
  r.origin.name,
  r.origin.province,
  ...r.distances.map((x) => String(x.km)),
]);

const md = `# 📏 Road Distance Reference

One-way **estimated road distance in kilometres** from each origin city to each
tourist destination. Distances are derived from city coordinates using a
great-circle calculation multiplied by a terrain road-winding factor
(1.35 highway → 1.65 rough mountain track), the same method the planner uses
at runtime. Round-trip fuel cost uses double these numbers.

> These are planning estimates. Phase 2 will replace them with live Google Maps
> road distances.

**${ORIGINS.length} origin cities × ${DESTINATIONS.length} destinations.**

| ${header.join(" | ")} |
| ${sep.join(" | ")} |
${body.map((b) => `| ${b.join(" | ")} |`).join("\n")}
`;

writeFileSync("DISTANCES.md", md, "utf8");

// --- CSV ---
const csvHeader = ["origin_id", "origin", "province", "dest_id", "destination", "one_way_km", "round_trip_km"];
const csvLines = [csvHeader.join(",")];
for (const r of rows) {
  for (const x of r.distances) {
    csvLines.push(
      [r.origin.id, r.origin.name, r.origin.province, x.dest.id, x.dest.name, x.km, x.km * 2].join(","),
    );
  }
}
mkdirSync("data", { recursive: true });
writeFileSync("data/distances.csv", csvLines.join("\n"), "utf8");

console.log(
  `Generated DISTANCES.md and data/distances.csv — ${ORIGINS.length} cities × ${DESTINATIONS.length} destinations = ${ORIGINS.length * DESTINATIONS.length} routes.`,
);
