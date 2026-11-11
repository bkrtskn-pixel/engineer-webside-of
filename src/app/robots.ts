import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://bkrtskn-pixel.github.io"}${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${url}/sitemap.xml` };
}
