import type { MetadataRoute } from "next";

// Static export needs this resolved at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://dare2gear.online/sitemap.xml",
    host: "https://dare2gear.online",
  };
}
