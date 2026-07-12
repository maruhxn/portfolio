"use client";

import { useState } from "react";
import { profile } from "@/content/profile";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Contact</h2>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-muted">연락은 이메일로 부탁드립니다.</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <a href={`mailto:${profile.email}`} className="text-lg font-semibold text-accent hover:underline">{profile.email}</a>
          <button type="button" onClick={copy}
            className="rounded-md border border-border px-3 py-1 text-xs transition hover:bg-background">
            {copied ? "복사됨!" : "복사"}
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <a href={profile.socials.github} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground">GitHub</a>
          <a href={profile.socials.blog} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground">Blog</a>
        </div>
      </div>
      <footer className="mt-16 border-t border-border pt-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} 고지완 · Ko Ji Wan
      </footer>
    </section>
  );
}
