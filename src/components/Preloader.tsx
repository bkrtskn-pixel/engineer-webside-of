"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { EASE_IN_OUT } from "@/lib/motion";
import { useIntro } from "@/lib/providers";

const SESSION_KEY = "bt-intro-seen";

/**
 * Giriş animasyonu: sayaç 0→100, isim harf harf belirir, perde yukarı kalkar.
 * Oturum başına bir kez oynar; hareket azaltma tercihinde atlanır.
 */
export function Preloader() {
  const { finish } = useIntro();
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* yoksay */
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setShow(false);
      finish();
      return;
    }
    const duration = 1500;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // ease-out sayaç
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* yoksay */
        }
        window.setTimeout(() => setShow(false), 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const letters = `${site.firstName} ${site.lastName}`.split("");

  return (
    <AnimatePresence onExitComplete={finish}>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink-2 p-4 md:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: EASE_IN_OUT }}
        >
          <div className="label flex justify-between">
            <span>{site.role}</span>
            <span>
              {site.location.city}, {site.location.country}
            </span>
          </div>

          <div className="display flex flex-wrap overflow-hidden py-[0.14em] text-[13vw] text-bone md:text-[8vw]" aria-label={site.fullName}>
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                aria-hidden
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: EASE_IN_OUT, delay: 0.1 + i * 0.035 }}
                className="inline-block"
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="h-px flex-1 overflow-hidden bg-line">
              <div className="h-full origin-left bg-acid" style={{ transform: `scaleX(${count / 100})` }} />
            </div>
            <span className="display w-[3.2ch] text-right text-5xl tabular-nums text-acid md:text-7xl">{count}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
