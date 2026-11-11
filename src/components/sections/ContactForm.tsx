"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { EASE } from "@/lib/motion";
import { useLocale } from "@/lib/providers";
import { cn } from "@/lib/utils";

type Fields = { name: string; email: string; subject: string; message: string };
type Status = "idle" | "sending" | "sent" | "mailto" | "error";
const EMPTY: Fields = { name: "", email: "", subject: "", message: "" };

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  textarea,
  autoComplete,
}: {
  id: keyof Fields;
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const base =
    "peer w-full border-0 border-b bg-transparent px-0 pb-3 pt-7 text-lg text-bone outline-none transition-colors duration-300 placeholder:text-transparent focus:border-acid";
  return (
    <div className="relative">
      {textarea ? (
        <textarea id={id} name={id} rows={4} placeholder={label} value={value} onChange={(e) => onChange(e.target.value)} className={cn(base, "resize-none", error ? "border-red-400/70" : "border-line-2")} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
      ) : (
        <input id={id} name={id} type={type} placeholder={label} autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)} className={cn(base, error ? "border-red-400/70" : "border-line-2")} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-1 font-mono text-[0.68rem] uppercase tracking-wider text-mute transition-all duration-300 peer-placeholder-shown:top-7 peer-placeholder-shown:font-sans peer-placeholder-shown:text-lg peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1 peer-focus:font-mono peer-focus:text-[0.68rem] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-acid"
      >
        {label}
      </label>
      {error && (
        <p id={`${id}-err`} className="mt-2 text-xs text-red-300/90">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * İletişim formu. site.formEndpoint tanımlıysa (ör. Formspree) oraya POST eder;
 * değilse doldurulmuş bir mailto: bağlantısıyla ziyaretçinin e-posta uygulamasını açar.
 */
export function ContactForm() {
  const { t } = useLocale();
  const f = t.contact.form;
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (k: keyof Fields) => (v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Fields> = {};
    if (!values.name.trim()) e.name = f.required;
    if (!values.email.trim()) e.email = f.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = f.invalidEmail;
    if (!values.message.trim()) e.message = f.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!validate()) return;
    const endpoint: string = site.formEndpoint;
    if (endpoint) {
      setStatus("sending");
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(values),
        });
        setStatus(res.ok ? "sent" : "error");
        if (res.ok) setValues(EMPTY);
      } catch {
        setStatus("error");
      }
      return;
    }
    const subject = values.subject.trim() || `Portfolio — ${values.name}`;
    const body = `${values.message}\n\n— ${values.name} <${values.email}>`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("mailto");
  };

  const done = status === "sent" || status === "mailto";

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex min-h-[24rem] flex-col items-start justify-center gap-5"
            role="status"
          >
            <span className="grid size-14 place-items-center rounded-full bg-acid text-ink">
              <Check className="size-6" />
            </span>
            <p className="font-display text-3xl font-medium tracking-tight">{f.successTitle}</p>
            <p className="max-w-sm text-mute">{status === "mailto" ? f.mailtoText : f.successText}</p>
            <button type="button" onClick={() => setStatus("idle")} className="text-sm text-acid underline-offset-4 hover:underline">
              {f.again}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="name" label={f.name} value={values.name} error={errors.name} onChange={set("name")} autoComplete="name" />
              <Field id="email" type="email" label={f.email} value={values.email} error={errors.email} onChange={set("email")} autoComplete="email" />
            </div>
            <Field id="subject" label={f.subject} value={values.subject} onChange={set("subject")} />
            <Field id="message" label={f.message} value={values.message} error={errors.message} onChange={set("message")} textarea />
            {status === "error" && <p className="text-sm text-red-300/90">{f.errorText}</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="group relative mt-2 inline-flex h-16 items-center justify-between overflow-hidden rounded-full bg-acid pl-7 pr-2 text-ink disabled:opacity-60 sm:w-72"
            >
              <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-bone transition-transform duration-500 ease-expo group-hover:scale-x-100" />
              <span className="relative font-medium">{status === "sending" ? f.sending : f.submit}</span>
              <span className="relative grid size-12 place-items-center rounded-full bg-ink text-acid transition-transform duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-rotate-12">
                <Send className="size-4" />
              </span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
