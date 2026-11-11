import type { MetadataRoute } from "next";
import { content, defaultLocale } from "@/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://bkrtskn-pixel.github.io"}${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;
  return [
    { url: `${url}/`, changeFrequency: "monthly", priority: 1 },
    ...content[defaultLocale].projects.items.map((p) => ({
      url: `${url}/projects/${p.slug}/`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
