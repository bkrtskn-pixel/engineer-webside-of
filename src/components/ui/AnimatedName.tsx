"use client";

import { motion, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";
import { useRepel } from "@/lib/repel";

function Letter({ ch, index, delay, play }: { ch: string; index: number; delay: number; play: boolean }) {
  // Ölçüm hareket etmeyen dış elemandan yapılır (geri besleme titremesi olmasın)
  const ref = useRef<HTMLSpanElement>(null);
  const { x, y, rotate, near } = useRepel(ref, { force: 0.42, radius: 1.5, spin: 0.45 });
  const color = useTransform(near, [0, 0.15, 1], ["#efede7", "#efede7", "#d2ff3a"]);

  return (
    <span ref={ref} className="inline-block">
      <motion.span
        className="inline-block will-change-transform"
        initial={{ y: "105%", rotate: 10, filter: "blur(12px)", opacity: 0 }}
        animate={play ? { y: "0%", rotate: 0, filter: "blur(0px)", opacity: 1 } : undefined}
        transition={{ duration: 1.25, ease: EASE, delay: delay + index * 0.06 }}
      >
        {/* periyodik dalga (CSS) */}
        <span className="inline-block animate-[name-wave_7s_ease-in-out_infinite]" style={{ animationDelay: `${2.4 + delay + index * 0.07}s` }}>
          {/* imleçten kaçış */}
          <motion.span className="inline-block" style={{ x, y, rotate, color }}>
            {ch === " " ? "\u00a0" : ch}
          </motion.span>
        </span>
      </motion.span>
    </span>
  );
}

/**
 * Hero ismi: harfler bulanıktan netleşerek maskeden yükselir, imleçten kaçar
 * (yaylanarak geri döner) ve ara ara dalgalanır.
 */
export function AnimatedName({ text, play, delay = 0 }: { text: string; play: boolean; delay?: number }) {
  const letters = text.split("");
  // Giriş bitince maske kalkar ki kaçan harfler kesilmesin
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!play) return;
    const id = window.setTimeout(() => setOpen(true), (delay + letters.length * 0.06 + 1.3) * 1000);
    return () => window.clearTimeout(id);
  }, [play, delay, letters.length]);

  return (
    <span className={`-my-[0.14em] flex py-[0.14em] ${open ? "overflow-visible" : "overflow-hidden"}`} aria-hidden>
      {letters.map((ch, i) => (
        <Letter key={i} ch={ch} index={i} delay={delay} play={play} />
      ))}
    </span>
  );
}
