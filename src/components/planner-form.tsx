"use client";

import { useMemo, useRef, useState } from "react";
import {
  ORIGINS,
  VEHICLES,
  HOTEL_RATES,
  HOTEL_TIER_LABELS,
  isRestrictedProvince,
  type HotelTier,
  type VehicleClass,
} from "@/lib/data";
import { planTrip, type PlanInput, type PlanResult } from "@/lib/planner";
import { pkrCompact } from "@/lib/format";
import { ResultsView } from "./results-view";
import {
  WalletIcon,
  UsersIcon,
  CalendarIcon,
  CompassIcon,
  CarIcon,
  BikeIcon,
  GaugeIcon,
  BedIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "./icons";

const CLASS_TABS: { value: VehicleClass; label: string; icon: React.ReactNode }[] = [
  { value: "bike", label: "Bike", icon: <BikeIcon className="h-4 w-4" /> },
  { value: "car", label: "Car", icon: <CarIcon className="h-4 w-4" /> },
  { value: "suv", label: "SUV / 4x4", icon: <CarIcon className="h-4 w-4" /> },
];

const HOTEL_TIERS: HotelTier[] = ["cheap", "standard", "luxury"];
const BUDGET_CHIPS = [30000, 50000, 100000, 200000];

function Stepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  const set = (v: number) => onChange(Math.max(min, Math.min(max, v)));
  return (
    <div className="flex items-center rounded-xl border border-line bg-surface">
      <button
        type="button"
        onClick={() => set(value - 1)}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-l-xl text-lg font-semibold text-muted transition-colors hover:bg-canvas hover:text-ink"
        aria-label="Decrease"
      >
        −
      </button>
      <span className="flex-1 text-center font-display text-base font-bold tabular-nums text-ink">
        {value}
      </span>
      <button
        type="button"
        onClick={() => set(value + 1)}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-r-xl text-lg font-semibold text-muted transition-colors hover:bg-canvas hover:text-ink"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

function FieldLabel({
  icon,
  children,
  htmlFor,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink"
    >
      <span className="text-brand-600">{icon}</span>
      {children}
    </label>
  );
}

export function PlannerForm() {
  const [budget, setBudget] = useState(50000);
  const [people, setPeople] = useState(2);
  const [days, setDays] = useState(4);
  const [originId, setOriginId] = useState("lahore");
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>("car");
  const [vehicleId, setVehicleId] = useState("corolla");
  const [mileage, setMileage] = useState<number>(12);
  const [hotelTier, setHotelTier] = useState<HotelTier>("standard");

  const [result, setResult] = useState<PlanResult | null>(null);
  const [submitted, setSubmitted] = useState<PlanInput | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const modelsForClass = useMemo(
    () => VEHICLES.filter((v) => v.class === vehicleClass),
    [vehicleClass],
  );

  const originsByProvince = useMemo(() => {
    const groups = new Map<string, typeof ORIGINS>();
    for (const o of ORIGINS) {
      // Restricted provinces aren't offered as a budget-trip starting point.
      if (isRestrictedProvince(o.province)) continue;
      const list = groups.get(o.province) ?? [];
      list.push(o);
      groups.set(o.province, list);
    }
    for (const list of groups.values()) {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return [...groups.entries()];
  }, []);

  const handleClassChange = (cls: VehicleClass) => {
    setVehicleClass(cls);
    const first = VEHICLES.find((v) => v.class === cls)!;
    setVehicleId(first.id);
    setMileage(first.kmPerLiter);
  };

  const handleModelChange = (id: string) => {
    setVehicleId(id);
    const v = VEHICLES.find((x) => x.id === id);
    if (v) setMileage(v.kmPerLiter);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: PlanInput = {
      budget,
      people,
      days,
      originId,
      vehicleId,
      kmPerLiter: mileage,
      hotelTier,
    };
    setResult(planTrip(input));
    setSubmitted(input);
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Budget */}
          <div className="md:col-span-2">
            <FieldLabel icon={<WalletIcon className="h-4 w-4" />} htmlFor="budget">
              Your total budget (PKR)
            </FieldLabel>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-muted">
                Rs
              </span>
              <input
                id="budget"
                type="number"
                min={5000}
                step={1000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full rounded-xl border border-line bg-surface py-3 pl-11 pr-4 font-display text-lg font-bold text-ink outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {BUDGET_CHIPS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBudget(c)}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    budget === c
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-line text-muted hover:border-brand-300 hover:text-ink"
                  }`}
                >
                  {pkrCompact(c)}
                </button>
              ))}
            </div>
          </div>

          {/* People */}
          <div>
            <FieldLabel icon={<UsersIcon className="h-4 w-4" />}>
              Number of travelers
            </FieldLabel>
            <Stepper value={people} onChange={setPeople} min={1} max={12} />
          </div>

          {/* Days */}
          <div>
            <FieldLabel icon={<CalendarIcon className="h-4 w-4" />}>
              Days available
            </FieldLabel>
            <Stepper value={days} onChange={setDays} min={1} max={21} />
          </div>

          {/* Origin */}
          <div>
            <FieldLabel icon={<CompassIcon className="h-4 w-4" />} htmlFor="origin">
              Starting city
            </FieldLabel>
            <select
              id="origin"
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            >
              {originsByProvince.map(([province, cities]) => (
                <optgroup key={province} label={province}>
                  {cities.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Vehicle model */}
          <div>
            <FieldLabel icon={<GaugeIcon className="h-4 w-4" />} htmlFor="vehicle">
              Vehicle model
            </FieldLabel>
            <select
              id="vehicle"
              value={vehicleId}
              onChange={(e) => handleModelChange(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            >
              {modelsForClass.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} · {v.kmPerLiter} km/L · {v.seats} seats
                </option>
              ))}
            </select>
            {(() => {
              const seats = VEHICLES.find((v) => v.id === vehicleId)?.seats ?? 0;
              const need = seats > 0 ? Math.ceil(people / seats) : 1;
              return need > 1 ? (
                <p className="mt-1 text-xs font-medium text-amber-700">
                  {people} people need {need}{" "}
                  {vehicleClass === "bike" ? "bikes" : "of these"} ({seats} seats
                  each) — fuel &amp; tolls counted for all {need}.
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted">
                  Seats {people} of {seats} — one vehicle is enough.
                </p>
              );
            })()}
          </div>

          {/* Vehicle class tabs */}
          <div className="md:col-span-2">
            <FieldLabel icon={<CarIcon className="h-4 w-4" />}>Vehicle type</FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {CLASS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleClassChange(tab.value)}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                    vehicleClass === tab.value
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-line text-muted hover:border-brand-300 hover:text-ink"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mileage override */}
          <div>
            <FieldLabel icon={<GaugeIcon className="h-4 w-4" />} htmlFor="mileage">
              Fuel average (km / litre)
            </FieldLabel>
            <input
              id="mileage"
              type="number"
              min={4}
              max={80}
              step={1}
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              className="h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm font-semibold text-ink outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
            <p className="mt-1 text-xs text-muted">
              Pre-filled from your model — adjust to your real average.
            </p>
          </div>

          {/* Hotel tier */}
          <div className="md:col-span-2">
            <FieldLabel icon={<BedIcon className="h-4 w-4" />}>
              Accommodation preference
            </FieldLabel>
            <div className="grid gap-2 sm:grid-cols-3">
              {HOTEL_TIERS.map((tier) => {
                const [title, desc] = HOTEL_TIER_LABELS[tier].split(" — ");
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setHotelTier(tier)}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors ${
                      hotelTier === tier
                        ? "border-brand-500 bg-brand-50"
                        : "border-line hover:border-brand-300"
                    }`}
                  >
                    <span className="text-sm font-bold capitalize text-ink">{title}</span>
                    <span className="text-xs text-muted">{desc}</span>
                    <span className="mt-1 text-xs font-semibold text-brand-700">
                      ~{pkrCompact(HOTEL_RATES[tier])}/room·night
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 font-display text-base font-bold text-white transition-colors hover:bg-brand-700"
        >
          <SparklesIcon className="h-5 w-5" />
          Calculate my trips
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </form>

      <div ref={resultsRef} className="scroll-mt-20">
        {result && submitted && <ResultsView input={submitted} result={result} />}
      </div>
    </>
  );
}
