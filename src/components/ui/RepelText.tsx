"use client";

import { motion, useTransform } from "framer-motion";
import { useRef } from "react";
import { useRepel } from "@/lib/repel";

function RepelLetter({ ch, force, radius, tint }: { ch: string; force: number; radius: number; tint: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { x, y, rotate, near } = useRepel(ref, { force, radius });
  const color = useTransform(near, [0, 0.2, 1], ["#efede7", "#efede7", "#d2ff3a"]);
  return (
    <span ref={ref} className="inline-block">
      <motion.span className="inline-block will-change-transform" style={{ x, y, rotate, ...(tint ? { color } : {}) }}>
        {ch}
      </motion.span>
    </span>
  );
}

/** Harfleri imleçten kaçan metin (başlıklar için). Kelime bölünmesi korunur. */
export function RepelText({ text, force = 0.45, radius = 1.9, tint = false }: { text: string; force?: number; radius?: number; tint?: boolean }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="inline-block whitespace-nowrap">
              {w.split("").map((ch, i) => (
                <RepelLetter key={i} ch={ch} force={force} radius={radius} tint={tint} />
              ))}
            </span>
            {wi < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </>
  );
}
