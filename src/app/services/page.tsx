import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/catalog";
import { CameraIcon, ArrowRightIcon, SparklesIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Services — Photographer, Expert Advice & Perks | Dare2Gear",
  description:
    "Dare2Gear services for your trip: bring a photographer for reels and shoots, get expert route advice, and unlock partner discounts on food, gear and rentals.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-grid opacity-70" />
        <div className="absolute -left-32 top-20 -z-10 h-80 w-80 rounded-full bg-brand-100 blur-3xl" />
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-brand-700">
            <SparklesIcon className="h-3.5 w-3.5" />
            Services
          </span>
          <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            More than a plan —{" "}
            <span className="text-brand-600">a better trip.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Add a photographer, get expert advice, and save with partner perks when
            you travel with Dare2Gear.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group relative flex flex-col rounded-2xl border border-line bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-slate-200/60"
            >
              {s.comingSoon && (
                <span className="absolute right-5 top-5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                  Soon
                </span>
              )}
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <CameraIcon className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-lg font-bold text-ink">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.tagline}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                Learn more
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
