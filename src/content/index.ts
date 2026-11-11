import { en } from "./en";
import { tr } from "./tr";
import type { Content, Locale } from "./types";

export const content: Record<Locale, Content> = { tr, en };
export const defaultLocale: Locale = "tr";
export const locales: Locale[] = ["tr", "en"];
export * from "./types";
