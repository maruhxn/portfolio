import { skillCategories } from "@/content/skills";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Skills</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {skillCategories.map((c) => (
          <div key={c.name} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-accent">{c.name}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.items.map((s) => (
                <li key={s} className="rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground/80">{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
