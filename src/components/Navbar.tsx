"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { EASE, EASE_IN_OUT } from "@/lib/motion";
import { useIntro, useLocale } from "@/lib/providers";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";

export function Navbar() {
  const { t, locale, toggle } = useLocale();
  const { ready } = useIntro();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Aşağı kaydırınca gizle, yukarı kaydırınca göster
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 320 && !open);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: ready && !hidden ? 0 : -100 }}
        transition={{ duration: 0.7, ease: EASE, delay: ready && !scrolled ? 0.6 : 0 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "shell flex h-16 items-center justify-between transition-[background-color,backdrop-filter,border-color] duration-500 md:h-20",
            scrolled && "md:mt-3",
          )}
        >
          <div
            className={cn(
              "flex w-full items-center justify-between rounded-full transition-all duration-500",
              scrolled ? "border border-line bg-ink/70 py-2 pl-2 pr-2 backdrop-blur-xl md:pl-3" : "border border-transparent",
            )}
          >
            <Link href="/" className="group flex items-center gap-3" data-cursor="hover" aria-label={site.fullName}>
              <span className="grid size-10 place-items-center rounded-full bg-bone font-display text-sm font-bold tracking-tight text-ink transition-colors duration-500 group-hover:bg-acid">
                {site.initials}
              </span>
              <span className="hidden font-display text-sm font-medium tracking-tight sm:block">
                {site.fullName}
                <span className="block font-mono text-[0.62rem] uppercase tracking-[0.08em] text-mute">{site.role}</span>
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {t.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={`/${item.href}`}
                      className="group relative block overflow-hidden rounded-full px-4 py-2 text-sm text-bone-2 transition-colors hover:text-bone"
                    >
                      <span className="block transition-transform duration-500 ease-expo group-hover:-translate-y-[130%]">{item.label}</span>
                      <span aria-hidden className="absolute inset-x-4 top-2 block translate-y-[130%] text-acid transition-transform duration-500 ease-expo group-hover:translate-y-0">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                aria-label={locale === "tr" ? "Switch to English" : "Türkçeye geç"}
                className="relative grid h-10 w-[4.25rem] grid-cols-2 items-center rounded-full border border-line-2 font-mono text-[0.68rem] uppercase"
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  className={cn("absolute top-1 h-8 w-[1.9rem] rounded-full bg-bone", locale === "tr" ? "left-1" : "right-1")}
                />
                <span className={cn("relative z-10 text-center transition-colors", locale === "tr" ? "text-ink" : "text-mute")}>TR</span>
                <span className={cn("relative z-10 text-center transition-colors", locale === "en" ? "text-ink" : "text-mute")}>EN</span>
              </button>

              <Link
                href="/#contact"
                className="group hidden h-10 items-center gap-2 rounded-full bg-acid px-5 text-sm font-medium text-ink transition-colors duration-500 hover:bg-bone md:inline-flex"
              >
                <span className="size-1.5 rounded-full bg-ink transition-transform duration-500 group-hover:scale-150" />
                {t.ui.letsTalk}
              </Link>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t.ui.close : t.ui.menu}
                className="relative grid size-10 place-items-center rounded-full bg-bone text-ink lg:hidden"
              >
                <span className="sr-only">{open ? t.ui.close : t.ui.menu}</span>
                <motion.span
                  className="absolute h-[1.5px] w-4 bg-ink"
                  animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
                <motion.span
                  className="absolute h-[1.5px] w-4 bg-ink"
                  animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-40 flex flex-col bg-ink-2 lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2rem)" }}
            transition={{ duration: 0.8, ease: EASE_IN_OUT }}
          >
            <div className="shell flex flex-1 flex-col justify-between pb-8 pt-28">
              <nav aria-label="Mobile">
                <ul className="flex flex-col">
                  {t.nav.map((item, i) => (
                    <li key={item.href} className="overflow-hidden border-b border-line">
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.06 }}
                      >
                        <Link
                          href={`/${item.href}`}
                          onClick={() => setOpen(false)}
                          className="flex items-baseline justify-between py-4 font-display text-[2.6rem] font-medium leading-none tracking-tight active:text-acid sm:text-6xl"
                        >
                          {item.label}
                          <span className="font-mono text-xs text-mute">0{i + 1}</span>
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
                className="flex flex-col gap-5"
              >
                <a href={`mailto:${site.email}`} className="text-lg text-bone-2">
                  {site.email}
                </a>
                <div className="flex gap-3">
                  <a href={site.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid size-12 place-items-center rounded-full border border-line-2">
                    <GithubIcon className="size-5" />
                  </a>
                  {site.socials.linkedin && (
                    <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid size-12 place-items-center rounded-full border border-line-2">
                      <LinkedinIcon className="size-5" />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
