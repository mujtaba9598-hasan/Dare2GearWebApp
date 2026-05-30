import type { HotelListing } from "@/lib/content";
import { pkr } from "@/lib/format";
import { waLink, mailLink } from "@/lib/contact";
import { StarIcon, MapPinIcon, WhatsAppIcon, MailIcon } from "./icons";

export function HotelCard({
  hotel,
  destinationName,
}: {
  hotel: HotelListing;
  destinationName: string;
}) {
  const subject = `Hotel inquiry — ${hotel.name}, ${destinationName}`;
  const msg = `Hi Dare2Gear! I'm interested in *${hotel.name}* (${hotel.area}, ${destinationName}) listed around ${pkr(hotel.pricePerNight)}/night. Please share availability and details.`;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-md hover:shadow-slate-200/60">
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hotel.photo}
          alt={hotel.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-ink shadow-sm">
          <StarIcon className="h-3.5 w-3.5 text-amber-500" />
          {hotel.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-display text-base font-bold text-ink">{hotel.name}</h4>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
          <MapPinIcon className="h-3.5 w-3.5" />
          {hotel.area}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {hotel.amenities.map((a) => (
            <span
              key={a}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
            >
              {a}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
          <div>
            <span className="font-display text-lg font-bold text-ink">{pkr(hotel.pricePerNight)}</span>
            <span className="text-xs text-muted"> / night</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={waLink(msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={mailLink(subject, msg)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand-300"
          >
            <MailIcon className="h-4 w-4" />
            Email
          </a>
        </div>
      </div>
    </article>
  );
}
