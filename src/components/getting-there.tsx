"use client";

import { useEffect, useMemo, useState } from "react";
import type { Destination } from "@/lib/data";
import { ORIGINS } from "@/lib/data";
import {
  roadDistanceKm,
  roadMinutesBetween,
  getOrigin,
  defaultRouteForMonth,
  hasBabusarOption,
  type RouteChoice,
} from "@/lib/planner";
import { CorridorToggle } from "./corridor-toggle";
import {
  tollEstimate,
  bikeRouteNote,
  bikeCcGuidance,
  TRAVEL_DOCUMENTS,
  permitNote,
  googleMapsDirLink,
  weatherApiUrl,
  weatherInfo,
} from "@/lib/route-info";
import { waLink, mailLink } from "@/lib/contact";
import { km, pkr } from "@/lib/format";
import {
  RouteIcon,
  ClockIcon,
  MapPinIcon,
  BikeIcon,
  WalletIcon,
  CheckIcon,
  AlertIcon,
  WhatsAppIcon,
  MailIcon,
  ArrowRightIcon,
} from "./icons";

const SPEED: Record<string, number> = { highway: 55, mixed: 42, rough: 32 };

interface DayForecast {
  code: number;
  max: number;
  min: number;
}
interface Weather {
  temp: number;
  code: number;
  wind: number;
  days: { date: string; f: DayForecast }[];
}

const ORIGINS_SORTED = [...ORIGINS].sort((a, b) => a.name.localeCompare(b.name));

