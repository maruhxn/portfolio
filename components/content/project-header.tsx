import Link from "next/link";

export function ProjectHeader({ title }: { title: string }) {
  return (
    <header className="mb-10">
      <Link href="/#projects" className="text-sm text-muted transition hover:text-foreground">← 목록으로</Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
    </header>
  );
}
