"use client";

import { motion, useAnimate, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { useFinePointer } from "@/lib/hooks";

/**
 * Göz: bebek imleci takip eder, ara ara kırpar; "scanning" iken sağa sola bakar.
 * Dokunmatik cihazlarda kendi kendine etrafa bakınır.
 */
export function Eye({ scanning = false, className }: { scanning?: boolean; className?: string }) {
  const fine = useFinePointer();
  const ref = useRef<SVGSVGElement>(null);
  const [lid, animate] = useAnimate<SVGGElement>();
  const ox = useSpring(0, { stiffness: 260, damping: 20 });
  const oy = useSpring(0, { stiffness: 260, damping: 20 });

  // İmleç takibi
  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vx = e.clientX - (r.left + r.width / 2);
      const vy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(vx, vy) || 1;
      const reach = Math.min(d, 260) / 260; // uzaklaştıkça kenara yaklaşır
      ox.set((vx / d) * 5 * reach);
      oy.set((vy / d) * 4.5 * reach);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, ox, oy]);

  // Dokunmatikte rastgele bakınma
  useEffect(() => {
    if (fine) return;
    const id = window.setInterval(() => {
      ox.set((Math.random() - 0.5) * 9);
      oy.set((Math.random() - 0.5) * 6);
    }, 1800);
    return () => window.clearInterval(id);
  }, [fine, ox, oy]);

  // Göz kırpma (2.5–5.5 sn arası rastgele; bazen çift kırpma)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = 0;
    const blink = async () => {
      if (lid.current) {
        await animate(lid.current, { scaleY: [1, 0.06, 1] }, { duration: 0.24, ease: "easeInOut" });
        if (Math.random() < 0.25 && lid.current) await animate(lid.current, { scaleY: [1, 0.06, 1] }, { duration: 0.2 });
      }
      t = window.setTimeout(blink, 2500 + Math.random() * 3000);
    };
    t = window.setTimeout(blink, 1500);
    return () => window.clearTimeout(t);
  }, [animate, lid]);

  return (
    <svg ref={ref} viewBox="0 0 32 32" aria-hidden className={className}>
      <g ref={lid} style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}>
        {/* göz akı */}
        <circle cx="16" cy="16" r="14.5" fill="#efede7" stroke="#09090b" strokeWidth="1.6" />
        {/* tarama sırasında sağa sola bakma */}
        <motion.g animate={scanning ? { x: [-5, 5, -5] } : { x: 0 }} transition={scanning ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}>
          <motion.g style={{ x: ox, y: oy }}>
            <circle cx="16" cy="16" r="7.2" fill="#09090b" />
            <circle cx="16" cy="16" r="3.4" fill="#d2ff3a" opacity="0.9" />
            <circle cx="16" cy="16" r="1.9" fill="#09090b" />
            <circle cx="18.6" cy="13.4" r="1.6" fill="#efede7" />
          </motion.g>
        </motion.g>
      </g>
    </svg>
  );
}
