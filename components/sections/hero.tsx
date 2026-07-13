import Image from "next/image";
import { profile } from "@/content/profile";
import { EmailButton } from "@/components/email-button";

export function Hero() {
  return (
    <section id="hero" className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 pt-32 pb-20 md:flex-row md:items-center md:gap-16">
      <div className="shrink-0">
        <Image src={profile.photo} alt={profile.nameKo} width={200} height={250}
          className="rounded-2xl border border-border object-cover shadow-sm" priority />
      </div>
      <div className="text-center md:text-left">
        <p className="text-sm font-medium text-accent">{profile.title}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          {profile.nameKo} <span className="text-muted">· {profile.nameEn}</span>
        </h1>
        <div className="mt-5 max-w-xl space-y-3 leading-relaxed text-muted">
          {profile.intro.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <div className="mt-4 space-y-1.5 text-sm text-muted">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:justify-start">
            <span>
              🏢 <span className="font-medium text-foreground">{profile.career.company}</span>{" "}
              {profile.career.period}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              재직 중
            </span>
          </p>
          <p>
            🎓 {profile.education.school} {profile.education.major}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
          <a href={profile.socials.github} target="_blank" rel="noreferrer"
            className="rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-card">GitHub</a>
          <a href={profile.socials.blog} target="_blank" rel="noreferrer"
            className="rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-card">Blog</a>
          <EmailButton email={profile.email}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90" />
        </div>
      </div>
    </section>
  );
}
