// Dare2Gear — rentals & services catalog (display-only for now).
// These power the category pages under /rentals/[category] and /services/[slug].
// Most are "Coming Soon": inquiries go to WhatsApp/email (no backend).
// A future admin panel / VPS backend will manage real inventory & bookings
// (see DEFERRED.md).

export interface CatalogItem {
  name: string;
  desc: string;
}

export interface RentalCategory {
  slug: string;
  title: string;
  /** short label for nav menus */
  navLabel: string;
  tagline: string;
  intro: string;
  items: CatalogItem[];
  comingSoon: boolean;
}

export interface ServiceOffering {
  slug: string;
  title: string;
  navLabel: string;
  tagline: string;
  intro: string;
  points: string[];
  /** optional note, e.g. membership/fee requirement */
  note?: string;
  comingSoon: boolean;
}

export const RENTAL_CATEGORIES: RentalCategory[] = [
  {
    slug: "bikes",
    title: "Bikes for rent",
    navLabel: "Bikes for rent",
    tagline: "150cc+ touring-ready bikes, serviced for the north.",
    intro:
      "Affordable, trip-ready motorcycles for your northern Pakistan adventure — serviced, checked and delivered to your route.",
    items: [
      { name: "150cc & above", desc: "Touring-capable bikes suited to mountain roads." },
      { name: "Helmets included", desc: "Safety gear provided with every rental." },
      { name: "Delivered to your route", desc: "Pick up near your starting city or on the way." },
      { name: "Serviced & checked", desc: "Every bike is inspected before it goes out." },
    ],
    comingSoon: true,
  },
  {
    slug: "camping",
    title: "Camping gear",
    navLabel: "Camping gear",
    tagline: "Tents, sleeping bags, stoves and everything to sleep under the stars.",
    intro:
      "Skip the hotel bill — camp instead. Rent a full camping kit and cook your own food on the road.",
    items: [
      { name: "Tents & sleeping bags", desc: "Weather-ready tents and warm sleeping bags." },
      { name: "Stove + cooking utensils", desc: "Portable stove, pots and pans to cook your own meals." },
      { name: "Foldable chairs & table", desc: "Comfortable, packable camp furniture." },
      { name: "Lanterns & mats", desc: "Camp lighting and insulated sleeping mats." },
    ],
    comingSoon: true,
  },
  {
    slug: "gadgets",
    title: "Bike gadgets",
    navLabel: "Bike gadgets",
    tagline: "Kit your ride for fog, glare and long hauls.",
    intro:
      "Upgrade your bike for the mountains — better visibility, protection and luggage for the long ride.",
    items: [
      { name: "Fog lights", desc: "Cut through mist and low light on mountain passes." },
      { name: "Crash guards / safeguards", desc: "Protect the bike (and you) on rough roads." },
      { name: "Side & saddle bags", desc: "Secure luggage for everything you need to carry." },
      { name: "Phone & GPS mounts", desc: "Keep navigation in view, hands on the bars." },
    ],
    comingSoon: true,
  },
  {
    slug: "accessories",
    title: "Travel accessories",
    navLabel: "Accessories",
    tagline: "The little things that make a long trip comfortable.",
    intro:
      "Small but essential gear that makes a big difference on a long journey.",
    items: [
      { name: "Torches & headlamps", desc: "Hands-free light for camp and breakdowns." },
      { name: "Power banks", desc: "Keep your phone and camera charged off-grid." },
      { name: "Dry bags", desc: "Keep clothes and electronics dry through rain and rivers." },
      { name: "First-aid kit", desc: "Basic medical kit for the road." },
    ],
    comingSoon: true,
  },
];

export const SERVICES: ServiceOffering[] = [
  {
    slug: "photographer",
    title: "Travel photographer",
    navLabel: "Photographer",
    tagline: "Take a photographer along for reels, TikToks and a full photo shoot.",
    intro:
      "Bring a photographer/videographer on your trip to capture it properly — social-ready reels, TikTok videos and a complete photo shoot of your journey.",
    points: [
      "Reels & TikTok videos of your trip",
      "Full photo shoot at the best spots",
      "Edited, ready-to-post content",
      "Travels with your group for the route",
    ],
    comingSoon: true,
  },
  {
    slug: "expert-advice",
    title: "Expert trip advice",
    navLabel: "Expert advice",
    tagline: "One-on-one guidance from people who know the routes.",
    intro:
      "Get tailored advice on routes, timing, safety, bike choice and how to cut your costs — from people who actually ride and travel the north.",
    points: [
      "Personalised route & timing advice",
      "Bike suitability for tough tracks",
      "Money-saving tips on food & stays",
      "Safety, documents & permits guidance",
    ],
    note: "Expert advice will require a small fee or membership — we'll share details when it launches.",
    comingSoon: true,
  },
  {
    slug: "discounts",
    title: "Partner discounts & perks",
    navLabel: "Partner discounts",
    tagline: "Book through Dare2Gear and save on food, gear and rentals.",
    intro:
      "When you plan and book your trip with Dare2Gear, you unlock perks with our partners along the way.",
    points: [
      "Discounts at partner food chains & restaurants",
      "% off bike & gear rentals",
      "Discounts on gear bought from our outlet",
      "Exclusive deals for booking through us",
    ],
    comingSoon: true,
  },
];

export function rentalCategory(slug: string): RentalCategory | undefined {
  return RENTAL_CATEGORIES.find((c) => c.slug === slug);
}

export function service(slug: string): ServiceOffering | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
