"use client";

import { useMemo, useState } from "react";
import {
  ALL_PLACES,
  getVehicle,
  planPointToPoint,
  type TripResult,
} from "@/lib/planner";
import { VEHICLES, HOTEL_TIER_LABELS, type HotelTier } from "@/lib/data";
import { pkr, km } from "@/lib/format";
import { waLink } from "@/lib/contact";
import {
  RouteIcon,
  ClockIcon,
  FuelIcon,
  BedIcon,
  UtensilsIcon,
  WalletIcon,
  UsersIcon,
  CalendarIcon,
  GaugeIcon,
  ArrowRightIcon,
  WhatsAppIcon,
} from "./icons";

const CITIES = ALL_PLACES.filter((p) => p.kind === "city").sort((a, b) => a.name.localeCompare(b.name));
const DESTS = ALL_PLACES.filter((p) => p.kind === "destination").sort((a, b) => a.name.localeCompare(b.name));

function PlaceSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none"
      >
        <optgroup label="Destinations">
          {DESTS.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </optgroup>
        <optgroup label="Cities">
          {CITIES.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted">{label}</p>
        <p className="truncate font-display text-sm font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

export function TripPlanner() {
  const [fromId, setFromId] = useState("lahore");
  const [toId, setToId] = useState("hunza");
  const [vehicleId, setVehicleId] = useState("corolla");
  const [mileage, setMileage] = useState(12);
  const [people, setPeople] = useState(2);
  const [days, setDays] = useState(5);
  const [hotelTier, setHotelTier] = useState<HotelTier>("standard");

  const result: TripResult | null = useMemo(
    () => planPointToPoint({ fromId, toId, vehicleId, kmPerLiter: mileage, people, days, hotelTier }),
    [fromId, toId, vehicleId, mileage, people, days, hotelTier],
  );

  function onVehicle(id: string) {
    setVehicleId(id);
    setMileage(getVehicle(id).kmPerLiter);
  }

  const samePlace = fromId === toId;

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* Inputs */}
      <div className="rounded-2xl border border-line bg-canvas p-6">
        <div className="grid gap-4">
          <PlaceSelect label="From" value={fromId} onChange={setFromId} />
          <PlaceSelect label="To" value={toId} onChange={setToId} />

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-muted">Vehicle</span>
            <select
              value={vehicleId}
              onChange={(e) => onVehicle(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none"
            >
              {VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-muted">Mileage (km/L)</span>
              <input
                type="number"
                min={1}
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value) || 1)}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-muted">Travellers</span>
              <input
                type="number"
                min={1}
                value={people}
                onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-muted">Days</span>
              <input
                type="number"
                min={1}
                value={days}
                onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-muted">Stay</span>
              <select
                value={hotelTier}
                onChange={(e) => setHotelTier(e.target.value as HotelTier)}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none"
              >
                {(Object.keys(HOTEL_TIER_LABELS) as HotelTier[]).map((t) => (
                  <option key={t} value={t}>{HOTEL_TIER_LABELS[t].split(" — ")[0]}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Result */}
      <div>
        {samePlace ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-amber-200 bg-amber-50/60 p-8 text-center text-sm text-amber-800">
            Pick two different places to plan a trip between them.
          </div>
        ) : !result ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-line bg-canvas p-8 text-center text-sm text-muted">
            No route data for this pair yet.
          </div>
        ) : (
          <div>
            <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-6">
              <p className="text-sm text-muted">Estimated cost for</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                {result.from.name} → {result.to.name}
              </h2>
              <p className="mt-3 font-display text-3xl font-extrabold text-brand-700">{pkr(result.total)}</p>
              <p className="mt-1 text-xs text-muted">
                {people} {people === 1 ? "person" : "people"} · {days} days · includes a 10% buffer
                {result.vehiclesNeeded > 1 ? ` · convoy of ${result.vehiclesNeeded}` : ""}
              </p>
              {result.isDayTrip && (
                <span className="mt-2 inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                  Short day trip (≤100 km) — no overnight stay, fuel + food only
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat icon={<RouteIcon className="h-5 w-5" />} label="One-way" value={km(result.distanceKm)} />
              <Stat icon={<RouteIcon className="h-5 w-5" />} label="Round trip" value={km(result.roundTripKm)} />
              <Stat icon={<ClockIcon className="h-5 w-5" />} label="Drive (1-way)" value={`${result.driveHoursOneWay}h`} />
              <Stat icon={<GaugeIcon className="h-5 w-5" />} label="Mileage" value={`${result.effectiveKmPerLiter} km/L`} />
              <Stat icon={<UsersIcon className="h-5 w-5" />} label="Travellers" value={`${people}`} />
              <Stat icon={<CalendarIcon className="h-5 w-5" />} label="Days" value={`${days}`} />
            </div>

            <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-display text-sm font-bold text-ink">Cost breakdown</h3>
              <dl className="mt-3 space-y-2 text-sm">
                {[
                  [<FuelIcon key="f" className="h-4 w-4" />, `Fuel (round trip${result.vehiclesNeeded > 1 ? ` ×${result.vehiclesNeeded}` : ""})`, result.fuelRoundTrip],
                  [<BedIcon key="b" className="h-4 w-4" />, "Stay", result.hotel],
                  [<UtensilsIcon key="u" className="h-4 w-4" />, "Food", result.food],
                  [<WalletIcon key="t" className="h-4 w-4" />, "Tolls", result.tolls],
                  [<WalletIcon key="bu" className="h-4 w-4" />, "Buffer (10%)", result.buffer],
                ].map(([icon, label, val], i) => (
                  <div key={i} className="flex items-center justify-between">
                    <dt className="flex items-center gap-2 text-muted">
                      <span className="text-brand-600">{icon}</span>
                      {label as string}
                    </dt>
                    <dd className="font-semibold tabular-nums text-ink">{pkr(val as number)}</dd>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-line pt-2">
                  <dt className="font-bold text-ink">Total</dt>
                  <dd className="font-display font-bold text-brand-700 tabular-nums">{pkr(result.total)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted">
                Fuel uses one-way {pkr(result.fuelOneWay)} (×2 for the return).{" "}
                {result.estimated
                  ? "Distance is an approximate straight-line estimate for this route; costs are estimates."
                  : "Distances & drive times are real road routes; costs are estimates."}
              </p>
              <a
                href={waLink(`Hi Dare2Gear! I want to plan a trip from ${result.from.name} to ${result.to.name} (${people} people, ${days} days). Estimated ${pkr(result.total)}. Can you help?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Get help with this trip
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
