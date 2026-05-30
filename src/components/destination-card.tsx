import Link from "next/link";
import type { DestinationPlan } from "@/lib/planner";
import { BUDGET_TIER_LABELS } from "@/lib/data";
import { pkr, km } from "@/lib/format";
import {
  MapPinIcon,
  RouteIcon,
  FuelIcon,
  BedIcon,
  UtensilsIcon,
  ClockIcon,
  CheckIcon,
  AlertIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "./icons";

const tierStyle: Record<string, string> = {
  low: "bg-brand-50 text-brand-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-violet-50 text-violet-700",
};

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 text-sm">
      <span className="flex items-center gap-2 text-muted">
        <span className="text-brand-600">{icon}</span>
        {label}
      </span>
      <span className="font-semibold text-ink tabular-nums">{value}</span>
    </div>
  );
}

export function DestinationCard({
  plan,
  highlight = false,
  rank,
}: {
  plan: DestinationPlan;
  highlight?: boolean;
  rank?: number;
}) {
  const { destination: d, costs } = plan;
  const usedPct = Math.min(100, Math.round(plan.budgetUsed * 100));
  const fuelOneWay = Math.round(costs.fuel / 2);
  const fuelLabel = plan.vehiclesNeeded > 1 ? `Fuel ×${plan.vehiclesNeeded}` : "Fuel";

  return (
    <article
      className={`group relative flex flex-col rounded-2xl border bg-surface p-5 transition-shadow hover:shadow-lg hover:shadow-slate-200/60 ${
        highlight ? "border-brand-300 ring-1 ring-brand-200" : "border-line"
      }`}
    >
      {rank && (
        <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          #{rank} pick
        </span>
      )}

      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">{d.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            <MapPinIcon className="h-3.5 w-3.5" />
            {d.region}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${tierStyle[d.tier]}`}
        >
          {BUDGET_TIER_LABELS[d.tier]}
        </span>
      </header>

      <p className="mt-3 text-sm leading-relaxed text-muted">{d.blurb}</p>

      {/* One-way vs round-trip split for distance & fuel */}
      <div className="mt-4 border-t border-line pt-3">
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 gap-y-1.5 text-sm">
          <span />
          <span className="text-right text-xs font-semibold uppercase tracking-wide text-muted">One-way</span>
          <span className="text-right text-xs font-semibold uppercase tracking-wide text-muted">Round trip</span>

          <span className="flex items-center gap-2 text-muted">
            <RouteIcon className="h-4 w-4 text-brand-600" /> Distance
          </span>
          <span className="text-right font-semibold tabular-nums text-ink">{km(plan.distanceKm)}</span>
          <span className="text-right font-semibold tabular-nums text-ink">{km(plan.roundTripKm)}</span>

          <span className="flex items-center gap-2 text-muted">
            <FuelIcon className="h-4 w-4 text-brand-600" /> {fuelLabel}
          </span>
          <span className="text-right font-semibold tabular-nums text-ink">{pkr(fuelOneWay)}</span>
          <span className="text-right font-semibold tabular-nums text-ink">{pkr(costs.fuel)}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-5 border-t border-line pt-3">
        <StatRow icon={<ClockIcon className="h-4 w-4" />} label="Drive (1-way)" value={`${plan.drivingHoursOneWay}h`} />
        <StatRow icon={<CalendarIcon className="h-4 w-4" />} label="Min days" value={`${plan.minDaysNeeded}`} />
        <StatRow icon={<BedIcon className="h-4 w-4" />} label="Stay" value={pkr(costs.hotel)} />
        <StatRow icon={<UtensilsIcon className="h-4 w-4" />} label="Food" value={pkr(costs.food)} />
      </div>

      <div className="mt-4 rounded-xl bg-canvas p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Estimated total</span>
          <span className="font-display text-lg font-bold text-ink">{pkr(costs.total)}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full ${plan.withinBudget ? "bg-brand-500" : "bg-amber-500"}`}
            style={{ width: `${usedPct}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-muted">{usedPct}% of your budget</p>
      </div>

      <div className="mt-3 flex items-start gap-2 text-sm">
        {plan.feasible ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-brand-700">
            <CheckIcon className="h-4 w-4" /> Fits your budget &amp; days
          </span>
        ) : (
          <span className="inline-flex items-start gap-1.5 font-medium text-amber-700">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" /> {plan.note}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {d.attractions.slice(0, 4).map((a) => (
          <span
            key={a}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
          >
            {a}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        <p className="text-xs text-muted">Best season · {d.bestMonths}</p>
        <Link
          href={`/destinations/${d.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 transition-colors hover:text-brand-800"
        >
          Explore guide
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
