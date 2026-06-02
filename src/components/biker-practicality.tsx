"use client";

import { useState } from "react";
import type { Destination } from "@/lib/data";
import {
  bikerPracticality,
  routeAccess,
  assessVehicle,
  recommendedVehicle,
  parkingMapsLink,
  type BikerSignal,
  type SignalLevel,
  type VehicleKind,
  type BikeCc,
} from "@/lib/biker";
import {
  RouteIcon,
  ShieldAlertIcon,
  MountainIcon,
  CompassIcon,
  FuelIcon,
  PhoneIcon,
  GaugeIcon,
  BikeIcon,
  AlertIcon,
  ClockIcon,
  MapPinIcon,
  CarIcon,
  CheckIcon,
  ArrowRightIcon,
} from "./icons";

const SIGNAL_ICON: Record<BikerSignal["key"], React.ReactNode> = {
  road: <RouteIcon className="h-5 w-5" />,
  danger: <ShieldAlertIcon className="h-5 w-5" />,
  climbs: <MountainIcon className="h-5 w-5" />,
  offroad: <CompassIcon className="h-5 w-5" />,
  fuel: <FuelIcon className="h-5 w-5" />,
  network: <PhoneIcon className="h-5 w-5" />,
  mechanic: <GaugeIcon className="h-5 w-5" />,
  puncture: <BikeIcon className="h-5 w-5" />,
  weather: <AlertIcon className="h-5 w-5" />,
  fatigue: <ClockIcon className="h-5 w-5" />,
  rest: <MapPinIcon className="h-5 w-5" />,
};

const LEVEL_BADGE: Record<SignalLevel, string> = {
  good: "bg-brand-100 text-brand-700",
  moderate: "bg-amber-100 text-amber-700",
  warn: "bg-red-100 text-red-700",
};

const LEVEL_TEXT: Record<SignalLevel, string> = {
  good: "text-brand-700",
  moderate: "text-amber-700",
  warn: "text-red-600",
};

const LEVEL_BAR: Record<SignalLevel, string> = {
  good: "bg-brand-500",
  moderate: "bg-amber-500",
  warn: "bg-red-500",
};

const CC_OPTIONS: BikeCc[] = [70, 100, 125, 150, 250];
const KINDS: { value: VehicleKind; label: string; icon: React.ReactNode }[] = [
  { value: "bike", label: "Bike", icon: <BikeIcon className="h-4 w-4" /> },
  { value: "car", label: "Car", icon: <CarIcon className="h-4 w-4" /> },
  { value: "suv", label: "SUV / 4x4", icon: <CarIcon className="h-4 w-4" /> },
];

