import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { content, defaultLocale } from "@/content";

const items = content[defaultLocale].projects.items;

export const dynamicParams = false;

export function generateStaticParams() {
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = items.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `./` },
    openGraph: { title: p.title, description: p.summary, type: "article" },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!items.some((x) => x.slug === slug)) notFound();
  return <ProjectDetail slug={slug} />;
}
