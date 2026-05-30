import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RENTAL_CATEGORIES, rentalCategory } from "@/lib/catalog";
import { waLink, mailLink } from "@/lib/contact";
import {
  BikeIcon,
  CheckIcon,
  WhatsAppIcon,
  MailIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@/components/icons";

export function generateStaticParams() {
  return RENTAL_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = rentalCategory(category);
  if (!c) return { title: "Rentals — Dare2Gear" };
  return {
    title: `${c.title} — Coming Soon | Dare2Gear`,
    description: c.intro,
  };
}

export default async function RentalCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = rentalCategory(category);
  if (!c) notFound();

  const subject = `Rental inquiry — ${c.title}`;
  const msg = `Hi Dare2Gear! I'm interested in your ${c.title.toLowerCase()}. Please share availability and rates.`;

  const others = RENTAL_CATEGORIES.filter((x) => x.slug !== c.slug);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-grid opacity-70" />
        <div className="absolute -right-40 -top-40 -z-10 h-96 w-96 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <Link
            href="/rentals"
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            All rentals &amp; gear
          </Link>
          {c.comingSoon && (
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <BikeIcon className="h-3.5 w-3.5" />
                Coming soon
              </span>
            </div>
          )}
          <h1 className="mt-4 max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            {c.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{c.intro}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={waLink(msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-display text-base font-bold text-white transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Ask on WhatsApp
            </a>
            <a
              href={mailLink(subject, msg)}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-6 py-3.5 font-display text-base font-semibold text-ink transition-colors hover:border-brand-300"
            >
              <MailIcon className="h-5 w-5 text-brand-600" />
              Email us
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">What you can rent</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {c.items.map((item) => (
            <article
              key={item.name}
              className="relative flex flex-col rounded-2xl border border-line bg-surface p-6"
            >
              {c.comingSoon && (
                <span className="absolute right-5 top-5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                  Soon
                </span>
              )}
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <CheckIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{item.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.desc}</p>
            </article>
          ))}
        </div>

        {/* Other categories */}
        <div className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-xl font-bold text-ink">Explore other gear</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/rentals/${o.slug}`}
                className="group flex items-center justify-between gap-2 rounded-xl border border-line bg-surface px-5 py-4 transition-colors hover:border-brand-300"
              >
                <span className="font-display text-sm font-semibold text-ink">{o.navLabel}</span>
                <ArrowRightIcon className="h-4 w-4 text-brand-600 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
