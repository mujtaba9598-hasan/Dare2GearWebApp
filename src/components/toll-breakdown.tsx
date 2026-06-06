import type { TripTolls } from "@/lib/planner";
import { pkr } from "@/lib/format";

function TollGroup({
  title,
  withTag,
  withoutTag,
}: {
  title: string;
  withTag: number;
  withoutTag: number;
}) {
  return (
    <div className="rounded-lg bg-canvas p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-muted">With M-Tag</span>
        <span className="font-semibold tabular-nums text-ink">{pkr(withTag)}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="text-muted">Without M-Tag</span>
        <span className="font-semibold tabular-nums text-ink">{pkr(withoutTag)}</span>
      </div>
    </div>
  );
}

/** Toll display: One-Side and Round-Trip, each split With / Without M-Tag.
 *  Bikes are toll-free (banned from motorways), so it shows a note instead. */
export function TollBreakdown({ toll }: { toll: TripTolls }) {
  if (toll.roundTripWithTag === 0) {
    return (
      <p className="text-sm text-muted">
        No toll — bikes can&apos;t use the motorways and ride the toll-free national highways.
      </p>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TollGroup
        title="One Side Toll Tax"
        withTag={toll.oneWayWithTag}
        withoutTag={toll.oneWayWithoutTag}
      />
      <TollGroup
        title="Round Trip Toll Tax"
        withTag={toll.roundTripWithTag}
        withoutTag={toll.roundTripWithoutTag}
      />
    </div>
  );
}
