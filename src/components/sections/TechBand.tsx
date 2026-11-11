"use client";

import { useLocale } from "@/lib/providers";
import { Marquee } from "../ui/Marquee";

/** Hero ile Hakkımda arasında teknoloji şeridi */
export function TechBand() {
  const { t } = useLocale();
  return (
    <div className="relative border-y border-line bg-ink-2 py-5 md:py-7" aria-label="Technologies">
      <Marquee items={t.marquee} duration={45} className="font-display text-2xl font-medium tracking-tight text-bone-2 md:text-4xl" />
    </div>
  );
}
