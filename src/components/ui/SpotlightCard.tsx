"use client";

import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** İmlecin altında hafif ışık ve kenar parlaması oluşturan kart (CSS değişkenleri ile, re-render yok) */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <div onMouseMove={onMove} className={cn("card group/spot", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--x) var(--y), rgb(210 255 58 / 0.07), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          padding: 1,
          background: "radial-gradient(260px circle at var(--x) var(--y), rgb(210 255 58 / 0.55), transparent 70%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
