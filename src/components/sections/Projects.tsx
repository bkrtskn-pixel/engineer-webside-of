"use client";

import { Info } from "lucide-react";
import { useLocale } from "@/lib/providers";
import { ProjectCard, type CardLayout } from "../projects/ProjectCard";
import { Reveal } from "../ui/Reveal";
import { SectionHeader } from "../ui/SectionHeader";

/** Kart yerleşim ritmi: geniş → iki yarım → yatay bölünmüş (tekrar eder) */
const RHYTHM: CardLayout[] = ["wide", "half", "half", "split"];

export function Projects() {
  const { t } = useLocale();
  const p = t.projects;
  return (
    <section id="projects" className="relative py-24 md:py-40">
      <div className="shell">
        <SectionHeader
          index="03"
          label={p.label}
          title={p.title}
          intro={p.intro}
          aside={
            <Reveal delay={0.15} className="flex max-w-xs items-start gap-2 text-xs leading-relaxed text-mute">
              <Info className="mt-0.5 size-3.5 shrink-0 text-amber-200/80" />
              {p.disclaimer}
            </Reveal>
          }
        />

        <div className="mt-14 grid gap-x-6 gap-y-20 md:mt-20 md:grid-cols-2 md:gap-y-28">
          {p.items.map((project, i) => {
            const layout = RHYTHM[i % RHYTHM.length];
            return (
              <div key={project.slug} className={layout === "half" ? "md:col-span-1" : "md:col-span-2"}>
                <ProjectCard project={project} layout={layout} delay={layout === "half" && i % 2 === 0 ? 0.12 : 0} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
