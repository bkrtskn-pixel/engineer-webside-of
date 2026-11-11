"use client";

import { motion } from "framer-motion";
import { Database, Globe, Server, Sparkles, Wrench } from "lucide-react";
import type { SkillGroup } from "@/content";
import { EASE } from "@/lib/motion";
import { useLocale } from "@/lib/providers";
import { cn } from "@/lib/utils";
import { Reveal } from "../ui/Reveal";
import { SectionHeader } from "../ui/SectionHeader";
import { SpotlightCard } from "../ui/SpotlightCard";

const ICONS = { backend: Server, database: Database, web: Globe, tools: Wrench, ai: Sparkles } as const;

/** Teknoloji "logosu": monogram karo */
function Mark({ mark, accent }: { mark: string; accent?: boolean }) {
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-xl font-mono text-[0.72rem] font-semibold tracking-tight transition-all duration-500 ease-expo group-hover/item:-rotate-6 group-hover/item:scale-110",
        accent ? "bg-acid text-ink" : "border border-line-2 bg-ink-3 text-bone group-hover/item:border-acid/60 group-hover/item:text-acid",
      )}
    >
      {mark}
    </span>
  );
}

function CardHead({ group }: { group: SkillGroup }) {
  const Icon = ICONS[group.id];
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="font-display text-2xl font-medium tracking-tight md:text-[1.75rem]">{group.title}</h3>
        <p className="mt-1.5 text-sm text-mute">{group.caption}</p>
      </div>
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line-2 text-acid">
        <Icon className="size-4" />
      </span>
    </div>
  );
}

