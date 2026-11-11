"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Info } from "lucide-react";
import Link from "next/link";
import { site } from "@/config/site";
import { EASE } from "@/lib/motion";
import { useIntro, useLocale } from "@/lib/providers";
import { useEffect } from "react";
import { Footer } from "../Footer";
import { Navbar } from "../Navbar";
import { Badge, TechTag } from "../ui/Badge";
import { GithubIcon } from "../ui/BrandIcons";
import { Button } from "../ui/Button";
import { MaskLine, Reveal } from "../ui/Reveal";
import { ProjectCover } from "./ProjectCover";

export function ProjectDetail({ slug }: { slug: string }) {
  const { t } = useLocale();
  const { finish } = useIntro();
  const items = t.projects.items;
  const idx = items.findIndex((p) => p.slug === slug);
  const p = items[idx];
  const next = items[(idx + 1) % items.length];
  const d = t.projects.detail;

  // Detay sayfasında preloader yok: navigasyonu hemen göster
  useEffect(() => finish(), [finish]);

  if (!p) return null;
  const repo = p.repo || site.socials.github;

  return (
    <>
      <Navbar />
      <main className="pt-28 md:pt-36">
        <div className="shell">
          <Link href="/#projects" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-mute transition-colors hover:text-bone">
            <ArrowLeft className="size-4 transition-transform duration-500 ease-expo group-hover:-translate-x-1" />
            {t.ui.allProjects}
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="label">
              <span className="text-acid">{p.index}</span> · {p.category} · {p.year}
            </span>
            <Badge tone="warn">{t.ui.conceptBadge}</Badge>
          </div>

          <h1 className="display mt-6 text-[clamp(3.2rem,11vw,10rem)]">
            <MaskLine animate>{p.title}</MaskLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-2 md:text-xl"
          >
            {p.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
            className="group mt-14 aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-line sm:aspect-[16/8]"
          >
            <ProjectCover variant={p.cover} />
          </motion.div>

          <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-6">
            <aside className="md:col-span-4">
              <div className="md:sticky md:top-28">
                <Reveal>
                  <p className="label mb-4">{d.stack}</p>
                  <ul className="flex flex-wrap gap-2">
                    {p.tech.map((x) => (
                      <li key={x}>
                        <TechTag name={x} />
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
                  <Button href={repo} external variant="ghost" icon={<GithubIcon className="size-4" />}>
                    {t.ui.sourceCode}
                  </Button>
                </Reveal>
                <Reveal delay={0.15} className="mt-8 flex gap-3 rounded-2xl border border-dashed border-amber-300/30 p-4 text-sm leading-relaxed text-amber-100/70">
                  <Info className="mt-0.5 size-4 shrink-0" />
                  {d.conceptNote}
                </Reveal>
              </div>
            </aside>

            <div className="space-y-16 md:col-span-7 md:col-start-6">
              {[
                { h: d.problem, b: p.problem },
                { h: d.solution, b: p.solution },
              ].map((s, i) => (
                <Reveal key={s.h}>
                  <p className="label mb-4">
                    <span className="text-acid">0{i + 1}</span> — {s.h}
                  </p>
                  <p className="font-display text-2xl font-medium leading-snug tracking-tight md:text-3xl">{s.b}</p>
                </Reveal>
              ))}
              <Reveal>
                <p className="label mb-6">
                  <span className="text-acid">03</span> — {d.features}
                </p>
                <ul className="border-t border-line">
                  {p.features.map((f, i) => (
                    <li key={f} className="group flex items-baseline gap-6 border-b border-line py-5">
                      <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-lg transition-transform duration-500 ease-expo group-hover:translate-x-1.5">{f}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>

          {/* Sonraki proje */}
          <Link
            href={`/projects/${next.slug}/`}
            data-cursor-label={t.ui.viewProject}
            className="group mt-28 block border-t border-line py-14 md:mt-40 md:py-20"
          >
            <span className="label">{t.ui.nextProject}</span>
            <span className="mt-4 flex items-center justify-between gap-6">
              <span className="display text-[clamp(2.6rem,9vw,8rem)] transition-colors duration-500 group-hover:text-acid">{next.title}</span>
              <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line-2 transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:border-acid group-hover:bg-acid group-hover:text-ink md:size-20">
                <ArrowUpRight className="size-6" />
              </span>
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
