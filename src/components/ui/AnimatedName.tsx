"use client";

import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { useFinePointer } from "@/lib/hooks";
import { EASE } from "@/lib/motion";

/** İmlecin harfe etki ettiği yarıçap (px) */
const RADIUS = 260;

function Letter({
  ch,
  index,
  delay,
  play,
  mx,
  my,
  interactive,
}: {
  ch: string;
  index: number;
  delay: number;
  play: boolean;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  interactive: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // 0 = imleç uzak, 1 = imleç harfin üstünde
  const near = useSpring(0, { stiffness: 180, damping: 22, mass: 0.6 });

  const update = () => {
    const el = ref.current;
    if (!el || !interactive) return;
    const r = el.getBoundingClientRect();
    const d = Math.hypot(mx.get() - (r.left + r.width / 2), my.get() - (r.top + r.height / 2));
    near.set(Math.max(0, 1 - d / RADIUS));
  };
  useMotionValueEvent(mx, "change", update);
  useMotionValueEvent(my, "change", update);

  const weight = useTransform(near, [0, 1], [600, 300]);
  const color = useTransform(near, [0, 0.15, 1], ["#efede7", "#efede7", "#d2ff3a"]);
  const lift = useTransform(near, [0, 1], ["0%", "-5%"]);

  return (
    <motion.span
      className="inline-block will-change-transform"
      initial={{ y: "105%", rotate: 10, filter: "blur(12px)", opacity: 0 }}
      animate={play ? { y: "0%", rotate: 0, filter: "blur(0px)", opacity: 1 } : undefined}
      transition={{ duration: 1.25, ease: EASE, delay: delay + index * 0.06 }}
    >
      {/* periyodik dalga (CSS) */}
      <span
        className="inline-block animate-[name-wave_7s_ease-in-out_infinite]"
        style={{ animationDelay: `${2.4 + delay + index * 0.07}s` }}
      >
        <motion.span ref={ref} className="inline-block" style={{ fontWeight: weight, color, y: lift }}>
          {ch}
        </motion.span>
      </span>
    </motion.span>
  );
}

/**
 * Hero ismi: harfler bulanıktan netleşerek maskeden yükselir,
 * imleç yaklaştıkça incelip vurgu rengine döner, ara ara dalgalanır.
 */
export function AnimatedName({ text, play, delay = 0 }: { text: string; play: boolean; delay?: number }) {
  const fine = useFinePointer();
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const leave = () => {
      mx.set(-9999);
      my.set(-9999);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [fine, mx, my]);

  return (
    <span className="-my-[0.14em] flex overflow-hidden py-[0.14em]" aria-hidden>
      {text.split("").map((ch, i) => (
        <Letter key={i} ch={ch} index={i} delay={delay} play={play} mx={mx} my={my} interactive={fine} />
      ))}
    </span>
  );
}
