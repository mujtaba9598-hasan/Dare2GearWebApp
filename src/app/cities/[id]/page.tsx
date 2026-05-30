import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ORIGINS } from "@/lib/data";
import { cityPlaces, CITY_PLACE_LABELS } from "@/lib/city-attractions";
import {
  MapPinIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CompassIcon,
} from "@/components/icons";

export function generateStaticParams() {
  return ORIGINS.map((o) => ({ id: o.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const city = ORIGINS.find((o) => o.id === id);
  if (!city) return { title: "City — Dare2Gear" };
  return {
    title: `Things to see in ${city.name} | Dare2Gear`,
    description: `The best places worth seeing in and around ${city.name}, ${city.province} — forts, shrines, parks, lakes, museums and more.`,
  };
}

export default async function CityDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const city = ORIGINS.find((o) => o.id === id);
  if (!city) notFound();

  const places = cityPlaces(id);

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-grid opacity-70" />
        <div className="absolute -right-40 -top-40 -z-10 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <Link
            href="/cities"
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            All cities
          </Link>
          <h1 className="font-display text-4xl font-extrabold text-ink sm:text-5xl">
            Things to see in {city.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-muted">
            <MapPinIcon className="h-4 w-4 text-brand-600" />
            {city.province}
          </p>
          <Link
            href="/planner"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 font-display text-base font-bold text-white transition-colors hover:bg-brand-700"
          >
            Plan a trip from {city.name}
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        {places.length > 0 ? (
          <>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Worth seeing in &amp; around {city.name}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((p) => (
                <article
                  key={p.name}
                  className="flex flex-col rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-md hover:shadow-slate-200/60"
                >
                  <span className="w-fit rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                    {CITY_PLACE_LABELS[p.category]}
                  </span>
                  <h3 className="mt-2 font-display text-base font-bold text-ink">{p.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.note}</p>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-canvas p-10 text-center">
            <CompassIcon className="h-8 w-8 text-brand-600" />
            <p className="max-w-md text-sm text-muted">
              We&apos;re still gathering the best spots in {city.name}. In the
              meantime, plan your trip and explore where you can go from here.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
