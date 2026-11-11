"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "p" | "span";
}

/** Görünür alana girince bir kez yukarı kayarak beliren sarmalayıcı */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/** Satırı maskeden yukarı doğru çıkarır (başlıklar için) */
export function MaskLine({
  children,
  className,
  delay = 0,
  animate,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** verilirse görünürlük yerine bu bayrağa göre oynar */
  animate?: boolean;
}) {
  const target = { y: "0%" };
  return (
    <span className={`-my-[0.12em] block overflow-hidden py-[0.12em] ${className ?? ""}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "110%" }}
        {...(animate === undefined
          ? { whileInView: target, viewport: { once: true, margin: "0px 0px -10% 0px" } }
          : { animate: animate ? target : { y: "110%" } })}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
