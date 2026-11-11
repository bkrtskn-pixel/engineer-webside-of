"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { ExperienceItem } from "@/content";
import { EASE } from "@/lib/motion";
import { useLocale } from "@/lib/providers";
import { cn } from "@/lib/utils";
import { Badge, TechTag } from "../ui/Badge";
import { Reveal } from "../ui/Reveal";
import { SectionHeader } from "../ui/SectionHeader";

function Row({ item, open, onToggle, sampleLabel, id }: { item: ExperienceItem; open: boolean; onToggle: () => void; sampleLabel: string; id: string }) {
  return (
    <div className={cn("border-b border-line transition-colors duration-500", open && "bg-ink-2/60")}>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 px-1 py-7 text-left md:grid-cols-[11rem_1fr_auto] md:gap-8 md:px-4 md:py-9"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-mute md:order-none">{item.period}</span>
          <span className="col-span-2 row-start-2 md:col-span-1 md:row-start-auto">
            <span className="block font-display text-2xl font-medium tracking-tight transition-transform duration-500 ease-expo group-hover:translate-x-1.5 md:text-[2rem]">
              {item.role}
            </span>
            <span className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-mute">
              {item.org}
              <span className="text-dim">·</span>
              {item.type}
              {item.placeholder && <Badge tone="warn">{sampleLabel}</Badge>}
            </span>
          </span>
          <span
            className={cn(
              "col-start-2 row-start-1 grid size-11 place-items-center rounded-full border transition-all duration-500 ease-expo md:col-start-auto md:row-start-auto",
              open ? "rotate-45 border-acid bg-acid text-ink" : "border-line-2 group-hover:border-bone",
            )}
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 px-1 pb-9 md:grid-cols-[11rem_1fr_auto] md:gap-8 md:px-4">
              <span className="hidden md:block" />
              <div className="max-w-2xl">
                <p className="text-base leading-relaxed text-bone-2">{item.summary}</p>
                <ul className="mt-5 space-y-2.5">
                  {item.responsibilities.map((r) => (
                    <li key={r} className="flex gap-3 text-sm text-mute">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-acid" />
                      {r}
                    </li>
                  ))}
                </ul>
                {item.stack.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {item.stack.map((s) => (
                      <li key={s}>
                        <TechTag name={s} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Experience() {
  const { t } = useLocale();
  const e = t.experience;
  const [open, setOpen] = useState(0);

  return (
    <section id="experience" className="relative py-24 md:py-40">
      <div className="shell">
        <SectionHeader index="04" label={e.label} title={e.title} intro={e.intro} />
        <Reveal className="mt-14 border-t border-line md:mt-20">
          {e.items.map((item, i) => (
            <Row
              key={`${item.role}-${i}`}
              id={`exp-${i}`}
              item={item}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
              sampleLabel={t.ui.sampleBadge}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
