import { profile } from "@/content/profile";

export function Blog() {
  return (
    <section id="blog" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Blog</h2>
      <a href={profile.socials.blog} target="_blank" rel="noreferrer"
        className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition hover:border-accent hover:shadow-sm">
        <div>
          <p className="text-lg font-semibold">기술 블로그</p>
          <p className="mt-1 text-sm text-muted">{profile.socials.blog}</p>
        </div>
        <span className="text-accent">→</span>
      </a>
    </section>
  );
}
