import type { Metadata } from "next";
import Link from "next/link";
import { ORIGINS } from "@/lib/data";
import { cityPlaces } from "@/lib/city-attractions";
import { MapPinIcon, ArrowRightIcon, CompassIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Starting Cities — What to See | Dare2Gear",
  description:
    "Every city you can start your trip from — and the best places worth seeing in each, from forts and shrines to lakes, parks and bazaars across Pakistan.",
};

const PROVINCE_ORDER = [
  "Capital",
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Azad Kashmir",
];

export default function CitiesPage() {
  const byProvince = PROVINCE_ORDER.map((prov) => ({
    province: prov,
    cities: ORIGINS.filter((o) => o.province === prov).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  })).filter((g) => g.cities.length > 0);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-grid opacity-70" />
        <div className="absolute -right-40 -top-40 -z-10 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-brand-700">
            <CompassIcon className="h-3.5 w-3.5" />
            Starting cities
          </span>
          <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            Every city has something{" "}
            <span className="text-brand-600">worth seeing.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Wherever you set off from, here are the forts, shrines, lakes, parks
            and bazaars worth a stop in your own city before you hit the road.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        {byProvince.map((group) => (
          <section key={group.province} className="mb-12 last:mb-0">
            <h2 className="font-display text-xl font-bold text-ink">{group.province}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.cities.map((c) => {
                const count = cityPlaces(c.id).length;
                return (
                  <Link
                    key={c.id}
                    href={`/cities/${c.id}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md hover:shadow-slate-200/60"
                  >
                    <div>
                      <h3 className="flex items-center gap-1.5 font-display text-base font-bold text-ink">
                        <MapPinIcon className="h-4 w-4 text-brand-600" />
                        {c.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted">
                        {count} {count === 1 ? "place" : "places"} to see
                      </p>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-brand-600 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
