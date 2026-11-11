import { cn } from "@/lib/utils";

/** CSS tabanlı sonsuz kayan şerit — JS maliyeti yok */
export function Marquee({
  items,
  duration = 40,
  reverse,
  className,
  separator = "✦",
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
  className?: string;
  separator?: string;
}) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center">
          <span className="px-6 md:px-10">{item}</span>
          <span className="text-acid text-[0.5em]">{separator}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("group flex overflow-hidden", className)}>
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
