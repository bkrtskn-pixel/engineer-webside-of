"use client";

import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { site } from "@/config/site";
import { useLocale } from "@/lib/providers";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { MaskLine, Reveal } from "../ui/Reveal";
import { ContactForm } from "./ContactForm";
import { RepelText } from "../ui/RepelText";

export function Contact() {
  const { t } = useLocale();
  const c = t.contact;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const linkedin: string = site.socials.linkedin;
  const channels = [
    { label: "E-mail", value: site.email, href: `mailto:${site.email}`, icon: <Mail className="size-5" />, external: false },
    ...(site.phone.href
      ? [{ label: "Phone", value: site.phone.display, href: `tel:${site.phone.href}`, icon: <Phone className="size-5" />, external: false }]
      : []),
    { label: "GitHub", value: `@${site.socials.githubHandle}`, href: site.socials.github, icon: <GithubIcon className="size-5" />, external: true },
    ...(linkedin
      ? [{ label: "LinkedIn", value: linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: linkedin, icon: <LinkedinIcon className="size-5" />, external: true }]
      : []),
  ];

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-40">
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="shell">
        <div className="label flex items-center gap-3 border-t border-line pt-6">
          <span className="text-acid">(05)</span>
          <span className="h-px w-8 bg-line-2" />
          <span>{c.label}</span>
        </div>

        <h2 className="display mt-10 text-[clamp(3rem,10.5vw,10rem)] text-bone">
          <MaskLine>
            <RepelText text={c.titleA} force={0.5} tint />
          </MaskLine>
          <MaskLine delay={0.1} className="text-outline">
            <RepelText text={c.titleB} force={0.5} />
          </MaskLine>
        </h2>

        {/* Büyük e-posta satırı */}
        <Reveal className="mt-12 flex flex-col gap-4 border-y border-line py-6 sm:flex-row sm:items-center sm:justify-between md:mt-16">
          <a href={`mailto:${site.email}`} className="group inline-flex items-center gap-4 font-display text-[clamp(1.4rem,4vw,3.2rem)] font-medium tracking-tight">
            <span className="relative">
              {site.email}
              <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-right scale-x-0 bg-acid transition-transform duration-700 ease-expo group-hover:origin-left group-hover:scale-x-100" />
            </span>
            <ArrowUpRight className="size-[0.8em] text-acid transition-transform duration-500 ease-expo group-hover:rotate-45" />
          </a>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-11 items-center gap-2 self-start rounded-full border border-line-2 px-4 text-sm text-bone-2 transition-colors hover:border-acid hover:text-acid sm:self-auto"
            aria-live="polite"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? t.ui.copied : t.ui.copy}
          </button>
        </Reveal>

        <div className="mt-16 grid gap-16 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-4">
            <Reveal>
              <p className="max-w-sm text-base leading-relaxed text-mute">{c.intro}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <p className="label mb-4">{c.channels}</p>
              <ul className="border-t border-line">
                {channels.map((ch) => (
                  <li key={ch.label} className="border-b border-line">
                    <a
                      href={ch.href}
                      {...(ch.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center justify-between gap-4 py-4"
                    >
                      <span className="flex items-center gap-4">
                        <span className="grid size-11 place-items-center rounded-full border border-line-2 text-bone-2 transition-all duration-500 ease-expo group-hover:border-acid group-hover:bg-acid group-hover:text-ink">
                          {ch.icon}
                        </span>
                        <span>
                          <span lang="en" className="block font-mono text-[0.65rem] uppercase tracking-wider text-mute">{ch.label}</span>
                          <span className="block text-sm text-bone transition-colors group-hover:text-acid">{ch.value}</span>
                        </span>
                      </span>
                      <ArrowUpRight className="size-4 text-mute transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:text-acid" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex items-center gap-2 text-sm text-mute">
                <MapPin className="size-4 text-acid" /> {site.location.city}, {site.location.country}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="md:col-span-7 md:col-start-6">
            <div className="card p-6 md:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
