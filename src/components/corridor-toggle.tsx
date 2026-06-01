"use client";

import { isBabusarSeason, type RouteChoice } from "@/lib/planner";
import { RouteIcon } from "./icons";

/** Babusar Top vs Besham/KKH corridor picker — shown only for Gilgit-Baltistan
 *  trips, where the two routes differ in distance (and one closes in winter).
 *  Distance, drive time and fuel all recompute from the chosen corridor. */
export function CorridorToggle({
  route,
  onChange,
}: {
  route: RouteChoice;
  onChange: (r: RouteChoice) => void;
}) {
  const inSeason = isBabusarSeason(new Date().getMonth());
  const options: { id: RouteChoice; title: string; note: string }[] = [
    { id: "babusar", title: "Via Babusar Top", note: "Shorter · summer only (≈ Jun–Oct)" },
    { id: "besham", title: "Via Besham / KKH", note: "Longer · open all year" },
  ];
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-ink">
        <RouteIcon className="h-4 w-4 text-amber-600" />
        Route into Gilgit-Baltistan
      </p>
      <p className="mt-1 text-xs text-muted">
        Babusar Top is a high mountain pass that closes under winter snow. Pick the
        corridor — distance, drive time and fuel update to match.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {options.map((o) => {
          const active = route === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                active
                  ? "border-brand-400 bg-brand-50 ring-1 ring-brand-300"
                  : "border-line bg-surface hover:border-brand-200"
              }`}
            >
              <span className="block text-sm font-semibold text-ink">{o.title}</span>
              <span className="mt-0.5 block text-[11px] text-muted">{o.note}</span>
            </button>
          );
        })}
      </div>
      {!inSeason && route === "babusar" && (
        <p className="mt-2 text-[11px] font-medium text-amber-700">
          Heads up: it&apos;s currently out of season — Babusar Top is likely snow-closed.
        </p>
      )}
    </div>
  );
}
