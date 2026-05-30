import type { Metadata } from "next";
import { waLink, mailLink, CONTACT } from "@/lib/contact";
import {
  BedIcon,
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
  CheckIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "List Your Hotel or Vendor — Dare2Gear",
  description:
    "Run a hotel, guesthouse, camp or travel service in northern Pakistan? Contact Dare2Gear and we'll create your listing for you — reach travelers planning their trips, even if you're not on the big booking sites.",
};

const WHY = [
  "Reach travelers actively planning trips to your area",
  "Great for places not listed on the big booking sites",
  "No upfront cost to get listed while we onboard partners",
  "We handle the photos, write-up and listing for you",
];

const NEED = [
  "Property / business name and exact location",
  "5–10 good photos (rooms, exterior, views)",
  "Room types and per-night prices",
  "Facilities (Wi-Fi, hot water, parking, food, etc.)",
  "A contact number for bookings",
];

const STEPS = [
  { n: 1, title: "Contact us", text: "Reach out on WhatsApp, call or email — whatever's easiest for you." },
  { n: 2, title: "Share your details", text: "Send us your photos, prices and facilities. We'll guide you on what's needed." },
  { n: 3, title: "We publish it", text: "Our team builds a polished listing and puts your property live for travelers." },
];

const subject = "New listing — hotel / vendor";
const msg =
  "Hi Dare2Gear! I'd like to list my hotel/vendor with you. Here are my details:\n\n- Name:\n- Location:\n- Type (hotel/camp/vendor):\n- Price range:\n- Contact number:\n";

export default function ListYourPropertyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-grid opacity-70" />
        <div className="absolute -left-32 top-20 -z-10 h-80 w-80 rounded-full bg-brand-100 blur-3xl" />
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-brand-700">
            <BedIcon className="h-3.5 w-3.5" />
            For hotels &amp; vendors
          </span>
          <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            Get your place in front of{" "}
            <span className="text-brand-600">travelers who are ready to go.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Run a hotel, guesthouse, camp or travel service in the north? We&apos;d
            love to list it — especially if you&apos;re not on the big booking sites.
          </p>
        </div>
      </section>

      {/* Backbone: Why list with us + What to send us */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-7 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Why list with us
            </h2>
            <ul className="mt-6 space-y-4">
              {WHY.map((w) => (
                <li key={w} className="flex items-start gap-3 text-base leading-relaxed text-ink">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-canvas p-7 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              What to send us
            </h2>
            <ul className="mt-6 space-y-4">
              {NEED.map((n) => (
                <li key={n} className="flex items-start gap-3 text-base leading-relaxed text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
          <strong>There&apos;s no self-upload.</strong> To keep listings accurate,
          you don&apos;t add the property yourself — just contact us, share these
          details, and <strong>our team creates the listing for you.</strong>
        </p>
      </section>

      {/* Contact us — prominent */}
      <section className="border-y border-line bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              To list your property, contact us
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Pick whatever&apos;s easiest. We reply within a day, usually faster.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
            {/* WhatsApp */}
            <a
              href={waLink(msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-6 text-center transition-all hover:-translate-y-0.5 hover:border-[#25D366]/50 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-sm">
                <WhatsAppIcon className="h-7 w-7" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">WhatsApp</span>
              <span className="font-display text-sm font-bold text-ink">{CONTACT.whatsapp}</span>
            </a>

            {/* Call */}
            <a
              href={`tel:${CONTACT.whatsappDigits}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-6 text-center transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
                <PhoneIcon className="h-7 w-7" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Call</span>
              <span className="font-display text-sm font-bold text-ink">{CONTACT.phone}</span>
            </a>

            {/* Email */}
            <a
              href={mailLink(subject, msg)}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-6 text-center transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
                <MailIcon className="h-7 w-7" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Email</span>
              <span className="font-display text-sm font-bold text-ink break-all">{CONTACT.email}</span>
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">How listing works</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-line bg-surface p-7">
              <span className="absolute right-6 top-6 font-display text-5xl font-extrabold text-slate-100">
                {s.n}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 font-display text-lg font-bold text-brand-600">
                {s.n}
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
