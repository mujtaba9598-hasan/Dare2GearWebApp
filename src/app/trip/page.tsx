import type { Metadata } from "next";
import { TripPlanner } from "@/components/trip-planner";
import { RouteIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Plan a Specific Trip (any city to any place) | Dare2Gear",
  description:
    "Plan a trip between any two places in Pakistan — city to city, north to south, anywhere. Get the real road distance, drive time, fuel, stay, food and total cost.",
};

export default function TripPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-grid opacity-70" />
        <div className="absolute -right-40 -top-40 -z-10 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-brand-700">
            <RouteIcon className="h-3.5 w-3.5" />
            Custom Trip Planner
          </span>
          <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            Any place to any place.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            Going from Hunza to Karachi, Lahore to Skardu, or city to city? Pick your
            start and end and get the <strong>real road distance</strong>, drive time,
            fuel, stay, food and total cost.
          </p>
          <p className="mt-2 text-sm text-muted">
            Just want ideas for a budget instead?{" "}
            <a href="/planner" className="font-semibold text-brand-700 hover:underline">
              Try the &quot;where can I go?&quot; planner →
            </a>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
        <TripPlanner />
      </div>
    </>
  );
}
