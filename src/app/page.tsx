import Link from "next/link";
import { FuelPriceBar } from "@/components/fuel-prices";
import { ExploreCard } from "@/components/explore-card";
import { DESTINATIONS, isRestrictedDestination } from "@/lib/data";
import {
  ArrowRightIcon,
  WalletIcon,
  RouteIcon,
  SparklesIcon,
  FuelIcon,
  BedIcon,
  UtensilsIcon,
  MapPinIcon,
  CompassIcon,
  GaugeIcon,
  CheckIcon,
} from "@/components/icons";

const STEPS = [
  {
    icon: <WalletIcon className="h-6 w-6" />,
    title: "Tell us your budget",
    text: "Enter how much you have, your group size, days off, starting city and your ride.",
  },
  {
    icon: <GaugeIcon className="h-6 w-6" />,
    title: "We crunch the costs",
    text: "Fuel from real mileage, hotels by tier, food and a safety buffer — all calculated per destination.",
  },
  {
    icon: <CompassIcon className="h-6 w-6" />,
    title: "Get ranked trips",
    text: "See exactly where you can afford to go, how far it is, and how much you'll have left over.",
  },
];

const VALUE_PROPS = [
  { icon: <FuelIcon className="h-5 w-5" />, label: "Fuel by real mileage" },
  { icon: <BedIcon className="h-5 w-5" />, label: "Cheap to luxury stays" },
  { icon: <UtensilsIcon className="h-5 w-5" />, label: "Food estimates" },
  { icon: <RouteIcon className="h-5 w-5" />, label: "Distance & drive time" },
];

export default function Home() {
  const featured = ["hunza", "skardu", "naran", "fairymeadows", "swat", "neelum"]
    .map((id) => DESTINATIONS.find((d) => d.id === id)!)
    .filter((d) => d && !isRestrictedDestination(d));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-grid opacity-70" />
        <div className="absolute -right-40 -top-40 -z-10 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
        <div className="absolute -left-32 top-40 -z-10 h-80 w-80 rounded-full bg-amber-100/60 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-brand-700">
              <SparklesIcon className="h-3.5 w-3.5" />
              Smart travel budget planner for Pakistan
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              Tell us your budget and vehicle.<br />
              We&apos;ll tell you{" "}
              <span className="text-brand-600">how far you can go.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Dare2Gear turns the cash in your pocket into a real trip plan —
              fuel, hotels and food all worked out for you. Province to province
              or city to city, a quick day trip or a long northern adventure,
              it tells you exactly where in Pakistan your money can take you —
              Whatever&apos;s in your pocket, we&apos;ll turn it into a trip.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/planner"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 font-display text-base font-bold text-white transition-colors hover:bg-brand-700"
              >
                Plan my trip free
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                href="/#how"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface px-6 py-3.5 font-display text-base font-semibold text-ink transition-colors hover:border-brand-300"
              >
                See how it works
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {VALUE_PROPS.map((v) => (
                <li key={v.label} className="flex items-center gap-2 text-sm font-medium text-muted">
                  <span className="text-brand-600">{v.icon}</span>
                  {v.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Sample trip card */}
          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="relative mx-auto max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Sample plan
                </p>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                  Within budget
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-ink">Rs 50k</span>
                <span className="text-sm text-muted">· 2 people · 4 days · car</span>
              </div>

              <div className="mt-5 rounded-xl bg-canvas p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <MapPinIcon className="h-4 w-4 text-brand-600" />
                  Lahore → Naran &amp; Kaghan
                </div>
                <dl className="mt-3 space-y-2 text-sm">
                  {[
                    ["Fuel", "Rs 9,800"],
                    ["Hotels (3 nights)", "Rs 20,700"],
                    ["Food", "Rs 11,000"],
                    ["Tolls & buffer", "Rs 6,200"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <dt className="text-muted">{k}</dt>
                      <dd className="font-semibold text-ink tabular-nums">{v}</dd>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-line pt-2">
                    <dt className="font-bold text-ink">Total</dt>
                    <dd className="font-display font-bold text-brand-700 tabular-nums">Rs 47,700</dd>
                  </div>
                </dl>
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-700">
                <CheckIcon className="h-4 w-4" />
                You can do a 4-day Naran trip — Rs 2,300 to spare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live fuel prices */}
      <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
        <FuelPriceBar />
      </div>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-20 pt-12 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            How it works
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            From your wallet to the road in three steps
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-line bg-surface p-7"
            >
              <span className="absolute right-6 top-6 font-display text-5xl font-extrabold text-slate-100">
                {i + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                {step.icon}
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured destinations */}
      <section id="destinations" className="scroll-mt-20 border-y border-line bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                Where you could go
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
                Pakistan&apos;s north, sorted by budget
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">
                From easy weekend hill stations to full Karakoram expeditions —
                the planner matches each to what you can actually afford.
              </p>
            </div>
            <Link
              href="/destinations"
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand-300"
            >
              Explore all destinations
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d) => (
              <ExploreCard key={d.id} d={d} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center sm:px-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Got cash and a few free days?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              Stop guessing what you can afford. Let Dare2Gear plan your next
              Pakistani adventure down to the last rupee.
            </p>
            <Link
              href="/planner"
              className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 font-display text-base font-bold text-white transition-colors hover:bg-brand-400"
            >
              Start planning — it&apos;s free
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
