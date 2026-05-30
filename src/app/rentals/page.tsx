import type { Metadata } from "next";
import Link from "next/link";
import { RENTAL_CATEGORIES } from "@/lib/catalog";
import { waLink } from "@/lib/contact";
import {
  BikeIcon,
  ArrowRightIcon,
  WhatsAppIcon,
  CheckIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Rent a Bike & Gear — Coming Soon | Dare2Gear",
  description:
    "Soon: rent 150cc+ bikes, camping gear, fog lights, side bags and travel accessories for your northern Pakistan adventure — at affordable rates.",
};

export default function RentalsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-grid opacity-70" />
        <div className="absolute -right-40 -top-40 -z-10 h-96 w-96 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <BikeIcon className="h-3.5 w-3.5" />
            Coming soon
          </span>
          <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            Rent your ride &amp; gear,{" "}
            <span className="text-brand-600">trip-ready for the north.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            We&apos;re building an affordable rental service for northern Pakistan —
            bikes, camping kit, gadgets and accessories, delivered for your journey.
            Want early access or have a question?
          </p>
          <a
            href={waLink(
              "Hi Dare2Gear! I'd like early access / info about your bike & gear rentals.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-display text-base font-bold text-white transition-opacity hover:opacity-90"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Ask on WhatsApp
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2">
          {RENTAL_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/rentals/${c.slug}`}
              className="group relative flex flex-col rounded-2xl border border-line bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <span className="absolute right-5 top-5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                Soon
              </span>
              <h2 className="font-display text-lg font-bold text-ink">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.tagline}</p>
              <ul className="mt-4 space-y-2">
                {c.items.slice(0, 3).map((it) => (
                  <li key={it.name} className="flex items-center gap-2 text-sm text-ink">
                    <CheckIcon className="h-4 w-4 text-brand-600" />
                    {it.name}
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                View {c.navLabel.toLowerCase()}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-line bg-canvas p-8 text-center">
          <h3 className="font-display text-xl font-bold text-ink">
            Booking via Dare2Gear has perks
          </h3>
          <p className="max-w-md text-sm text-muted">
            When rentals launch, planning your trip with us will unlock discounts on
            rent, partner food bills and gear from our outlet. Plan a trip now and
            be first in line.
          </p>
          <Link
            href="/planner"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Plan my trip
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
