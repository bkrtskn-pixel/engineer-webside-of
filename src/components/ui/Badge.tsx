import { cn } from "@/lib/utils";

export function Badge({ children, tone = "line", className }: { children: React.ReactNode; tone?: "line" | "acid" | "warn"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.08em]",
        tone === "line" && "border border-line-2 text-bone-2",
        tone === "acid" && "bg-acid/10 text-acid ring-1 ring-acid/30",
        tone === "warn" && "border border-dashed border-amber-300/40 text-amber-200/80",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TechTag({ name }: { name: string }) {
  return (
    <span className="rounded-full border border-line px-3 py-1 text-xs text-bone-2 transition-colors duration-300 hover:border-acid/50 hover:text-bone">
      {name}
    </span>
  );
}
