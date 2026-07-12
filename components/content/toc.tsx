"use client";

import { slugify } from "@/lib/slug";

export function Toc({ headings }: { headings: string[] }) {
  if (headings.length === 0) return null;
  return (
    <nav className="mb-10 rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">목차</p>
      <ul className="mt-3 space-y-2">
        {headings.map((h) => (
          <li key={h}>
            <a href={`#${slugify(h)}`} className="text-sm text-foreground/80 transition hover:text-accent">{h}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
