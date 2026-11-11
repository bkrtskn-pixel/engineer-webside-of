"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { site } from "@/config/site";
import type { Project } from "@/content";
import { EASE } from "@/lib/motion";
import { useLocale } from "@/lib/providers";
import { cn } from "@/lib/utils";
import { Badge, TechTag } from "../ui/Badge";
import { GithubIcon } from "../ui/BrandIcons";
import { Tilt } from "../ui/Tilt";
import { ProjectCover } from "./ProjectCover";

export type CardLayout = "wide" | "half" | "split";

export function ProjectCard({ project, layout, delay = 0 }: { project: Project; layout: CardLayout; delay?: number }) {
  const { t } = useLocale();
  const href = `/projects/${project.slug}/`;
  const repo = project.repo || site.socials.github;

  const cover = (
    <Tilt className={layout === "split" ? "h-full" : undefined} max={layout === "half" ? 5 : 3}>
    <Link
      href={href}
      data-cursor-label={t.ui.viewProject}
      aria-label={`${project.title} — ${t.ui.viewDetails}`}
      className={cn(
        "group relative block overflow-hidden rounded-[1.25rem] border border-line",
        layout === "wide" && "aspect-[4/3] sm:aspect-[16/8]",
        layout === "half" && "aspect-[4/3]",
        layout === "split" && "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[28rem]",
      )}
    >
      <div className="absolute inset-0 transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.035]">
        <ProjectCover variant={project.cover} />
      </div>
      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        <Badge tone="warn" className="bg-ink/70 backdrop-blur">{t.ui.conceptBadge}</Badge>
      </div>
      <span className="absolute bottom-4 right-4 grid size-12 place-items-center rounded-full bg-bone text-ink transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:bg-acid">
        <ArrowUpRight className="size-5" />
      </span>
    </Link>
    </Tilt>
  );

  const body = (
    <div className={cn("flex flex-col", layout === "split" ? "justify-between gap-10 py-2" : "mt-6 gap-5")}>
      <div>
        <div className="label flex items-center gap-3">
          <span className="text-acid">{project.index}</span>
          <span>{project.category}</span>
          <span className="text-dim">·</span>
          <span>{project.year}</span>
        </div>
        <h3
          className={cn(
            "mt-3 font-display font-medium tracking-[-0.035em]",
            layout === "half" ? "text-3xl md:text-4xl" : "text-4xl md:text-6xl",
          )}
        >
          <Link href={href} className="transition-colors duration-300 hover:text-acid">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-mute">{project.summary}</p>
      </div>
      <div className="flex flex-col gap-5">
        <ul className="flex flex-wrap gap-2">
          {project.tech.map((x) => (
            <li key={x}>
              <TechTag name={x} />
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link href={href} className="group/l inline-flex items-center gap-2 font-medium text-bone">
            <span className="relative">
              {t.ui.viewDetails}
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-acid transition-transform duration-500 ease-expo group-hover/l:scale-x-0" />
            </span>
            <ArrowUpRight className="size-4 text-acid transition-transform duration-500 ease-expo group-hover/l:rotate-45" />
          </Link>
          <a href={repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-mute transition-colors hover:text-bone">
            <GithubIcon className="size-4" />
            {t.ui.sourceCode}
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
      className={cn(layout === "split" && "grid gap-6 lg:grid-cols-12 lg:gap-10")}
    >
      {layout === "split" ? (
        <>
          <div className="lg:col-span-7">{cover}</div>
          <div className="lg:col-span-5">{body}</div>
        </>
      ) : (
        <>
          {cover}
          {body}
        </>
      )}
    </motion.article>
  );
}
