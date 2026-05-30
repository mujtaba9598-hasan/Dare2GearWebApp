import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits a fully static site to `out/` with no
  // server runtime — deployable to Netlify, or any plain static/shared host.
  output: "export",
  // Emit /route/index.html and link with trailing slashes, so URLs resolve on
  // bare static hosts (Apache/cPanel) without rewrite rules.
  trailingSlash: true,
  // Static export has no image optimization server; we use plain <img> tags,
  // but set this so next/image would also work if introduced later.
  images: {
    unoptimized: true,
  },
  // Pin the workspace root to this project so Next ignores the stray
  // package-lock.json in the parent home directory.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
