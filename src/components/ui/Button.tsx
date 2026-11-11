"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { useFinePointer } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  icon?: ReactNode;
  className?: string;
}

/**
 * Manyetik buton: imleci hafifçe takip eder, hover'da metin yukarı kayar
 * ve arka plan alttan dolar. Dokunmatik cihazda manyetik etki kapalıdır.
 */
export function Button({ href, children, variant = "primary", external, icon, className }: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fine = useFinePointer();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const primary = variant === "primary";

  return (
    <motion.a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      data-cursor="hover"
      className={cn(
        "group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full pl-6 pr-2 text-[0.95rem] font-medium tracking-tight transition-colors duration-500",
        primary ? "bg-acid text-ink" : "border border-line-2 text-bone hover:text-ink",
        className,
      )}
    >
      {/* dolgu katmanı */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 origin-bottom scale-y-0 rounded-full transition-transform duration-500 ease-expo group-hover:scale-y-100",
          primary ? "bg-bone" : "bg-acid",
        )}
      />
      {/* kayan metin */}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-expo group-hover:-translate-y-full">{children}</span>
        <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-expo group-hover:translate-y-0">
          {children}
        </span>
      </span>
      <span
        className={cn(
          "relative grid size-10 place-items-center rounded-full transition-transform duration-500 ease-expo group-hover:rotate-45",
          primary ? "bg-ink text-acid" : "bg-bone text-ink",
        )}
      >
        {icon ?? <ArrowUpRight className="size-4" strokeWidth={2.2} />}
      </span>
    </motion.a>
  );
}

/** Altı çizgisi soldan sağa çizilen metin bağlantısı */
export function TextLink({
  href,
  children,
  external,
  className,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-cursor="hover"
      className={cn("group relative inline-flex items-center gap-1.5", className)}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100" />
      </span>
      <ArrowUpRight className="size-[1em] transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}
