import Link from "next/link";
import type { PlanInput, PlanResult } from "@/lib/planner";
import { VEHICLE_CLASS_LABELS, HOTEL_TIER_LABELS } from "@/lib/data";
import { pkr, km } from "@/lib/format";
import { CostDonut } from "./cost-donut";
import { DestinationCard } from "./destination-card";
import { SavingsPanel } from "./savings-panel";
import {
  WalletIcon,
  UsersIcon,
  CalendarIcon,
  GaugeIcon,
  RouteIcon,
  CompassIcon,
  AlertIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "./icons";

function SummaryStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted">{label}</p>
        <p className="truncate font-display text-sm font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

export function ResultsView({
  input,
  result,
}: {
  input: PlanInput;
  result: PlanResult;
}) {
  const top = result.recommended[0];
  const extraFeasible = result.feasible.slice(3);

  return (
    <section className="mt-10">
      {/* Trip summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <SummaryStat
          icon={<WalletIcon className="h-5 w-5" />}
          label="Budget"
          value={pkr(input.budget)}
        />
        <SummaryStat
          icon={<CompassIcon className="h-5 w-5" />}
          label="From"
          value={result.origin.name}
        />
        <SummaryStat
          icon={<GaugeIcon className="h-5 w-5" />}
          label={
            result.needsMultipleVehicles
              ? `${result.vehiclesNeeded}× ${VEHICLE_CLASS_LABELS[result.vehicle.class]}`
              : VEHICLE_CLASS_LABELS[result.vehicle.class]
          }
          value={`${result.effectiveKmPerLiter} km/L`}
        />
        <SummaryStat
          icon={<UsersIcon className="h-5 w-5" />}
          label="Travelers"
          value={`${input.people}`}
        />
        <SummaryStat
          icon={<CalendarIcon className="h-5 w-5" />}
          label="Days"
          value={`${input.days}`}
        />
        <SummaryStat
          icon={<RouteIcon className="h-5 w-5" />}
          label="Max reach"
          value={km(result.maxReachKm)}
        />
      </div>

      {/* Convoy notice — group exceeds one vehicle's seats */}
      {result.needsMultipleVehicles && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <UsersIcon className="h-5 w-5" />
          </span>
          <p className="text-sm leading-relaxed text-amber-900">
            Your group of <strong>{input.people}</strong> won&apos;t fit in one{" "}
            {result.vehicle.name} ({result.seatsPerVehicle} seats), so the plan
            assumes a <strong>convoy of {result.vehiclesNeeded} {result.vehicle.class === "bike" ? "bikes" : "vehicles"}</strong>.
            Fuel and tolls below are counted for all {result.vehiclesNeeded} — hotels and
            food stay per-person.
          </p>
        </div>
      )}

      {result.recommended.length > 0 ? (
        <>
          {/* Headline + breakdown of top pick */}
          <div className="mt-8 grid gap-6 rounded-2xl border border-brand-200 bg-brand-50/40 p-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                Best match
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                You can do {input.days} days in {top.destination.name}.
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                A {km(top.distanceKm)} drive ({top.drivingHoursOneWay}h one way) from{" "}
                {result.origin.name} for {input.people}{" "}
                {input.people === 1 ? "person" : "people"}, staying in{" "}
                {HOTEL_TIER_LABELS[input.hotelTier].split(" — ")[0].toLowerCase()} accommodation.
                Estimated total <strong className="text-ink">{pkr(top.costs.total)}</strong> —
                leaving roughly{" "}
                <strong className="text-brand-700">
                  {pkr(Math.max(0, input.budget - top.costs.total))}
                </strong>{" "}
                spare.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5">
              <CostDonut costs={top.costs} />
            </div>
          </div>

          {/* Recommended grid */}
          <div className="mt-10">
            <h3 className="font-display text-xl font-bold text-ink">
              Top picks within your budget
            </h3>
            <p className="mt-1 text-sm text-muted">
              Ranked by experience and how well they fit your money and time.
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {result.recommended.map((plan, i) => (
                <DestinationCard
                  key={plan.destination.id}
                  plan={plan}
                  highlight={i === 0}
                  rank={i + 1}
                />
              ))}
            </div>
          </div>

          <SavingsPanel topPlan={top} vehicleClass={result.vehicle.class} />

          {extraFeasible.length > 0 && (
            <div className="mt-10">
              <h3 className="font-display text-xl font-bold text-ink">
                Also within reach
              </h3>
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {extraFeasible.map((plan) => (
                  <DestinationCard key={plan.destination.id} plan={plan} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertIcon className="h-6 w-6" />
          </span>
          <h3 className="font-display text-xl font-bold text-ink">
            Nothing fits perfectly yet
          </h3>
          <p className="max-w-md text-sm text-muted">
            With {pkr(input.budget)} and {input.days} days from {result.origin.name},
            no destination fully fits. Try adding a day, raising the budget, or
            choosing cheaper stays. Here are the closest options:
          </p>
        </div>
      )}

      {/* Affordable, but need more days — realism nudge */}
      {result.needMoreDays.length > 0 && (
        <div className="mt-10">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <CalendarIcon className="h-5 w-5" />
            </span>
            <p className="text-sm leading-relaxed text-amber-900">
              These fit your <strong>{pkr(input.budget)}</strong> budget, but{" "}
              <strong>{input.days} days isn&apos;t enough</strong> for them by{" "}
              {result.vehicle.class === "bike" ? "bike" : result.vehicle.class === "suv" ? "4x4" : "car"}.
              Long mountain trips mean riding a few hundred km a day, resting overnight, then
              exploring once you arrive. <strong>Add the days shown</strong> and they become
              comfortable, safe trips.
            </p>
          </div>
          <h3 className="mt-6 font-display text-xl font-bold text-ink">
            Worth it — with a few more days
          </h3>
          <p className="mt-1 text-sm text-muted">
            Each card shows the realistic day count (travel each way + time to actually see it).
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {result.needMoreDays.map((plan) => (
              <DestinationCard key={plan.destination.id} plan={plan} />
            ))}
          </div>
        </div>
      )}

      {/* Closer to home — nearby cities worth a short / day trip */}
      {result.nearby.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-xl font-bold text-ink">
            Closer to home — short trips
          </h3>
          <p className="mt-1 text-sm text-muted">
            Don&apos;t want to go far? These nearby cities fit your budget — some are
            an easy single-day round trip with no hotel needed.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.nearby.map((n) => (
              <Link
                key={n.city.id}
                href={`/cities/${n.city.id}`}
                className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md hover:shadow-slate-200/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="flex items-center gap-1.5 font-display text-base font-bold text-ink">
                      <MapPinIcon className="h-4 w-4 shrink-0 text-brand-600" />
                      {n.city.name}
                    </h4>
                    <p className="mt-0.5 text-xs text-muted">
                      {n.city.province} · {km(n.distanceKm)} away · {n.placesToSee}{" "}
                      {n.placesToSee === 1 ? "place" : "places"} to see
                    </p>
                  </div>
                  {n.isDayTrip && (
                    <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                      Day trip
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
                  <div>
                    <p className="text-[11px] text-muted">
                      Est. {n.isDayTrip ? "day-trip" : `${input.days}-day`} cost
                    </p>
                    <p className="font-display text-lg font-bold text-ink">
                      {pkr(n.costs.total)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                    See places
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-muted">
                  {n.isDayTrip
                    ? "Fuel + food only — go and return the same day."
                    : `Fuel, food and stay for ${input.people} ${input.people === 1 ? "person" : "people"}.`}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stretch goals */}
      {result.stretch.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-xl font-bold text-ink">
            Stretch goals
          </h3>
          <p className="mt-1 text-sm text-muted">
            Just out of reach — a little more budget or time unlocks these.
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {result.stretch.map((plan) => (
              <DestinationCard key={plan.destination.id} plan={plan} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
