import Link from "next/link";
import type { DestinationPlan } from "@/lib/planner";
import type { VehicleClass } from "@/lib/data";
import { pkr } from "@/lib/format";
import {
  WalletIcon,
  BikeIcon,
  CheckIcon,
  ArrowRightIcon,
  UtensilsIcon,
  BedIcon,
  UsersIcon,
  FuelIcon,
} from "./icons";

const CAMP_GEAR = [
  "Tent",
  "Sleeping bags & mats",
  "Camping stove + cooking pots",
  "Foldable chairs",
  "Torch / headlamp",
  "Dry bags",
];

const TIPS: { icon: React.ReactNode; text: string }[] = [
  { icon: <BedIcon className="h-4 w-4" />, text: "Pick guesthouses, hostels or camps over hotels — same views, a fraction of the cost." },
  { icon: <UtensilsIcon className="h-4 w-4" />, text: "Cook your own food or carry snacks; restaurant bills add up fast in remote areas." },
  { icon: <UsersIcon className="h-4 w-4" />, text: "Travel in a group and split fuel, rooms and a guide — per-person cost drops sharply." },
  { icon: <FuelIcon className="h-4 w-4" />, text: "Fill up in cities — fuel is pricier (and scarcer) at remote mountain pumps." },
];

export function SavingsPanel({
  topPlan,
  vehicleClass,
}: {
  topPlan: DestinationPlan;
  vehicleClass: VehicleClass;
}) {
  const { costs } = topPlan;
  // Camping replaces most of the hotel bill and trims food by cooking your own.
  const campSavings = Math.round((costs.hotel * 0.8 + costs.food * 0.35) / 100) * 100;
  const isBike = vehicleClass === "bike";

  return (
    <div className="mt-10">
      <h3 className="font-display text-xl font-bold text-ink">Ways to spend less</h3>
      <p className="mt-1 text-sm text-muted">
        Stretch your budget further on a {topPlan.destination.name} trip.
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Save by camping */}
        <div className="flex flex-col rounded-2xl border border-brand-200 bg-brand-50/40 p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <WalletIcon className="h-5 w-5" />
            </span>
            <div>
              <h4 className="font-display text-base font-bold text-ink">Save by camping</h4>
              <p className="text-xs text-muted">Skip hotels, cook your own food</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            {isBike ? (
              <>
                On a bike, camping is the smart move — carry a tent and stove and you
                could save roughly{" "}
                <strong className="text-brand-700">{pkr(campSavings)}</strong> on this
                trip versus hotels and eating out.
              </>
            ) : (
              <>
                Trade a hotel for a camp and cook your own meals — you could save
                roughly <strong className="text-brand-700">{pkr(campSavings)}</strong>{" "}
                on this trip.
              </>
            )}
          </p>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
            Camping gear checklist
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {CAMP_GEAR.map((g) => (
              <li key={g} className="flex items-center gap-1.5 text-sm text-ink">
                <CheckIcon className="h-4 w-4 shrink-0 text-brand-600" />
                {g}
              </li>
            ))}
          </ul>

          <Link
            href="/rentals/camping"
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <BikeIcon className="h-4 w-4" />
            Rent camping gear
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* More tips */}
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h4 className="font-display text-base font-bold text-ink">More ways to save</h4>
          <ul className="mt-4 space-y-3">
            {TIPS.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  {t.icon}
                </span>
                {t.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
