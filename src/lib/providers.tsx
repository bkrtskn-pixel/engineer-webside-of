"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { content, defaultLocale, type Content, type Locale } from "@/content";

/* ── Dil ─────────────────────────────────────────────── */
interface LocaleCtx {
  locale: Locale;
  t: Content;
  setLocale: (l: Locale) => void;
  toggle: () => void;
}
const LocaleContext = createContext<LocaleCtx | null>(null);
const STORAGE_KEY = "bt-locale";

/* ── Giriş (preloader) ───────────────────────────────── */
interface IntroCtx {
  /** Preloader bitti mi? Hero animasyonları bunu bekler. */
  ready: boolean;
  finish: () => void;
}
const IntroContext = createContext<IntroCtx | null>(null);

export function Providers({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "tr" || saved === "en") setLocaleState(saved);
    } catch {
      /* depolama kapalı olabilir */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = content[locale].meta.title;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* yoksay */
    }
  }, []);

  const localeValue = useMemo<LocaleCtx>(
    () => ({ locale, t: content[locale], setLocale, toggle: () => setLocale(locale === "tr" ? "en" : "tr") }),
    [locale, setLocale],
  );
  const introValue = useMemo<IntroCtx>(() => ({ ready, finish: () => setReady(true) }), [ready]);

  return (
    <MotionConfig reducedMotion="user">
      <LocaleContext.Provider value={localeValue}>
        <IntroContext.Provider value={introValue}>{children}</IntroContext.Provider>
      </LocaleContext.Provider>
    </MotionConfig>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <Providers>");
  return ctx;
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used inside <Providers>");
  return ctx;
}
