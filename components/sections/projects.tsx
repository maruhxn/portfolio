import Link from "next/link";
import { PROJECTS } from "@/content/projects";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Projects</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-accent hover:shadow-sm">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight group-hover:text-accent">{p.title}</h3>
            </div>
            <p className="mt-1 text-xs text-muted">{p.period}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">{p.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <li key={t} className="rounded-md bg-background px-2 py-1 text-xs text-muted">#{t}</li>
              ))}
            </ul>
            <span className="mt-4 text-sm font-medium text-accent">자세히 보기 →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
