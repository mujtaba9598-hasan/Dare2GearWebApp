import type { Metadata } from "next";
import Link from "next/link";
import { DESTINATIONS, isRestrictedDestination } from "@/lib/data";
import { ExploreCard } from "@/components/explore-card";
import { ArrowRightIcon, CompassIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Explore Destinations — Dare2Gear",
  description:
    "Browse Pakistan's northern destinations — Hunza, Skardu, Swat, Naran, Fairy Meadows and more. See the best spots, dangerous tracks and affordable stays for each.",
};

const TIER_ORDER = ["low", "medium", "high"] as const;
const TIER_HEADINGS: Record<string, { title: string; sub: string }> = {
  low: {
    title: "Easy escapes",
    sub: "Weekend-friendly hill stations and valleys, light on the wallet.",
  },
  medium: {
    title: "The classic north",
    sub: "Iconic Gilgit-Baltistan and Chitral — a few days and a real road trip.",
  },
  high: {
    title: "Expeditions",
    sub: "Remote, high-altitude adventures for when you've got the time and the budget.",
  },
};

export default function DestinationsPage() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-grid opacity-70" />
        <div className="absolute -right-40 -top-40 -z-10 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-brand-700">
            <CompassIcon className="h-3.5 w-3.5" />
            Explore Pakistan
          </span>
          <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            Where will you{" "}
            <span className="text-brand-600">dare to go?</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Discover the best spots, hidden valleys, dangerous tracks and
            affordable stays across Pakistan&apos;s north — then plan the trip
            down to the last rupee.
          </p>
          <Link
            href="/planner"
            className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 font-display text-base font-bold text-white transition-colors hover:bg-brand-700"
          >
            Plan my trip
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Grouped destinations */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        {TIER_ORDER.map((tier) => {
          const items = DESTINATIONS.filter(
            (d) => d.tier === tier && !isRestrictedDestination(d),
          ).sort((a, b) => b.scenicScore - a.scenicScore);
          if (items.length === 0) return null;
          const heading = TIER_HEADINGS[tier];
          return (
            <section key={tier} className="mb-16 last:mb-0">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  {heading.title}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  {heading.sub}
                </p>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((d) => (
                  <ExploreCard key={d.id} d={d} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
