"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { useIntro, useLocale } from "@/lib/providers";

export default function NotFound() {
  const { t } = useLocale();
  const { finish } = useIntro();
  useEffect(() => finish(), [finish]);
  return (
    <>
      <Navbar />
      <main className="shell flex min-h-[100svh] flex-col justify-center py-32">
        <p className="label text-acid">Error 404</p>
        <h1 className="display mt-6 text-[clamp(6rem,28vw,22rem)] text-outline">404</h1>
        <p className="mt-6 font-display text-3xl font-medium tracking-tight">{t.notFound.title}</p>
        <p className="mt-3 max-w-md text-mute">{t.notFound.text}</p>
        <div className="mt-10">
          <Button href={process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}/` : "/"}>{t.ui.backHome}</Button>
        </div>
      </main>
    </>
  );
}
