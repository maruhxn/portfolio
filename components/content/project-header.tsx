import Link from "next/link";

export function ProjectHeader({ title, period }: { title: string; period: string }) {
  return (
    <header className="mb-10">
      <Link href="/#projects" className="text-sm text-muted transition hover:text-foreground">← 목록으로</Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-2 inline-block rounded-md border border-border bg-card px-3 py-1 text-sm text-muted">{period}</p>
    </header>
  );
}
