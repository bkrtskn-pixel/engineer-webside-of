"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "../ui/Reveal";
import { SectionHeader } from "../ui/SectionHeader";
import { useLocale } from "@/lib/providers";

/** Kaydırdıkça kelime kelime aydınlanan paragraf */
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="font-display text-[clamp(1.75rem,4.2vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.03em] text-bone">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

export function About() {
  const { t } = useLocale();
  const a = t.about;
  return (
    <section id="about" className="relative py-24 md:py-40">
      <div className="shell">
        <SectionHeader index="01" label={a.label} title={a.label} />

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-9 md:col-start-4">
            <ScrollStatement text={a.statement} />
          </div>
        </div>

        <div className="mt-20 grid gap-14 md:mt-32 md:grid-cols-12 md:gap-6">
          {/* Profil kartı */}
          <Reveal className="md:col-span-4">
            <div className="card dot-grid p-6 md:p-8">
              <p className="label mb-6">{a.profileTitle}</p>
              <dl className="divide-y divide-line">
                {a.profile.map((row) => (
                  <div key={row.k} className="grid grid-cols-[6.5rem_1fr] gap-4 py-4 text-sm">
                    <dt className="font-mono text-xs uppercase tracking-wider text-mute">{row.k}</dt>
                    <dd className="text-bone">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Yaklaşım */}
          <div className="md:col-span-7 md:col-start-6">
            <Reveal>
              <p className="label mb-8">{a.approachTitle}</p>
            </Reveal>
            <ol className="border-t border-line">
              {a.approach.map((item, i) => (
                <Reveal as="li" key={item.title} delay={i * 0.08} className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-7 md:grid-cols-[4rem_1fr_1.3fr] md:gap-8">
                  <span className="font-mono text-sm text-acid">0{i + 1}</span>
                  <h3 className="font-display text-xl font-medium tracking-tight transition-transform duration-500 ease-expo group-hover:translate-x-2 md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="col-start-2 text-sm leading-relaxed text-mute md:col-start-3 md:text-base">{item.text}</p>
                </Reveal>
              ))}
            </ol>

            <Reveal className="mt-14">
              <p className="label mb-5">{a.interestsTitle}</p>
              <ul className="flex flex-wrap gap-2">
                {a.interests.map((it) => (
                  <li
                    key={it}
                    className="rounded-full border border-line-2 px-4 py-2 text-sm text-bone-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-acid hover:text-acid"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
