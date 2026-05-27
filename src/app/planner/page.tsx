import type { Metadata } from "next";
import { PlannerForm } from "@/components/planner-form";
import { FuelPriceBar } from "@/components/fuel-prices";

export const metadata: Metadata = {
  title: "Trip Planner — Dare to Gear",
  description:
    "Enter your budget, group and vehicle to instantly see which Pakistani destinations you can afford, with a full fuel, hotel and food breakdown.",
};

export default function PlannerPage() {
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-brand-50 to-transparent" />
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Smart trip planner
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            What can your budget explore?
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Fill in the details below. We&apos;ll calculate fuel, stays and food, then
            rank the Pakistani destinations that fit your money and your days.
          </p>
        </div>

        <div className="mb-6">
          <FuelPriceBar />
        </div>

        <PlannerForm />
      </div>
    </div>
  );
}
