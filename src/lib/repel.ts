"use client";

import { motionValue, useInView, useMotionValueEvent, useSpring } from "framer-motion";
import { useEffect, type RefObject } from "react";

/**
 * Tüm harflerin paylaştığı tek imleç dinleyicisi (performans için).
 * pointerTick her imleç hareketinde ve kaydırmada artar; harfler buna abone olur.
 */
let px = -9999;
let py = -9999;
export const pointerTick = motionValue(0);
let installed = false;

function installPointer() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const bump = () => pointerTick.set(pointerTick.get() + 1);
  const set = (x: number, y: number) => {
    px = x;
    py = y;
    bump();
  };
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "touch") set(e.clientX, e.clientY);
    },
    { passive: true },
  );
  // Dokunmatik: dokunulan noktadan harfler kaçar, kısa süre sonra geri döner
  window.addEventListener(
    "pointerdown",
    (e) => {
      if (e.pointerType !== "touch") return;
      set(e.clientX, e.clientY);
      window.setTimeout(() => set(-9999, -9999), 450);
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => set(-9999, -9999));
  window.addEventListener("scroll", bump, { passive: true });
}

const SPRING = { stiffness: 170, damping: 14, mass: 0.7 };

/**
 * ref'teki (hareket etmeyen) elemanın merkezine göre imleçten kaçış değerleri üretir.
 * force: harf yüksekliğine oranla en fazla itme · radius: harf yüksekliğine oranla etki alanı
 */
export function useRepel(ref: RefObject<HTMLElement | null>, { force = 0.4, radius = 1.8, spin = 0.3 } = {}) {
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const rotate = useSpring(0, SPRING);
  const near = useSpring(0, SPRING);
  const inView = useInView(ref, { margin: "120px" });

  useEffect(installPointer, []);

  useMotionValueEvent(pointerTick, "change", () => {
    const el = ref.current;
    if (!el || !inView) return;
    const b = el.getBoundingClientRect();
    const h = b.height || 1;
    const vx = b.left + b.width / 2 - px;
    const vy = b.top + b.height / 2 - py;
    const d = Math.hypot(vx, vy) || 0.001;
    const R = h * radius;
    if (d > R) {
      if (near.get() !== 0) {
        x.set(0);
        y.set(0);
        rotate.set(0);
        near.set(0);
      }
      return;
    }
    const k = Math.pow(1 - d / R, 1.6);
    const s = k * h * force;
    x.set((vx / d) * s);
    y.set((vy / d) * s);
    rotate.set((vx / d) * k * 40 * spin);
    near.set(k);
  });

  return { x, y, rotate, near };
}