function Card({
  icon,
  title,
  children,
  tone = "default",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  tone?: "default" | "amber";
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        tone === "amber" ? "border-amber-200 bg-amber-50/50" : "border-line bg-surface"
      }`}
    >
      <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink">
        <span className="text-brand-600">{icon}</span>
        {title}
      </h3>
      <div className="mt-3 text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}

export function GettingThere({ destination }: { destination: Destination }) {
  const [originId, setOriginId] = useState("islamabad");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherErr, setWeatherErr] = useState(false);
  const [roadState, setRoadState] = useState<"idle" | "loading" | "ready">("idle");
  const [route, setRoute] = useState<RouteChoice>(() => defaultRouteForMonth(new Date().getMonth()));

  const origin = getOrigin(originId);
  const showCorridor = hasBabusarOption(destination.id);
  const distance = useMemo(
    () => roadDistanceKm(origin, destination, route),
    [origin, destination, route],
  );
  const driveHours = useMemo(() => {
    const min = roadMinutesBetween(origin, destination, route);
    return min > 0 ? Math.round((min / 60) * 10) / 10 : Math.round((distance / SPEED[destination.terrain]) * 10) / 10;
  }, [origin, destination, route, distance]);
  const toll = tollEstimate(distance);
  const cc = bikeCcGuidance(destination);
  const permit = permitNote(destination);
  const mapsLink = googleMapsDirLink(origin, destination);

  // Live weather (Open-Meteo, no key) — depends only on the destination.
  useEffect(() => {
    let cancelled = false;
    fetch(weatherApiUrl(destination.lat, destination.lng))
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const days = (d.daily?.time ?? []).map((date: string, i: number) => ({
          date,
          f: {
            code: d.daily.weather_code[i],
            max: Math.round(d.daily.temperature_2m_max[i]),
            min: Math.round(d.daily.temperature_2m_min[i]),
          },
        }));
        setWeather({
          temp: Math.round(d.current?.temperature_2m ?? 0),
          code: d.current?.weather_code ?? 0,
          wind: Math.round(d.current?.wind_speed_10m ?? 0),
          days,
        });
      })
      .catch(() => !cancelled && setWeatherErr(true));
    return () => {
      cancelled = true;
    };
  }, [destination.lat, destination.lng]);

  function requestRoad() {
    setRoadState("loading");
    window.setTimeout(() => setRoadState("ready"), 1400);
  }

  const roadMsg = `Hi Dare2Gear! What are the current road conditions from ${origin.name} to ${destination.name}? (snow/landslides/closures)`;
  const now = weather ? weatherInfo(weather.code) : null;
  const dayLabel = (date: string, i: number) =>
    i === 0 ? "Today" : new Date(date).toLocaleDateString("en-US", { weekday: "short" });

  return (
    <section className="mt-12">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Getting to {destination.name}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Route, weather, tolls and what to carry — pick your starting city.
        </p>
      </div>

      {/* Origin picker — sits above the route cards */}
      <label className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <span className="text-sm font-medium text-muted">Travelling from</span>
        <select
          value={originId}
          onChange={(e) => setOriginId(e.target.value)}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none sm:w-64"
        >
          {ORIGINS_SORTED.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </label>

      {showCorridor && (
        <div className="mt-4">
          <CorridorToggle route={route} onChange={setRoute} />
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Route + map */}
        <Card icon={<RouteIcon className="h-5 w-5" />} title="Route">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4 text-brand-600" />
              <strong className="text-ink">{origin.name}</strong> → {destination.name}
            </span>
            <span className="flex items-center gap-1.5">
              <RouteIcon className="h-4 w-4" /> {km(distance)} one-way
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" /> ~{driveHours}h driving
            </span>
          </div>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Open route in Google Maps
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </Card>

        {/* Weather */}
        <Card icon={<span className="text-lg">{now?.icon ?? "🌡️"}</span>} title="Weather">
          {weatherErr ? (
            <p>Couldn&apos;t load live weather right now — please check again later.</p>
          ) : !weather ? (
            <p className="animate-pulse">Loading live weather…</p>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-ink">{weather.temp}°C</span>
                <span>{now?.label}</span>
                <span className="text-xs">· wind {weather.wind} km/h</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {weather.days.map((d, i) => {
                  const wi = weatherInfo(d.f.code);
                  return (
                    <div key={d.date} className="rounded-lg bg-canvas p-2 text-center">
                      <p className="text-xs font-semibold text-ink">{dayLabel(d.date, i)}</p>
                      <p className="text-lg">{wi.icon}</p>
                      <p className="text-xs text-ink">
                        {d.f.max}° <span className="text-muted">/ {d.f.min}°</span>
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted">Live · Open-Meteo</p>
            </>
          )}
        </Card>

        {/* On a bike */}
        <Card icon={<BikeIcon className="h-5 w-5" />} title="On a bike?">
          <p>{bikeRouteNote()}</p>
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-canvas p-3">
            <span
              className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                cc.level === "150"
                  ? "bg-red-100 text-red-700"
                  : cc.level === "125"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-brand-100 text-brand-700"
              }`}
            >
              {cc.level === "any" ? "Any cc" : `${cc.level}cc+`}
            </span>
            <p className="text-ink">{cc.text}</p>
          </div>
        </Card>

        {/* Tolls */}
        <Card icon={<WalletIcon className="h-5 w-5" />} title="Toll estimate (rough)">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-canvas p-3">
              <p className="text-xs text-muted">Motorway (car/SUV)</p>
              <p className="font-display text-lg font-bold text-ink">~{pkr(toll.motorway)}</p>
              <p className="mt-1 text-xs text-muted">round trip, plains sections</p>
            </div>
            <div className="rounded-lg bg-canvas p-3">
              <p className="text-xs text-muted">GT Road / bikes</p>
              <p className="font-display text-lg font-bold text-ink">Minimal</p>
              <p className="mt-1 text-xs text-muted">{toll.gtRoadNote}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted">
            Rough estimate only. Bikes must use the GT Road (no motorways).
          </p>
        </Card>

        {/* Documents */}
        <Card icon={<CheckIcon className="h-5 w-5" />} title="Documents to carry">
          <ul className="space-y-1.5">
            {TRAVEL_DOCUMENTS.map((d) => (
              <li key={d} className="flex items-start gap-2 text-ink">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                {d}
              </li>
            ))}
          </ul>
          {permit && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              {permit}
            </p>
          )}
        </Card>

        {/* Road conditions — manual fulfillment */}
        <Card icon={<AlertIcon className="h-5 w-5" />} title="Live road conditions" tone="amber">
          {roadState === "idle" && (
            <>
              <p>
                Snow, landslides or closures can change fast. We check the latest
                conditions for your route manually and get back to you.
              </p>
              <button
                type="button"
                onClick={requestRoad}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Check {origin.name} → {destination.name}
              </button>
            </>
          )}
          {roadState === "loading" && (
            <div className="flex items-center gap-3 py-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-amber-300 border-t-amber-600" />
              <p>Checking the latest reports for this route…</p>
            </div>
          )}
          {roadState === "ready" && (
            <>
              <p className="text-ink">
                We confirm road conditions personally so the info is current. Tap below
                and we&apos;ll send you the latest for{" "}
                <strong>{origin.name} → {destination.name}</strong> right away.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={waLink(roadMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Get it on WhatsApp
                </a>
                <a
                  href={mailLink(`Road conditions — ${origin.name} to ${destination.name}`, roadMsg)}
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand-300"
                >
                  <MailIcon className="h-4 w-4 text-brand-600" />
                  Email
                </a>
              </div>
            </>
          )}
        </Card>
      </div>
    </section>
  );
}
