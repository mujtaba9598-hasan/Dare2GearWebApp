// Dare2Gear — contact channels for the "browse → inquire" flow.
// No backend: rentals, hotels and gear are inquired via WhatsApp / email.
// Update here if the number, email or domain changes.

export const CONTACT = {
  whatsapp: "+92 300 9618442",
  /** digits only, international format, for wa.me links */
  whatsappDigits: "923009618442",
  phone: "+92 300 9618442",
  email: "info@dare2gear.pk",
};

/** Build a wa.me link with a pre-filled message. */
export function waLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(message)}`;
}

/** Build a mailto link with subject + body. */
export function mailLink(subject: string, body: string): string {
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
