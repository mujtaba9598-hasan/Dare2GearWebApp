import { emergencyFor, UNIVERSAL_LINES, type EmergencyContact } from "@/lib/emergency";
import { PhoneIcon, ShieldAlertIcon, AlertIcon } from "./icons";

/** Build a dial-able tel: href. Short codes (1122/15/115) pass through; local
 *  numbers are normalised to +92 (drop the leading 0). */
function telHref(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length <= 4) return `tel:${digits}`; // 1122, 15, 115, 1123
  return `tel:+92${digits.replace(/^0/, "")}`;
}

function CallButton({ phone, label }: { phone: string; label?: string }) {
  return (
    <a
      href={telHref(phone)}
      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
      aria-label={`Call ${label ?? phone}`}
    >
      <PhoneIcon className="h-4 w-4" />
      {phone}
    </a>
  );
}

function ContactCard({
  category,
  contact,
  fallback,
}: {
  category: string;
  contact: EmergencyContact;
  /** What to show when there's no published number for this contact. */
  fallback: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-white p-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600">{category}</p>
        <p className="mt-1 font-display text-sm font-bold leading-snug text-ink">{contact.name}</p>
      </div>
      {contact.phone ? (
        <CallButton phone={contact.phone} label={contact.name} />
      ) : (
        <p className="text-xs text-muted">{fallback}</p>
      )}
    </div>
  );
}

/** Emergency & roadside-help block for a destination. Static (baked into the
 *  page HTML) so the numbers are available — and callable — even offline. */
export function EmergencySection({ destinationId, destinationName }: { destinationId: string; destinationName: string }) {
  const e = emergencyFor(destinationId);

  return (
    <section className="mt-12">
      <div className="overflow-hidden rounded-3xl border-2 border-red-300 bg-red-50/70">
        <div className="flex items-center gap-2 border-b border-red-200 bg-red-100/70 px-5 py-3 sm:px-6">
          <ShieldAlertIcon className="h-6 w-6 text-red-600" />
          <h2 className="font-display text-xl font-bold text-red-800 sm:text-2xl">
            Emergency &amp; roadside help
          </h2>
        </div>

        <div className="p-5 sm:p-6">
          {/* Universal, always-works lines — most prominent */}
          <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
            Tap to call — works nationwide, 24/7
          </p>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {UNIVERSAL_LINES.map((l) => (
              <a
                key={l.phone}
                href={telHref(l.phone)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 font-display text-sm font-bold text-white shadow-sm transition-colors hover:bg-red-700"
                aria-label={`Call ${l.label}`}
              >
                <PhoneIcon className="h-4 w-4" />
                {l.label} · {l.phone}
              </a>
            ))}
          </div>

          {/* Nearest local services for this destination */}
          <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-red-600">
            Nearest help to {destinationName}
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ContactCard category="Police" contact={e.police} fallback="Dial 15" />
            <ContactCard category="Hospital / emergency" contact={e.hospital} fallback="Dial 1122 / 115" />
            <ContactCard category="Puncture shop" contact={e.puncture} fallback="Head to this bazaar; no listed number" />
            <ContactCard category="Mechanic / workshop" contact={e.mechanic} fallback="Head to this town; no listed number" />
          </div>

          {e.note && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-white/70 p-3">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-xs leading-relaxed text-slate-700">{e.note}</p>
            </div>
          )}

          <p className="mt-3 text-xs text-muted">
            Numbers are saved on this page and stay visible offline once it has loaded. Puncture &amp;
            mechanic entries point to the nearest town with shops — local stalls rarely have a public
            number. Hospital landlines can change; <strong>1122 / 15 / 115</strong> are the reliable
            round-the-clock lines.
          </p>
        </div>
      </div>
    </section>
  );
}