function ItemList({ group, cols = "sm:grid-cols-2" }: { group: SkillGroup; cols?: string }) {
  return (
    <ul className={cn("grid gap-2", cols)}>
      {group.items.map((it, i) => (
        <li key={it.name} className="group/item flex items-center gap-3 rounded-2xl border border-line bg-ink/40 p-2 pr-4 transition-colors duration-300 hover:border-line-2">
          <Mark mark={it.mark} accent={i === 0} />
          <span className="min-w-0">
            <span className="block truncate text-[0.95rem] text-bone">{it.name}</span>
            {it.note && <span className="block font-mono text-[0.65rem] uppercase tracking-wider text-mute">{it.note}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Backend kartı görseli: sözdizimi renkli Java parçacığı */
function CodeVisual() {
  const lines: [string, string][] = [
    ["text-acid", "@Named @ViewScoped"],
    ["text-bone", "public class RequestBean {"],
    ["text-mute", "  @Inject RequestService service;"],
    ["text-bone-2", "  public void approve(Request r) {"],
    ["text-bone-2", "    service.approve(r, currentUser());"],
    ["text-bone-2", "  }"],
    ["text-bone", "}"],
  ];
  return (
    <div className="rounded-2xl border border-line bg-ink p-4 font-mono text-[0.72rem] leading-6 md:text-xs">
      <div className="mb-3 flex gap-1.5">
        <span className="size-2.5 rounded-full bg-ink-4" />
        <span className="size-2.5 rounded-full bg-ink-4" />
        <span className="size-2.5 rounded-full bg-acid/70" />
      </div>
      {lines.map(([c, l], i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.07 }}
          className={cn("whitespace-pre", c)}
        >
          <span className="mr-4 select-none text-dim">{String(i + 1).padStart(2, "0")}</span>
          {l}
        </motion.div>
      ))}
    </div>
  );
}

/** Veritabanı kartı görseli: sorgu + sonuç tablosu */
function QueryVisual() {
  const rows = [
    ["1042", "APPROVED", "0.8ms"],
    ["1043", "PENDING", "1.1ms"],
    ["1044", "APPROVED", "0.7ms"],
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink font-mono text-[0.7rem] md:text-xs">
      <div className="border-b border-line p-4 leading-6">
        <span className="text-acid">SELECT</span> id, status <span className="text-acid">FROM</span> requests
        <br />
        <span className="text-acid">WHERE</span> dept_id = :dept <span className="text-acid">ORDER BY</span> created_at;
      </div>
      <table className="w-full text-left">
        <thead className="text-mute">
          <tr>
            {["ID", "STATUS", "TIME"].map((h) => (
              <th key={h} className="px-4 py-2 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr
              key={r[0]}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.12 }}
              className="border-t border-line text-bone-2"
            >
              <td className="px-4 py-2">{r[0]}</td>
              <td className={cn("px-4 py-2", r[1] === "APPROVED" ? "text-acid" : "text-amber-200/80")}>{r[1]}</td>
              <td className="px-4 py-2 text-mute">{r[2]}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Skills() {
  const { t } = useLocale();
  const s = t.skills;
  const g = Object.fromEntries(s.groups.map((x) => [x.id, x])) as Record<SkillGroup["id"], SkillGroup>;

  return (
    <section id="skills" className="relative py-24 md:py-40">
      <div className="shell">
        <SectionHeader index="02" label={s.label} title={s.title} intro={s.intro} />

        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <SpotlightCard className="h-full p-6 md:p-8">
              <CardHead group={g.backend} />
              <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
                <ItemList group={g.backend} cols="grid-cols-1" />
                <CodeVisual />
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.08} className="md:col-span-5">
            <SpotlightCard className="h-full p-6 md:p-8">
              <CardHead group={g.database} />
              <div className="mt-8 flex flex-col gap-6">
                <QueryVisual />
                <ItemList group={g.database} />
              </div>
            </SpotlightCard>
          </Reveal>

          {/* AI — tam genişlik, farklı karakterde kart */}
          <Reveal className="md:col-span-12">
            <div className="relative overflow-hidden rounded-[1.25rem] bg-acid p-6 text-ink md:p-10">
              <div aria-hidden className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:14px_14px]" />
              <div className="relative grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-acid">
                    <Sparkles className="size-3" /> AI
                  </span>
                  <h3 className="mt-5 font-display text-3xl font-semibold leading-[0.95] tracking-tight md:text-5xl">{g.ai.title}</h3>
                  <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink/75">{g.ai.caption}</p>
                  <ul className="mt-8 divide-y divide-ink/15 border-y border-ink/15">
                    {g.ai.items.map((it) => (
                      <li key={it.name} className="group/ai flex items-center justify-between py-3.5">
                        <span className="flex items-center gap-3">
                          <span className="grid size-9 place-items-center rounded-lg bg-ink font-mono text-[0.65rem] font-semibold text-acid transition-transform duration-500 ease-expo group-hover/ai:-rotate-6">
                            {it.mark}
                          </span>
                          <span className="font-display text-lg font-medium tracking-tight">{it.name}</span>
                        </span>
                        <span className="h-px w-0 bg-ink transition-all duration-500 ease-expo group-hover/ai:w-10" />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:col-span-7 lg:pl-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-ink/60">{s.aiUseCasesTitle}</p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {s.aiUseCases.map((u, i) => (
                      <li
                        key={u.title}
                        className="group/uc rounded-2xl bg-ink p-5 text-bone transition-transform duration-500 ease-expo hover:-translate-y-1"
                      >
                        <span className="font-mono text-[0.65rem] text-acid">0{i + 1}</span>
                        <p className="mt-6 font-display text-lg font-medium tracking-tight">{u.title}</p>
                        <p className="mt-1 text-sm text-mute">{u.text}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 flex items-center gap-2 text-sm font-medium">
                    <span className="size-1.5 rounded-full bg-ink" />
                    {s.aiNote}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="md:col-span-6">
            <SpotlightCard className="h-full p-6 md:p-8">
              <CardHead group={g.web} />
              <div className="mt-8">
                <ItemList group={g.web} />
              </div>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-6">
            <SpotlightCard className="h-full p-6 md:p-8">
              <CardHead group={g.tools} />
              <div className="mt-8">
                <ItemList group={g.tools} />
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
