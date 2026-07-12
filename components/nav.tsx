"use client";

import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#hero" className="font-semibold tracking-tight">고지완&apos;s portfolio</a>
        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted transition hover:text-foreground">{l.label}</a>
          ))}
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button type="button" aria-label="메뉴" aria-expanded={open} aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border">☰</button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col px-6 py-2">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="py-2 text-sm text-muted hover:text-foreground">{l.label}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
