import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DESTINATIONS, BUDGET_TIER_LABELS } from "@/lib/data";
import {
  CONTENT,
  SPOT_LABELS,
  SKILL_LABELS,
  hotelsFor,
  enRouteFor,
} from "@/lib/content";
import { HotelCard } from "@/components/hotel-card";
import { GettingThere } from "@/components/getting-there";
import {
  MapPinIcon,
  CalendarIcon,
  RouteIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ShieldAlertIcon,
  BikeIcon,
  CompassIcon,
} from "@/components/icons";

const tierStyle: Record<string, string> = {
  low: "bg-brand-50 text-brand-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-violet-50 text-violet-700",
};

const terrainLabel: Record<string, string> = {
  highway: "Mostly paved highways",
  mixed: "Mixed — paved with rough stretches",
  rough: "Rough mountain roads",
};

const skillStyle: Record<string, string> = {
  intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  advanced: "bg-orange-50 text-orange-700 border-orange-200",
  expert: "bg-red-50 text-red-700 border-red-200",
};

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const d = DESTINATIONS.find((x) => x.id === id);
  if (!d) return { title: "Destination not found — Dare2Gear" };
  return {
    title: `${d.name} travel guide — spots, tracks & stays | Dare2Gear`,
    description: `${d.blurb} See the best spots, dangerous tracks, best season and affordable places to stay in ${d.name}, ${d.region}.`,
  };
}

export default async function DestinationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = DESTINATIONS.find((x) => x.id === id);
  const content = CONTENT[id];
  if (!d || !content) notFound();

  const hotels = hotelsFor(id);
  const enRoute = enRouteFor(id);

  return (
    <>
      {/* Hero banner */}
      <section className="relative h-[44vh] min-h-[320px] w-full overflow-hidden sm:h-[52vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.hero}
          alt={d.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-8 sm:px-8 sm:pb-10">
          <Link
            href="/destinations"
            className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            All destinations
          </Link>
          <span
            className={`mb-3 w-fit rounded-full px-3 py-1 text-xs font-semibold ${tierStyle[d.tier]}`}
          >
            {BUDGET_TIER_LABELS[d.tier]}
          </span>
          <h1 className="font-display text-4xl font-extrabold text-white drop-shadow-sm sm:text-5xl">
            {d.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-white/90">
            <MapPinIcon className="h-4 w-4" />
            {d.region}
          </p>
          <p className="mt-2 max-w-2xl text-lg text-white/90">{content.tagline}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {/* Quick facts + CTA */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Fact icon={<CalendarIcon className="h-5 w-5" />} label="Best season" value={d.bestMonths} />
          <Fact icon={<RouteIcon className="h-5 w-5" />} label="Roads" value={terrainLabel[d.terrain]} />
          <Fact icon={<CompassIcon className="h-5 w-5" />} label="Scenic score" value={`${d.scenicScore}/100`} />
          <Link
            href="/planner"
            className="group flex items-center justify-between gap-2 rounded-xl bg-brand-600 px-5 py-4 text-white transition-colors hover:bg-brand-700"
          >
            <span className="font-display text-sm font-bold leading-tight">
              Plan a trip<br />here
            </span>
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">{d.blurb}</p>

        {/* Spots */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Things to see in {d.name}
          </h2>
          <p className="mt-1 text-sm text-muted">
            The famous sights plus a few lesser-known gems worth the detour.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.spots.map((s) => (
              <article
                key={s.name}
                className="flex flex-col rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-md hover:shadow-slate-200/60"
              >
                <span className="w-fit rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                  {SPOT_LABELS[s.category]}
                </span>
                <h3 className="mt-2 font-display text-base font-bold text-ink">{s.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.blurb}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Photo strip */}
        {content.gallery.length > 0 && (
          <section className="mt-12">
            <div className="grid gap-3 sm:grid-cols-3">
              {content.gallery.map((src, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${d.name} scenery ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dangerous tracks */}
        {content.tracks && content.tracks.length > 0 && (
          <section className="mt-12">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ink sm:text-3xl">
              <ShieldAlertIcon className="h-7 w-7 text-red-500" />
              Dangerous tracks
            </h2>
            <p className="mt-1 text-sm text-muted">
              Off-road routes that demand the right machine and real riding skill.
            </p>
            <div className="mt-6 space-y-4">
              {content.tracks.map((t) => (
                <article
                  key={t.name}
                  className="rounded-2xl border border-red-200 bg-red-50/50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-bold text-ink">{t.name}</h3>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${skillStyle[t.skill]}`}
                    >
                      {SKILL_LABELS[t.skill]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{t.blurb}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-2 rounded-xl bg-white/70 p-3">
                      <BikeIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                      <div>
                        <p className="text-xs font-semibold text-muted">Recommended ride</p>
                        <p className="text-sm font-medium text-ink">{t.bikeNeeded}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 rounded-xl bg-white/70 p-3">
                      <ShieldAlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                      <div>
                        <p className="text-xs font-semibold text-muted">Heads up</p>
                        <p className="text-sm font-medium text-ink">{t.warning}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* On the way — en-route stops (Pillar 2) */}
        {enRoute.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              On the way there
            </h2>
            <p className="mt-1 text-sm text-muted">
              The classic approach — towns you pass and good places to stop.
            </p>
            <ol className="relative mt-6 space-y-5 border-l-2 border-line pl-6">
              {enRoute.map((s, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.95rem] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-600 ring-4 ring-surface" />
                  <h3 className="font-display text-base font-bold text-ink">{s.name}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{s.note}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Getting there — route, weather, tolls, docs (Pillar 2) */}
        <GettingThere destination={d} />

        {/* Hotels */}
        {hotels.length > 0 && (
          <section className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  Where to stay
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Affordable, locally-run stays in {d.name}. Tap to inquire — we&apos;ll
                  confirm availability for you.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((h) => (
                <HotelCard key={h.id} hotel={h} destinationName={d.name} />
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              Listings are samples for now — we&apos;re onboarding local hotels &amp;
              guesthouses.{" "}
              <Link href="/list-your-property" className="font-semibold text-brand-700 hover:underline">
                List your property →
              </Link>
            </p>
          </section>
        )}

        {/* Rentals coming soon */}
        <section className="mt-12 overflow-hidden rounded-3xl bg-ink px-6 py-10 sm:px-12">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
                <BikeIcon className="h-3.5 w-3.5" />
                Coming soon
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-white">
                Rent a bike &amp; gear for {d.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Soon you&apos;ll be able to rent 150cc+ bikes, camping kit, fog lights
                and side bags for your trip — at affordable rates, delivered for the north.
              </p>
            </div>
            <Link
              href="/rentals"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 font-display text-sm font-bold text-white transition-colors hover:bg-brand-400"
            >
              See what&apos;s coming
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="font-display text-sm font-bold leading-tight text-ink">{value}</p>
      </div>
    </div>
  );
}
