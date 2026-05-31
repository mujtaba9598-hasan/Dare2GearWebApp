import Link from "next/link";
import type { Destination } from "@/lib/data";
import { BUDGET_TIER_LABELS } from "@/lib/data";
import { CONTENT } from "@/lib/content";
import { destHero } from "@/lib/photos";
import { MapPinIcon, ArrowRightIcon } from "./icons";

const tierStyle: Record<string, string> = {
  low: "bg-brand-50 text-brand-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-violet-50 text-violet-700",
};

export function ExploreCard({ d }: { d: Destination }) {
  const content = CONTENT[d.id];
  const hero = destHero(d.id) ?? content?.hero ?? "/scenery/s01.jpg";

  return (
    <Link
      href={`/destinations/${d.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-slate-200/60"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero}
          alt={d.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${tierStyle[d.tier]}`}
        >
          {BUDGET_TIER_LABELS[d.tier]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-ink">{d.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
          <MapPinIcon className="h-3.5 w-3.5" />
          {d.region}
        </p>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {content?.tagline ?? d.blurb}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
          Explore guide
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
