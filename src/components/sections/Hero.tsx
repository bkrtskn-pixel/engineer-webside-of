"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { site } from "@/config/site";
import { useClock, useFinePointer } from "@/lib/hooks";
import { EASE } from "@/lib/motion";
import { useIntro, useLocale } from "@/lib/providers";
import { AnimatedName } from "../ui/AnimatedName";
import { Button } from "../ui/Button";

function RotatingWord({ words, play }: { words: string[]; play: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!play) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), 2400);
    return () => window.clearInterval(id);
  }, [play, words.length]);
  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="block whitespace-nowrap text-acid"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Dönen dairesel metin rozeti — ortadaki ok imleci takip eder, tıklayınca projelere kaydırır */
function OrbitBadge({ label }: { label: string }) {
  const text = `${site.role} • ${site.roleSecondary} • `;
  const fine = useFinePointer();
  const ref = useRef<HTMLAnchorElement>(null);
  // Ok açısı (derece) ve diskin imlece doğru kayması
  const angle = useSpring(0, { stiffness: 140, damping: 18, mass: 0.6 });
  const dx = useSpring(0, { stiffness: 160, damping: 16 });
  const dy = useSpring(0, { stiffness: 160, damping: 16 });

  useEffect(() => {
    if (!fine) return;
    let last = 0;
    const move = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vx = e.clientX - (r.left + r.width / 2);
      const vy = e.clientY - (r.top + r.height / 2);
      // ArrowDown varsayılan olarak aşağıyı (90°) gösterir
      let target = (Math.atan2(vy, vx) * 180) / Math.PI - 90;
      // en kısa yoldan dönsün (359° → 1° atlaması olmasın)
      while (target - last > 180) target -= 360;
      while (target - last < -180) target += 360;
      last = target;
      angle.set(target);
      const dist = Math.hypot(vx, vy) || 1;
      const pull = Math.min(dist, 400) / 400;
      dx.set((vx / dist) * 9 * pull);
      dy.set((vy / dist) * 9 * pull);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, angle, dx, dy]);

  return (
    <a
      ref={ref}
      href="#projects"
      aria-label={label}
      data-cursor="hover"
      className="group relative grid size-28 shrink-0 place-items-center md:size-36"
    >
      <svg lang="en" viewBox="0 0 200 200" className="absolute inset-0 animate-[spin_18s_linear_infinite] group-hover:[animation-duration:6s]">
        <defs>
          <path id="orbit" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-bone-2 font-mono text-[15px] uppercase tracking-[0.18em]">
          <textPath href="#orbit">{text}</textPath>
        </text>
      </svg>
      <motion.span
        style={{ x: dx, y: dy }}
        className="grid size-12 place-items-center rounded-full bg-acid text-ink shadow-[0_0_40px_-6px_rgb(210_255_58/0.6)] transition-[scale] duration-500 ease-expo group-hover:scale-110 md:size-14"
      >
        <motion.span style={{ rotate: angle }} className="grid place-items-center">
          <ArrowDown className="size-5" strokeWidth={2.4} />
        </motion.span>
      </motion.span>
    </a>
  );
}

export function Hero() {
  const { t } = useLocale();
  const { ready } = useIntro();
  const fine = useFinePointer();
  const time = useClock(site.location.timeZone);
  const ref = useRef<HTMLElement>(null);

  // Scroll paralaksı
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // İmleci takip eden ışık
  const mx = useMotionValue(70);
  const my = useMotionValue(30);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(680px circle at ${sx}% ${sy}%, rgb(210 255 58 / 0.20), rgb(210 255 58 / 0.06) 35%, transparent 65%)`;
  // Işığın altında ızgara çizgileri belirginleşir
  const gridMask = useMotionTemplate`radial-gradient(340px circle at ${sx}% ${sy}%, black, transparent 75%)`;
  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (!fine) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section
      ref={ref}
      id="top"
      onMouseMove={onMove}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 md:pt-28"
    >
      {/* Arka plan katmanları */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent)]" />
        {fine && (
          <>
            <motion.div className="absolute inset-0" style={{ backgroundImage: spotlight }} />
            <motion.div
              className="grid-lines-bright absolute inset-0"
              style={{ maskImage: gridMask, WebkitMaskImage: gridMask }}
            />
          </>
        )}
        <div className="absolute -right-40 -top-40 size-[38rem] rounded-full bg-acid/[0.06] blur-[120px]" />
      </div>

      <div className="shell flex flex-1 flex-col">
        {/* Üst satır */}
        <motion.div {...appear(0.1)} className="flex flex-wrap items-center justify-between gap-3">
          <span className="label">{t.hero.eyebrow}</span>
          {site.openToWork && (
            <span className="inline-flex items-center gap-2 rounded-full border border-line-2 px-3 py-1.5 text-xs text-bone-2">
              <span className="size-2 animate-pulse-dot rounded-full bg-acid" />
              {t.ui.openToWork}
            </span>
          )}
        </motion.div>

        {/* İsim */}
        <motion.h1
          style={{ y: nameY, opacity: fade }}
          className="display mt-8 text-[27vw] text-bone md:mt-10 md:text-[clamp(4.6rem,22vw,17.5rem)]"
        >
          <span className="sr-only">
            {site.fullName} — {site.role}, {site.roleSecondary}
          </span>
          <AnimatedName text={site.firstName} play={ready} delay={0.05} />
          <span className="flex items-center gap-6 md:justify-end md:gap-10">
            <motion.span
              initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
              animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
              transition={{ duration: 1.2, ease: EASE, delay: 0.7 }}
              className="hidden md:block"
            >
              <OrbitBadge label={t.hero.primaryCta} />
            </motion.span>
            <AnimatedName text={site.lastName} play={ready} delay={0.25} />
          </span>
        </motion.h1>

        {/* Alt ızgara */}
        <div className="mt-auto grid gap-8 pb-8 pt-10 md:grid-cols-12 md:items-end md:gap-6 md:pb-10">
          <motion.div {...appear(0.55)} className="md:col-span-4">
            <p className="font-display text-2xl font-medium leading-tight tracking-tight md:text-[1.7rem]">
              {site.role}
              <span className="text-dim"> / </span>
              <br className="hidden md:block" />
              {site.roleSecondary}
            </p>
            <p className="mt-3 font-mono text-sm text-mute">
              <span className="text-dim">{"> "}</span>
              <RotatingWord words={t.hero.rotating} play={ready} />
            </p>
          </motion.div>

          <motion.p {...appear(0.65)} className="max-w-md text-base leading-relaxed text-bone-2 md:col-span-4 md:text-[1.05rem]">
            {t.hero.intro}
          </motion.p>

          <motion.div {...appear(0.75)} className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
            <Button href="#projects">{t.hero.primaryCta}</Button>
            <Button href="#contact" variant="ghost">
              {t.hero.secondaryCta}
            </Button>
          </motion.div>
        </div>

        {/* Alt bilgi çubuğu */}
        <motion.div
          {...appear(0.9)}
          className="flex items-center justify-between border-t border-line py-4 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-mute"
        >
          <span className="flex items-center gap-2">
            <MapPin className="size-3.5 text-acid" />
            {site.location.city}, {site.location.country}
          </span>
          <a href="#about" className="hidden items-center gap-2 transition-colors hover:text-bone sm:flex">
            {t.ui.scroll}
            <span className="relative block h-4 w-px overflow-hidden bg-line-2">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-acid"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </a>
          <span suppressHydrationWarning>
            {t.ui.localTime} · {time || "--:--"} GMT+3
          </span>
        </motion.div>
      </div>
    </section>
  );
}
