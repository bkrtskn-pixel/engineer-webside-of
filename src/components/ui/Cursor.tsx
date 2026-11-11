"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useFinePointer } from "@/lib/hooks";

/**
 * Özel imleç: yalnızca hassas imleçli cihazlarda.
 * [data-cursor="hover"] → halka büyür; [data-cursor-label="..."] → etiketli disk.
 */
export function Cursor() {
  const fine = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });
  const [mode, setMode] = useState<"default" | "hover" | "label">("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor-label],[data-cursor],a,button");
      if (el?.dataset.cursorLabel) {
        setMode("label");
        setLabel(el.dataset.cursorLabel);
      } else if (el) {
        setMode("hover");
      } else {
        setMode("default");
      }
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  const size = mode === "label" ? 96 : mode === "hover" ? 52 : 10;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      <motion.div
        className="absolute left-0 top-0 grid place-items-center rounded-full border-solid border-acid"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: mode === "default" ? "rgb(210 255 58)" : mode === "label" ? "rgb(210 255 58)" : "rgba(210,255,58,0)",
          borderWidth: mode === "hover" ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <AnimatePresence>
          {mode === "label" && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-mono text-[0.7rem] font-medium uppercase tracking-widest text-ink"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <style>{`@media (hover:hover) and (pointer:fine){ [data-cursor-label], [data-cursor-label] * { cursor: none; } }`}</style>
      <motion.div
        className="absolute left-0 top-0 size-1 rounded-full bg-bone"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && mode !== "label" ? 1 : 0 }}
      />
    </div>
  );
}
