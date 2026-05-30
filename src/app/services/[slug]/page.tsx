import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, service } from "@/lib/catalog";
import { waLink, mailLink } from "@/lib/contact";
import {
  CheckIcon,
  WhatsAppIcon,
  MailIcon,
  AlertIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@/components/icons";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = service(slug);
  if (!s) return { title: "Services — Dare2Gear" };
  return { title: `${s.title} — Dare2Gear`, description: s.intro };
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = service(slug);
  if (!s) notFound();

  const subject = `Service inquiry — ${s.title}`;
  const msg = `Hi Dare2Gear! I'm interested in your "${s.title}" service. Please share details.`;
  const others = SERVICES.filter((x) => x.slug !== s.slug);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-grid opacity-70" />
        <div className="absolute -right-40 -top-40 -z-10 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <Link
            href="/services"
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            All services
          </Link>
          {s.comingSoon && (
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <SparklesIcon className="h-3.5 w-3.5" />
                Coming soon
              </span>
            </div>
          )}
          <h1 className="mt-4 max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            {s.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{s.intro}</p>
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
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">What&apos;s included</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {s.points.map((p) => (
            <li
              key={p}
              className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-5 text-base leading-relaxed text-ink"
            >
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              {p}
            </li>
          ))}
        </ul>

        {s.note && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
            <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm leading-relaxed text-amber-900">{s.note}</p>
          </div>
        )}

        <div className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-xl font-bold text-ink">Other services</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/services/${o.slug}`}
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
