export type Locale = "tr" | "en";

export type CoverVariant = "workflow" | "query" | "schema" | "assistant";

export interface Project {
  slug: string;
  index: string;
  title: string;
  category: string;
  year: string;
  /** Gerçek bir iş projesi değilse "concept" kalmalı */
  status: "concept" | "personal" | "professional";
  summary: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  tech: string[];
  cover: CoverVariant;
  /** Depo bağlantısı. Boşsa GitHub profiline yönlenir. */
  repo?: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  org: string;
  type: string;
  summary: string;
  responsibilities: string[];
  stack: string[];
  /** true → "düzenlenecek örnek içerik" rozeti gösterilir */
  placeholder: boolean;
}

export interface SkillGroup {
  id: "backend" | "database" | "web" | "tools" | "ai";
  title: string;
  caption: string;
  items: { name: string; mark: string; note?: string }[];
}

export interface Content {
  meta: { title: string; description: string };
  nav: { label: string; href: string }[];
  ui: {
    menu: string;
    close: string;
    letsTalk: string;
    localTime: string;
    openToWork: string;
    scroll: string;
    sampleBadge: string;
    conceptBadge: string;
    viewDetails: string;
    viewProject: string;
    sourceCode: string;
    backHome: string;
    allProjects: string;
    nextProject: string;
    copy: string;
    copied: string;
    backToTop: string;
    editableNote: string;
  };
  hero: {
    /** Ana sayfadaki dev slogan — iki satır, büyük harf */
    slogan: [string, string];
    eyebrow: string;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    rotating: string[];
  };
  scan: {
    label: string;
    placeholder: string;
    button: string;
    scanning: string;
    invalid: string;
    doneTitle: string;
    doneText: string;
    again: string;
    subject: string;
    body: string;
  };
  marquee: string[];
  about: {
    label: string;
    statement: string;
    approachTitle: string;
    approach: { title: string; text: string }[];
    interestsTitle: string;
    interests: string[];
    profileTitle: string;
    profile: { k: string; v: string }[];
  };
  skills: {
    label: string;
    title: string;
    intro: string;
    groups: SkillGroup[];
    aiUseCasesTitle: string;
    aiUseCases: { title: string; text: string }[];
    aiNote: string;
  };
  projects: {
    label: string;
    title: string;
    intro: string;
    disclaimer: string;
    items: Project[];
    detail: {
      overview: string;
      problem: string;
      solution: string;
      features: string;
      stack: string;
      conceptNote: string;
    };
  };
  experience: {
    label: string;
    title: string;
    intro: string;
    items: ExperienceItem[];
  };
  contact: {
    label: string;
    titleA: string;
    titleB: string;
    intro: string;
    channels: string;
    form: {
      name: string;
      email: string;
      subject: string;
      message: string;
      submit: string;
      sending: string;
      successTitle: string;
      successText: string;
      mailtoText: string;
      errorText: string;
      required: string;
      invalidEmail: string;
      again: string;
    };
  };
  footer: { tagline: string; built: string; rights: string };
  notFound: { title: string; text: string };
}
