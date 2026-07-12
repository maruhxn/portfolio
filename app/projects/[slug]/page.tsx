import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { PROJECTS } from "@/content/projects";
import { Markdown } from "@/components/content/markdown";
import { ProjectHeader } from "@/components/content/project-header";
import { Toc } from "@/components/content/toc";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  return { title: project ? `${project.title} | 고지완` : "프로젝트" };
}

function readBody(slug: string): string {
  return fs.readFileSync(path.join(process.cwd(), "content/projects", `${slug}.md`), "utf8");
}

function topLevelHeadings(md: string): string[] {
  return md
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace(/^##\s+/, "").trim());
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();
  const body = readBody(slug);
  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-24">
      <ProjectHeader title={project.title} period={project.period} />
      <Toc headings={topLevelHeadings(body)} />
      <Markdown>{body}</Markdown>
      <div className="mt-16 border-t border-border pt-8">
        <Link href="/#projects" className="text-sm text-accent hover:underline">← 프로젝트 목록으로</Link>
      </div>
    </main>
  );
}
