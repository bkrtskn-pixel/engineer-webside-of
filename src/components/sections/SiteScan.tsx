"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe } from "lucide-react";
import { useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { EASE } from "@/lib/motion";
import { useLocale } from "@/lib/providers";
import { cn } from "@/lib/utils";
import { Eye } from "../ui/Eye";

/** Girilen adresi https://… biçimine getirir; geçersizse null */
function normalizeUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withProto);
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(u.hostname)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

/**
 * "Web sitemi tarayın" alanı: ziyaretçi site linkini bırakır.
 * site.formEndpoint varsa oraya gönderir; yoksa linki içeren hazır bir e-posta açar.
 */
export function SiteScan({ className }: { className?: string }) {
  const { t } = useLocale();
  const s = t.scan;
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = normalizeUrl(value);
    if (!url) {
      setError(s.invalid);
      return;
    }
    setError("");
    setState("scanning");
    // kısa tarama animasyonu
    await new Promise((r) => window.setTimeout(r, 1100));

    const endpoint: string = site.formEndpoint;
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ type: "website-review", url }),
        });
      } catch {
        /* e-posta yedeğine düş */
      }
    }
    if (!endpoint) {
      const host = new URL(url).hostname;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`${s.subject}: ${host}`)}&body=${encodeURIComponent(`${s.body}${url}\n`)}`;
    }
    setState("done");
  };

  return (
    <div className={className}>
      <p className="label mb-3 flex items-center gap-2">
        <span className="size-1.5 animate-pulse-dot rounded-full bg-acid" />
        {s.label}
      </p>
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE }}
            role="status"
            className="flex items-start gap-3 rounded-3xl border border-acid/40 bg-acid/[0.06] p-4"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-acid text-ink">
              <Check className="size-4" />
            </span>
            <div className="text-sm">
              <p className="font-medium text-bone">{s.doneTitle}</p>
              <p className="mt-1 text-mute">{s.doneText}</p>
              <button
                type="button"
                onClick={() => {
                  setState("idle");
                  setValue("");
                }}
                className="mt-2 text-acid underline-offset-4 hover:underline"
              >
                {s.again}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="scan-url" className="sr-only">
              {s.placeholder}
            </label>
            <div
              className={cn(
                "relative flex h-14 flex-1 items-center gap-3 overflow-hidden rounded-full border bg-ink-2/80 pl-5 pr-4 backdrop-blur transition-colors duration-300 focus-within:border-acid",
                error ? "border-red-400/70" : "border-line-2",
              )}
            >
              <Globe className="size-4 shrink-0 text-mute" />
              <input
                id="scan-url"
                type="text"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                placeholder={s.placeholder}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError("");
                }}
                disabled={state === "scanning"}
                aria-invalid={!!error}
                aria-describedby={error ? "scan-err" : undefined}
                className="w-full min-w-0 bg-transparent text-[0.95rem] text-bone outline-none placeholder:text-dim"
              />
              {/* tarama ışını */}
              {state === "scanning" && (
                <motion.span
                  aria-hidden
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-acid/40 to-transparent"
                  initial={{ left: "-6rem" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 0.9, ease: "easeInOut", repeat: Infinity }}
                />
              )}
            </div>
            <button
              type="submit"
              disabled={state === "scanning"}
              data-cursor="hover"
              className="group relative inline-flex h-14 shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-acid pl-3 pr-6 font-medium text-ink disabled:cursor-wait"
            >
              <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-bone transition-transform duration-500 ease-expo group-hover:scale-x-100" />
              <Eye
                scanning={state === "scanning"}
                className="relative size-8 shrink-0 transition-transform duration-500 ease-expo group-hover:scale-110"
              />
              <span className="relative whitespace-nowrap text-[0.95rem]">{state === "scanning" ? s.scanning : s.button}</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {error && (
        <p id="scan-err" className="mt-2 pl-5 text-xs text-red-300/90">
          {error}
        </p>
      )}
    </div>
  );
}
