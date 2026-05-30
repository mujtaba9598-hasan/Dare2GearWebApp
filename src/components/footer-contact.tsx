"use client";

import { useState } from "react";
import { CONTACT, waLink, mailLink } from "@/lib/contact";
import { WhatsAppIcon, PhoneIcon, ArrowRightIcon } from "./icons";

export function FooterContact() {
  const [email, setEmail] = useState("");

  const inquiry = mailLink(
    "Inquiry — Dare2Gear",
    `Hi Dare2Gear,\n\nI'd like to inquire about a trip.\n\nMy email: ${email || "(your email)"}\n\nMy question:\n`,
  );

  return (
    <div>
      {/* Small email inquiry */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = inquiry;
        }}
        className="flex items-center overflow-hidden rounded-lg border border-line bg-surface focus-within:border-brand-300"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email for inquiries"
          aria-label="Your email for inquiries"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Send inquiry"
          className="flex h-9 w-9 shrink-0 items-center justify-center bg-brand-600 text-white transition-colors hover:bg-brand-700"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </form>

      {/* Call + WhatsApp buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={waLink("Hi Dare2Gear! I have a question.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={`tel:${CONTACT.whatsappDigits}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-300"
        >
          <PhoneIcon className="h-4 w-4 text-brand-600" />
          Call
        </a>
      </div>

      <a
        href={`mailto:${CONTACT.email}`}
        className="mt-3 inline-block text-xs text-muted underline-offset-2 hover:text-brand-700 hover:underline"
      >
        {CONTACT.email}
      </a>
    </div>
  );
}
