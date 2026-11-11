"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "../ui/Reveal";
import { SectionHeader } from "../ui/SectionHeader";
import { useLocale } from "@/lib/providers";

/** Deterministik sözde-rastgele (sunucu/istemci aynı sonucu üretsin) */
function rnd(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Tek harf: dağınık konumdan kaydırmayla yerine uçar */
function Letter({
  ch,
  i,
  progress,
  range,
  spread,
}: {
  ch: string;
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  spread: number;
}) {
  // Sırayla sağdan / soldan; mesafe, yükseklik ve dönüş rastgele
  const side = rnd(i, 1) > 0.5 ? 1 : -1;
  const fromX = side * (0.25 + rnd(i, 2) * 0.75) * spread;
  const fromY = (rnd(i, 3) - 0.5) * 360;
  const fromR = (rnd(i, 4) - 0.5) * 140;
  const x = useTransform(progress, range, [fromX, 0]);
  const y = useTransform(progress, range, [fromY, 0]);
  const rotate = useTransform(progress, range, [fromR, 0]);
  const opacity = useTransform(progress, [range[0], range[0] + (range[1] - range[0]) * 0.4, range[1]], [0, 0.55, 1]);
  return (
    <motion.span className="inline-block will-change-transform" style={{ x, y, rotate, opacity }}>
      {ch}
    </motion.span>
  );
}

/** Kaydırdıkça sağdan soldan toplanıp düzene giren paragraf */
function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 1", "center 0.5"] });
  // Dağılma mesafesi ekran genişliğine göre (mobilde daha kısa)
  const [spread, setSpread] = useState(700);
  useEffect(() => {
    const update = () => setSpread(Math.min(window.innerWidth * 0.6, 900));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const words = text.split(" ");
  const total = text.replace(/ /g, "").length;
  let n = 0;
  return (
    <p ref={ref} className="font-display text-[clamp(1.75rem,4.2vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.03em] text-bone">
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, wi) => (
          <span key={wi} className="mr-[0.25em] inline-block whitespace-nowrap">
            {w.split("").map((ch) => {
              const i = n++;
              // Harfler sırayla ama üst üste binen aralıklarla toplanır
              const start = (i / total) * 0.55;
              return <Letter key={i} ch={ch} i={i} progress={scrollYProgress} range={[start, start + 0.45]} spread={spread} />;
            })}
          </span>
        ))}
      </span>
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
