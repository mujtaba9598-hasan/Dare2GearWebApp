import { FUEL_PRICES, FUEL_PRICE_META } from "@/lib/data";
import { FuelIcon } from "./icons";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ITEMS = [
  { label: "Petrol", value: FUEL_PRICES.petrol, tone: "text-brand-700" },
  { label: "Diesel", value: FUEL_PRICES.diesel, tone: "text-amber-700" },
  { label: "Hi-Octane", value: FUEL_PRICES["hi-octane"], tone: "text-slate-600" },
];

/** Compact strip — used at the top of the planner. */
export function FuelPriceBar() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border-2 border-amber-400 border-l-8 bg-amber-100 px-4 py-3 text-sm shadow-sm shadow-amber-200/60">
      <span className="flex items-center gap-1.5 font-bold text-amber-900">
        <FuelIcon className="h-4 w-4 text-amber-600" />
        Fuel prices
      </span>
      {ITEMS.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5">
          <span className="text-muted">{it.label}</span>
          <span className={`font-bold tabular-nums ${it.tone}`}>
            Rs {it.value.toLocaleString("en-PK")}/L
          </span>
        </span>
      ))}
      <span className="ml-auto text-xs text-muted">
        As of {formatDate(FUEL_PRICE_META.effectiveDate)} ·{" "}
        <a
          href={FUEL_PRICE_META.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-700 hover:underline"
        >
          OGRA
        </a>
      </span>
    </div>
  );
}

/** Full card — used in the footer / about areas. */
export function FuelPriceCard() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <FuelIcon className="h-5 w-5" />
        </span>
        <h3 className="font-display text-sm font-bold text-ink">
          Current fuel prices
        </h3>
      </div>
      <dl className="mt-4 space-y-2">
        {ITEMS.map((it) => (
          <div key={it.label} className="flex items-center justify-between text-sm">
            <dt className="text-muted">{it.label}</dt>
            <dd className={`font-bold tabular-nums ${it.tone}`}>
              Rs {it.value.toLocaleString("en-PK")}/L
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-muted">
        Effective {formatDate(FUEL_PRICE_META.effectiveDate)} · source{" "}
        <a
          href={FUEL_PRICE_META.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-700 hover:underline"
        >
          {FUEL_PRICE_META.source}
        </a>
        . Petrol &amp; diesel are OGRA-regulated; hi-octane varies by company.
      </p>
    </div>
  );
}