function Toggle({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        on
          ? "border-brand-500 bg-brand-50 text-brand-700"
          : "border-line text-muted hover:border-brand-300 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function BikerPracticality({ destination }: { destination: Destination }) {
  const d = destination;
  const signals = bikerPracticality(d);
  const access = routeAccess(d);

  const rec = recommendedVehicle(d);

  const [kind, setKind] = useState<VehicleKind>("bike");
  const [cc, setCc] = useState<BikeCc>(125);
  const [pillion, setPillion] = useState(false);
  const [luggage, setLuggage] = useState(false);

  const verdict = assessVehicle(d, {
    kind,
    cc: kind === "bike" ? cc : undefined,
    pillion,
    luggage,
  });

  return (
    <section className="mt-12">
      <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ink sm:text-3xl">
        <BikeIcon className="h-7 w-7 text-brand-600" />
        Route practicality &amp; vehicle fit
      </h2>
      <p className="mt-1 text-sm text-muted">
        How hard is the trip to {d.name}, and is your vehicle up to it? Pick your
        ride to get a suitability score and a smart recommendation.
      </p>

      {/* Vehicle recommendation engine */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto]">
          {/* Inputs */}
          <div>
            <p className="text-sm font-semibold text-ink">Your vehicle</p>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:max-w-md">
              {KINDS.map((k) => (
                <button
                  key={k.value}
                  type="button"
                  onClick={() => setKind(k.value)}
                  className={`relative flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                    kind === k.value
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-line text-muted hover:border-brand-300 hover:text-ink"
                  }`}
                >
                  {k.value === rec.kind && (
                    <span className="absolute -top-2 right-1 rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
                      Best
                    </span>
                  )}
                  {k.icon}
                  {k.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              Recommended for this route:{" "}
              <span className="font-semibold text-brand-700">
                {rec.kind === "suv"
                  ? "SUV / 4x4"
                  : rec.kind === "car"
                    ? "Car"
                    : "Bike"}
              </span>
              {" "}· bikes {rec.cc === 250 ? "250cc+" : `${rec.cc}cc+`}
            </p>

            {kind === "bike" && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-ink">Engine size</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CC_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCc(c)}
                      className={`relative cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-semibold tabular-nums transition-colors ${
                        cc === c
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-line text-muted hover:border-brand-300 hover:text-ink"
                      }`}
                    >
                      {c === rec.cc && (
                        <span className="absolute -top-2 -right-1 rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
                          Best
                        </span>
                      )}
                      {c === 250 ? "250cc+" : `${c}cc`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm font-semibold text-ink">Carrying</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Toggle on={pillion} onClick={() => setPillion((v) => !v)}>
                  + Pillion
                </Toggle>
                <Toggle on={luggage} onClick={() => setLuggage((v) => !v)}>
                  + Luggage
                </Toggle>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="flex min-w-[12rem] flex-col items-center justify-center rounded-2xl bg-canvas p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Suitability
            </p>
            <p className={`mt-1 font-display text-5xl font-extrabold tabular-nums ${LEVEL_TEXT[verdict.level]}`}>
              {verdict.score}%
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line">
              <div
                className={`h-full rounded-full transition-all ${LEVEL_BAR[verdict.level]}`}
                style={{ width: `${verdict.score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Verdict, warnings & recommendation */}
        <div
          className={`border-t p-5 sm:p-6 ${
            verdict.level === "warn"
              ? "border-red-100 bg-red-50/40"
              : verdict.level === "moderate"
                ? "border-amber-100 bg-amber-50/40"
                : "border-brand-100 bg-brand-50/40"
          }`}
        >
          <p className="flex items-center gap-2 font-display text-base font-bold text-ink">
            {verdict.level === "good" ? (
              <CheckIcon className="h-5 w-5 text-brand-600" />
            ) : (
              <AlertIcon className={`h-5 w-5 ${LEVEL_TEXT[verdict.level]}`} />
            )}
            {verdict.headline}
          </p>

          {verdict.warnings.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {verdict.warnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <ShieldAlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  {w}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 rounded-xl border border-line bg-surface p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700">
              <CompassIcon className="h-4 w-4" />
              Recommendation
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">{verdict.recommendation}</p>

            {verdict.suggestJeep && access.lastSafeParking && (
              <a
                href={parkingMapsLink(access.lastSafeParking)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                <MapPinIcon className="h-4 w-4" />
                Last safe parking: {access.lastSafeParking}
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            )}
          </div>

          {access.seasonal && (
            <p className="mt-3 flex items-start gap-2 text-xs text-amber-800">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              {access.seasonal}
            </p>
          )}
          {verdict.suggestJeep && (
            <p className="mt-2 text-xs text-muted">
              We don&apos;t quote jeep fares — they aren&apos;t fixed. Agree the rate
              with the driver on the spot before you set off.
            </p>
          )}
        </div>
      </div>

      {/* 11 readiness signals */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {signals.map((s) => (
          <div key={s.key} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="text-brand-600">{SIGNAL_ICON[s.key]}</span>
                {s.label}
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${LEVEL_BADGE[s.level]}`}
              >
                {s.value}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
