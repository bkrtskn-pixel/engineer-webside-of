"use client";

import { MaskLine, Reveal } from "./Reveal";
import { RepelText } from "./RepelText";

interface Props {
  index: string;
  label: string;
  title: string;
  intro?: string;
  aside?: React.ReactNode;
}

/** Bölüm başlığı: (01) — ETİKET · büyük başlık · kısa açıklama */
export function SectionHeader({ index, label, title, intro, aside }: Props) {
  return (
    <header className="grid gap-8 border-t border-line pt-6 md:grid-cols-12 md:gap-6">
      <Reveal className="label flex items-center gap-3 md:col-span-3">
        <span className="text-acid">({index})</span>
        <span className="h-px w-8 bg-line-2" />
        <span>{label}</span>
      </Reveal>
      <div className="md:col-span-9">
        <h2 className="h-section text-bone">
          <MaskLine>
            <RepelText text={title} tint />
          </MaskLine>
        </h2>
        {(intro || aside) && (
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {intro && (
              <Reveal delay={0.1} className="max-w-xl text-base leading-relaxed text-mute md:text-lg">
                {intro}
              </Reveal>
            )}
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
