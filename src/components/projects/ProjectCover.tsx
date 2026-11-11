import type { CoverVariant } from "@/content";
import { cn } from "@/lib/utils";

/**
 * Proje kapakları: görsel dosya yerine kodla çizilmiş arayüz kompozisyonları.
 * Hafif, keskin (vektörel) ve her proje için ayırt edici.
 * Gerçek ekran görüntüsü eklemek için bunun yerine <img> kullanabilirsiniz.
 */
export function ProjectCover({ variant, className }: { variant: CoverVariant; className?: string }) {
  return (
    <div lang="en" className={cn("relative h-full w-full overflow-hidden bg-ink-3", className)}>
      <div aria-hidden className="dot-grid absolute inset-0 opacity-60" />
      {variant === "workflow" && <Workflow />}
      {variant === "query" && <Query />}
      {variant === "schema" && <Schema />}
      {variant === "assistant" && <Assistant />}
    </div>
  );
}

function Window({ children, className, title }: { children: React.ReactNode; className?: string; title?: string }) {
  return (
    <div className={cn("absolute overflow-hidden rounded-xl border border-line-2 bg-ink-2 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]", className)}>
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <span className="size-2 rounded-full bg-ink-4" />
        <span className="size-2 rounded-full bg-ink-4" />
        <span className="size-2 rounded-full bg-ink-4" />
        {title && <span className="ml-2 font-mono text-[9px] uppercase tracking-wider text-mute">{title}</span>}
      </div>
      {children}
    </div>
  );
}

function Workflow() {
  const steps = ["REQUEST", "DEPT", "MANAGER", "DONE"];
  return (
    <>
      <div className="absolute inset-x-[8%] top-[16%] flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div
              className={cn(
                "grid place-items-center rounded-lg border px-2 py-2 font-mono text-[8px] tracking-wider sm:px-3 sm:text-[10px]",
                i < 2 ? "border-acid bg-acid text-ink" : i === 2 ? "border-acid text-acid" : "border-line-2 text-mute",
              )}
            >
              {s}
            </div>
            {i < steps.length - 1 && <div className={cn("mx-1 h-px flex-1", i < 2 ? "bg-acid" : "bg-line-2")} />}
          </div>
        ))}
      </div>
      <Window title="requests.xhtml" className="inset-x-[8%] bottom-[-6%] top-[34%] transition-transform duration-700 ease-expo group-hover:-translate-y-2">
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-x-3 px-4 py-3 font-mono text-[8px] uppercase tracking-wider text-mute sm:text-[9px]">
          <span>ID</span>
          <span>Title</span>
          <span>Step</span>
          <span>Status</span>
        </div>
        {[
          ["#1042", "Leave request", "2/4", "acid"],
          ["#1043", "Purchase order", "3/4", "amber"],
          ["#1044", "System access", "4/4", "acid"],
          ["#1045", "Equipment", "1/4", "mute"],
        ].map(([id, title, step, tone]) => (
          <div key={id} className="grid grid-cols-[1fr_2fr_1fr_1fr] items-center gap-x-3 border-t border-line px-4 py-2.5 text-[9px] text-bone-2 sm:text-[11px]">
            <span className="font-mono text-mute">{id}</span>
            <span className="truncate">{title}</span>
            <span className="font-mono">{step}</span>
            <span
              className={cn(
                "h-1.5 w-8 rounded-full sm:w-12",
                tone === "acid" ? "bg-acid" : tone === "amber" ? "bg-amber-300/70" : "bg-ink-4",
              )}
            />
          </div>
        ))}
      </Window>
    </>
  );
}

