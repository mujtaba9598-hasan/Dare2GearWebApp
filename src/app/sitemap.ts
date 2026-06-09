import type { MetadataRoute } from "next";
import {
  DESTINATIONS,
  ORIGINS,
  isRestrictedDestination,
  isRestrictedOrigin,
} from "@/lib/data";
import { RENTAL_CATEGORIES, SERVICES } from "@/lib/catalog";

// Static export needs this resolved at build time.
export const dynamic = "force-static";

const BASE = "https://dare2gear.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "/",
    "/planner/",
    "/trip/",
    "/destinations/",
    "/cities/",
    "/rentals/",
    "/services/",
    "/list-your-property/",
  ];

  // Restricted (Balochistan) destinations/cities are deliberately kept OUT of the
  // sitemap — same hide-from-automated-discovery rule as generateStaticParams.
  const destPaths = DESTINATIONS.filter((d) => !isRestrictedDestination(d)).map(
    (d) => `/destinations/${d.id}/`,
  );
  const cityPaths = ORIGINS.filter((o) => !isRestrictedOrigin(o)).map(
    (o) => `/cities/${o.id}/`,
  );
  const rentalPaths = RENTAL_CATEGORIES.map((c) => `/rentals/${c.slug}/`);
  const servicePaths = SERVICES.map((s) => `/services/${s.slug}/`);

  const all = [
    ...staticPaths,
    ...destPaths,
    ...cityPaths,
    ...rentalPaths,
    ...servicePaths,
  ];

  return all.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/destinations/") ? 0.8 : 0.6,
  }));
}
