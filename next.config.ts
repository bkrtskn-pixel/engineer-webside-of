import type { NextConfig } from "next";

/**
 * Statik export (GitHub Pages).
 * BASE_PATH: "/portfolio" gibi bir alt dizin. Kök alan adında boş bırakın.
 * Workflow bu değeri depo adına göre otomatik belirler.
 */
const basePath = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: process.env.SITE_URL ?? "",
  },
};

export default nextConfig;