function Query() {
  const bars = [38, 64, 46, 92, 58, 30, 74, 52, 40, 86, 34, 60];
  return (
    <>
      <Window title="top_sql" className="left-[7%] right-[30%] top-[12%] bottom-[12%] transition-transform duration-700 ease-expo group-hover:-translate-x-1">
        <div className="flex h-[calc(100%-2rem)] items-end gap-[3%] px-4 pb-4 pt-6">
          {bars.map((h, i) => (
            <div
              key={i}
              className={cn("flex-1 rounded-t-sm transition-all duration-700 ease-expo", i === 3 || i === 9 ? "bg-acid" : "bg-ink-4 group-hover:bg-bone/20")}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </Window>
      <Window title="plan" className="bottom-[20%] right-[6%] top-[28%] w-[36%] transition-transform duration-700 ease-expo group-hover:translate-x-1 group-hover:-translate-y-2">
        <div className="space-y-2 p-3 font-mono text-[8px] text-bone-2 sm:text-[10px]">
          <p>SELECT STATEMENT</p>
          <p className="pl-2 text-mute">└ SORT ORDER BY</p>
          <p className="pl-4 text-acid">└ TABLE ACCESS FULL</p>
          <p className="pl-6 text-mute">└ INDEX RANGE SCAN</p>
          <p className="mt-3 inline-block rounded bg-acid/15 px-1.5 py-0.5 text-acid">+ idx_req_dept</p>
        </div>
      </Window>
    </>
  );
}

function Schema() {
  const tables = [
    { name: "USERS", x: "8%", y: "14%", cols: ["id PK", "dept_id FK", "email"] },
    { name: "DEPARTMENTS", x: "60%", y: "10%", cols: ["id PK", "name"] },
    { name: "REQUESTS", x: "34%", y: "52%", cols: ["id PK", "user_id FK", "status", "created_at"] },
  ];
  return (
    <>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
        <path d="M30 30 C 45 30, 45 20, 60 20" stroke="rgb(210 255 58)" strokeWidth="0.4" fill="none" vectorEffect="non-scaling-stroke" strokeDasharray="2 2" />
        <path d="M20 42 C 20 62, 30 66, 34 66" stroke="rgb(255 255 255 / 0.3)" strokeWidth="0.4" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      {tables.map((tb, i) => (
        <div
          key={tb.name}
          className="absolute w-[30%] min-w-[7.5rem] overflow-hidden rounded-lg border border-line-2 bg-ink-2 transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
          style={{ left: tb.x, top: tb.y, transitionDelay: `${i * 60}ms` }}
        >
          <div className={cn("px-3 py-1.5 font-mono text-[8px] font-semibold tracking-wider sm:text-[10px]", i === 2 ? "bg-acid text-ink" : "bg-ink-4 text-bone")}>
            {tb.name}
          </div>
          {tb.cols.map((c) => (
            <div key={c} className="flex justify-between border-t border-line px-3 py-1 font-mono text-[8px] text-bone-2 sm:text-[9px]">
              <span>{c.split(" ")[0]}</span>
              <span className="text-mute">{c.split(" ")[1] ?? ""}</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function Assistant() {
  return (
    <>
      <Window title="PR #128 · review" className="inset-x-[7%] top-[12%] bottom-[16%] transition-transform duration-700 ease-expo group-hover:-translate-y-1">
        <div className="font-mono text-[8px] leading-5 sm:text-[10px]">
          <p className="px-4 pt-2 text-mute">@@ RequestService.java</p>
          <p className="bg-red-400/10 px-4 text-red-300/80">- if (req.getStatus() == "OK") {"{"}</p>
          <p className="bg-acid/10 px-4 text-acid">+ if (Status.OK.equals(req.getStatus())) {"{"}</p>
          <p className="px-4 text-bone-2">{"    approve(req);"}</p>
          <p className="px-4 text-bone-2">{"}"}</p>
        </div>
      </Window>
      <div className="absolute bottom-[8%] right-[6%] w-[58%] rounded-xl border border-acid/40 bg-ink p-3 shadow-[0_20px_60px_-20px_rgb(210_255_58/0.35)] transition-transform duration-700 ease-expo group-hover:-translate-y-3 sm:p-4">
        <div className="flex items-center gap-2">
          <span className="grid size-5 place-items-center rounded-md bg-acid font-mono text-[8px] font-bold text-ink">AI</span>
          <span className="font-mono text-[8px] uppercase tracking-wider text-acid sm:text-[9px]">Suggestion · low risk</span>
        </div>
        <p className="mt-2 text-[9px] leading-relaxed text-bone-2 sm:text-[11px]">
          String comparison with == replaced by equals(). Consider adding a unit test for the PENDING case.
        </p>
      </div>
    </>
  );
}
