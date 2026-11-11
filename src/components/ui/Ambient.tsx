"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring } from "framer-motion";
import { useEffect } from "react";
import { useFinePointer } from "@/lib/hooks";

/** Tüm sayfada imleci takip eden yumuşak ışık (yalnızca mouse/trackpad) */
export function CursorGlow() {
  const fine = useFinePointer();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 90, damping: 22 });
  const sy = useSpring(y, { stiffness: 90, damping: 22 });
  const bg = useMotionTemplate`radial-gradient(560px circle at ${sx}px ${sy}px, rgb(210 255 58 / 0.085), transparent 60%)`;

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, x, y]);

  if (!fine) return null;
  return <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-[1] mix-blend-screen" style={{ backgroundImage: bg }} />;
}

/** Sayfanın üstünde kaydırma ilerleme çizgisi */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-acid" style={{ scaleX }} />;
}
