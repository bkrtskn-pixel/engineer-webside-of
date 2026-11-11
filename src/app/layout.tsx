import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/space-grotesk";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Cursor } from "@/components/ui/Cursor";
import { site } from "@/config/site";
import { content, defaultLocale } from "@/content";
import { Providers } from "@/lib/providers";

const t = content[defaultLocale];
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bkrtskn-pixel.github.io";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}${basePath}/`),
  title: { default: t.meta.title, template: `%s — ${site.fullName}` },
  description: t.meta.description,
  applicationName: `${site.fullName} Portfolio`,
  authors: [{ name: site.fullName, url: site.socials.github }],
  creator: site.fullName,
  keywords: [
    site.fullName,
    "Computer Engineer",
    "Bilgisayar Mühendisi",
    "Software Developer",
    "Yazılım Geliştirici",
    "Backend Developer",
    "Java",
    "Oracle Database",
    "SQL",
    "PL/SQL",
    "PrimeFaces",
    "Enterprise Software",
    "Ankara",
  ],
  alternates: { canonical: "./" },
  openGraph: {
    type: "profile",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    title: t.meta.title,
    description: t.meta.description,
    siteName: site.fullName,
    firstName: "Bekir",
    lastName: "Taşkın",
  },
  twitter: { card: "summary", title: t.meta.title, description: t.meta.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.fullName,
  jobTitle: `${site.role}, ${site.roleSecondary}`,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: site.location.city, addressCountry: "TR" },
  knowsAbout: ["Java", "Oracle Database", "SQL", "PL/SQL", "PrimeFaces", "Backend Development", "Enterprise Software", "Database Architecture"],
  sameAs: [site.socials.github, site.socials.linkedin].filter(Boolean),
  url: `${siteUrl}${basePath}/`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          {children}
          <Cursor />
        </Providers>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
