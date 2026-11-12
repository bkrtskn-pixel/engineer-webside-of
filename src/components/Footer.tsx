"use client";

import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { site } from "@/config/site";
import { useLocale } from "@/lib/providers";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";
import { Marquee } from "./ui/Marquee";

export function Footer() {
  const { t } = useLocale();
  const linkedin: string = site.socials.linkedin;
  return (
    <footer className="relative overflow-hidden border-t border-line pt-16">
      <div className="shell grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-2xl font-medium tracking-tight">{site.brand}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-mute"><span lang="tr">{site.fullName}</span> · <span lang="en">{site.role}</span></p>
          <p className="mt-2 max-w-xs text-sm text-mute">{t.footer.tagline}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-1">
            {t.nav.map((n) => (
              <li key={n.href}>
                <Link href={`/${n.href}`} className="text-bone-2 transition-colors hover:text-acid">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-start justify-between gap-6 md:col-span-4 md:justify-end">
          <div className="flex gap-2">
            <a href={site.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid size-11 place-items-center rounded-full border border-line-2 transition-colors hover:border-acid hover:text-acid">
              <GithubIcon className="size-4" />
            </a>
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid size-11 place-items-center rounded-full border border-line-2 transition-colors hover:border-acid hover:text-acid">
                <LinkedinIcon className="size-4" />
              </a>
            )}
          </div>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="group inline-flex items-center gap-3 text-sm text-bone-2">
            {t.ui.backToTop}
            <span className="grid size-11 place-items-center rounded-full bg-bone text-ink transition-all duration-500 ease-expo group-hover:-translate-y-1 group-hover:bg-acid">
              <ArrowUp className="size-4" />
            </span>
          </a>
        </div>
      </div>

      {/* Dev kayan isim */}
      <Marquee
        items={[site.brand.toUpperCase(), t.hero.slogan.join(" ")]}
        duration={36}
        separator="✳"
        className="display mt-16 select-none py-4 text-[clamp(4rem,14vw,13rem)] text-outline"
      />

      <div className="shell flex flex-col gap-2 border-t border-line py-6 font-mono text-[0.68rem] uppercase tracking-wider text-mute sm:flex-row sm:justify-between">
        <span>
          © {site.year} {site.brand} · {site.fullName}. {t.footer.rights}
        </span>
        <span className="normal-case tracking-normal">{t.footer.built}</span>
      </div>
    </footer>
  );
}
