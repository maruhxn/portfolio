# 포트폴리오 웹사이트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 고지완의 백엔드 프로젝트 경험(노션 4종)을 담은 정적 포트폴리오 사이트를 Next.js로 만들어 Vercel에 배포한다.

**Architecture:** App Router 단일 페이지(Hero→Skills→Projects→Blog→Contact) + 4개 프로젝트 상세 페이지(SSG). 노션 내용은 빌드타임에 로컬 마크다운 파일로 복사해 두고, `react-markdown`(+remark-gfm/rehype-raw)로 렌더링한다. Mermaid는 클라이언트에서 렌더. 외부 런타임 의존(노션 API·이메일 서비스·백엔드) 없음.

**Tech Stack:** Next.js 16(App Router, TypeScript), Tailwind CSS v4, `@tailwindcss/typography`, `next-themes`, `mermaid`, `react-markdown`, `remark-gfm`, `rehype-raw`, `rehype-slug`, `github-slugger`, `pretendard`.

> **테스트 코드는 작성하지 않는다(사용자 요청).** 각 태스크 검증은 `npm run build` / `npx tsc --noEmit` / `npm run lint` / dev 서버 육안 확인으로 대체한다.

---

## File Structure

```
portfolio-web/
  app/
    layout.tsx                 # 폰트, ThemeProvider, 전역 메타데이터
    page.tsx                   # 메인 (섹션 조립)
    globals.css                # Tailwind v4 + typography + 테마 토큰
    projects/[slug]/page.tsx   # 상세 페이지 (SSG, md 파일 읽어 렌더)
  components/
    theme-provider.tsx         # 'use client' next-themes wrapper
    theme-toggle.tsx           # 'use client' 라이트/다크 토글
    nav.tsx                    # 'use client' 고정 헤더 + 스무스 스크롤 + 모바일 메뉴
    sections/
      hero.tsx
      skills.tsx
      projects.tsx             # 프로젝트 카드 그리드
      blog.tsx
      contact.tsx
    content/
      markdown.tsx             # 'use client' react-markdown 렌더러
      mermaid.tsx              # 'use client' Mermaid 렌더러
      project-header.tsx       # 상세 페이지 헤더(제목/기간/개요)
      toc.tsx                  # 'use client' 목차
  content/
    profile.ts                 # 이름/타이틀/소개/학력/소셜
    skills.ts                  # 4개 카테고리
    projects.ts                # 프로젝트 카드 메타 + slug 목록
    projects/
      eventmaker.md
      qmoney-expiration.md
      wallet.md
      opensearch.md
  lib/
    slug.ts                    # github-slugger 래퍼 (TOC ↔ rehype-slug 일치)
  public/
    profile.jpeg
    projects/
      eventmaker/img-1.png ... img-4.png
      qmoney-expiration/img-1.png
  README.md
```

각 파일은 단일 책임을 갖는다. 섹션 컴포넌트는 화면 조각, `content/*`는 데이터, `components/content/*`는 렌더링 프리미티브.

---

## Task 1: Next.js 프로젝트 스캐폴딩 + 의존성 설치

**Files:**
- Create: 프로젝트 전체(create-next-app 산출물)

- [ ] **Step 1: create-next-app 실행**

기존 `portfolio-web/`에는 `.git`과 `docs/`만 있다(둘 다 create-next-app 허용 목록). 그 자리에 스캐폴딩한다.

Run:
```bash
cd /Users/maruhxn/aswemake
npx create-next-app@latest portfolio-web \
  --typescript --tailwind --eslint --app --no-src-dir \
  --turbopack --import-alias "@/*" --use-npm --yes
```
Expected: `Success! Created portfolio-web`. `app/`, `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` 생성. 기존 `docs/`는 유지됨.
- 만약 "directory contains files that could conflict"로 실패하면: `mv portfolio-web/docs /tmp/pf-docs-bak` 후 위 명령 재실행, 이어서 `mv /tmp/pf-docs-bak portfolio-web/docs`.

- [ ] **Step 2: 추가 의존성 설치**

Run:
```bash
cd /Users/maruhxn/aswemake/portfolio-web
npm install next-themes mermaid react-markdown remark-gfm rehype-raw rehype-slug github-slugger pretendard
npm install -D @tailwindcss/typography
```
Expected: 설치 성공, `package.json` dependencies에 반영.

- [ ] **Step 3: dev 서버 기동 확인**

Run: `npm run dev` → 브라우저 `http://localhost:3000` 접속 후 기본 Next 페이지 확인 → `Ctrl+C`.
Expected: 에러 없이 렌더.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "chore: Next.js 스캐폴딩 및 의존성 설치"
```

---

## Task 2: 전역 스타일·테마·폰트·레이아웃

**Files:**
- Modify: `app/globals.css`
- Create: `components/theme-provider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: `app/globals.css` 작성 (전체 교체)**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #ffffff;
  --foreground: #18181b;
  --muted: #71717a;
  --card: #fafafa;
  --border: #e4e4e7;
  --accent: #4f46e5;
}
.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  --muted: #a1a1aa;
  --card: #131316;
  --border: #27272a;
  --accent: #818cf8;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-card: var(--card);
  --color-border: var(--border);
  --color-accent: var(--accent);
}

html { scroll-behavior: smooth; }
body {
  background: var(--background);
  color: var(--foreground);
  font-family: "Pretendard Variable", Pretendard, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}
section { scroll-margin-top: 5rem; }
```

- [ ] **Step 2: `components/theme-provider.tsx` 작성**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 3: `app/layout.tsx` 작성 (전체 교체)**

```tsx
import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "고지완 · Ko Ji Wan | Backend Developer",
  description: "백엔드 개발자 고지완의 포트폴리오. 분산 시스템, 결제, 검색 엔진 프로젝트 경험.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: 타입체크 + 커밋**

Run: `npx tsc --noEmit`
Expected: 에러 없음.
```bash
git add -A && git commit -m "feat: 전역 테마·폰트·레이아웃 구성"
```

---

## Task 3: 프로필 사진 + 콘텐츠 데이터

**Files:**
- Create: `public/profile.jpeg` (스크래치패드 백업본 복사)
- Create: `content/profile.ts`, `content/skills.ts`, `content/projects.ts`

- [ ] **Step 1: 프로필 사진 복사**

Run:
```bash
cp "/private/tmp/claude-501/-Users-maruhxn-aswemake-Qmarket-Server/bd13bdf5-cbad-47a9-8d6f-74080e292964/scratchpad/profile.jpeg" \
   /Users/maruhxn/aswemake/portfolio-web/public/profile.jpeg
```
(백업본이 없으면 원본 `~/Downloads/temp_1672039327298.16390069.jpeg` 사용)
Expected: `public/profile.jpeg` 존재.

- [ ] **Step 2: `content/profile.ts` 작성**

```tsx
export const profile = {
  nameKo: "고지완",
  nameEn: "Ko Ji Wan",
  // TODO: 타이틀 세부 문구 확정
  title: "백엔드 개발자",
  // TODO: 자기소개 최종 문구 확정 (아래는 초안)
  intro:
    "분산 환경에서의 데이터 정합성과 장애 격리에 관심이 많은 백엔드 개발자입니다. 결제·정산, 이벤트 리워드, 검색 엔진 등 실패가 곧 사용자 피해로 이어지는 도메인에서 트랜잭션 경계·멱등성·복구 전략을 설계하고 검증해 왔습니다.",
  education: {
    school: "서울과학기술대학교",
    major: "컴퓨터공학과",
  },
  photo: "/profile.jpeg",
  email: "maruhan1016@gmail.com",
  socials: {
    github: "https://github.com/maruhxn",
    blog: "https://mxruhxn.tistory.com/",
  },
} as const;
```

- [ ] **Step 3: `content/skills.ts` 작성**

```tsx
export const skillCategories = [
  { name: "Backend", items: ["Kotlin", "Java", "Spring Boot", "Spring Security", "Spring Batch", "JPA / QueryDSL", "Resilience4j"] },
  { name: "Database", items: ["MySQL", "PostgreSQL", "Redis (Redisson)", "OpenSearch"] },
  { name: "DevOps", items: ["AWS", "NCP", "Docker", "GitHub Actions", "Kubernetes", "Jenkins"] },
  { name: "Tools", items: ["Git", "Datadog", "IntelliJ IDEA", "Notion", "Slack"] },
] as const;
```

- [ ] **Step 4: `content/projects.ts` 작성**

```tsx
export type ProjectMeta = {
  slug: string;
  title: string;
  period: string;
  summary: string;
  tags: string[];
};

export const PROJECTS: ProjectMeta[] = [
  {
    slug: "eventmaker",
    title: "이벤트메이커",
    period: "2025.09.29 ~ 2025.11.10",
    summary: "참여 트랜잭션과 외부 보상 지급의 경계를 분리하고, 동시 요청·외부 장애에도 지급 내역을 최종 일치시킨 분산 환경 대응 백엔드.",
    tags: ["분산 락", "AFTER_COMMIT", "Circuit Breaker", "Eventual Consistency"],
  },
  {
    slug: "qmoney-expiration",
    title: "큐머니 유효기간 무중단 전환",
    period: "2026.01.15 ~ 2026.02.06",
    summary: "합계 기반 잔액을 적립 건별 Lot 구조로 전환하며, 마이그레이션 전·후 사용자를 같은 서버에서 정합성 있게 처리한 무중단 전환.",
    tags: ["데이터 마이그레이션", "Redis Bitmap", "Feature Toggle", "FIFO"],
  },
  {
    slug: "wallet",
    title: "월렛",
    period: "2026.03.16 ~ 2026.06.16",
    summary: "효성 CMS 자동이체 구독 결제·정산. 순서 없는 비동기 콜백과 서버 중단에도 결제 상태와 크레딧 지급을 일치시킨 시스템.",
    tags: ["상태 머신", "Transactional Outbox", "멱등성", "구독 결제"],
  },
  {
    slug: "opensearch",
    title: "OpenSearch 검색 엔진 내재화",
    period: "2026.06.09 ~ 진행 중",
    summary: "외부 유료 AI 검색을 OpenSearch 자체 엔진으로 전환. 골든셋으로 품질을 증명하고 하이브리드 검색·색인·A/B를 구축.",
    tags: ["OpenSearch", "하이브리드 검색", "NDCG@10", "A/B 테스트"],
  },
];
```

- [ ] **Step 5: 타입체크 + 커밋**

Run: `npx tsc --noEmit` → Expected: 에러 없음.
```bash
git add -A && git commit -m "feat: 프로필 사진 및 콘텐츠 데이터(profile/skills/projects) 추가"
```

---

## Task 4: Navigation Bar + 다크모드 토글

**Files:**
- Create: `components/theme-toggle.tsx`, `components/nav.tsx`

- [ ] **Step 1: `components/theme-toggle.tsx` 작성**

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" aria-hidden />;
  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label="테마 전환"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground/80 transition hover:bg-card"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
```

- [ ] **Step 2: `components/nav.tsx` 작성**

```tsx
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
        <a href="#hero" className="font-semibold tracking-tight">고지완</a>
        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted transition hover:text-foreground">{l.label}</a>
          ))}
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button type="button" aria-label="메뉴" onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border">☰</button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
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
```

- [ ] **Step 3: 타입체크 + 커밋**

Run: `npx tsc --noEmit` → Expected: 에러 없음.
```bash
git add -A && git commit -m "feat: 고정 네비게이션 바 및 다크모드 토글"
```

---

## Task 5: Hero 섹션

**Files:**
- Create: `components/sections/hero.tsx`

- [ ] **Step 1: `components/sections/hero.tsx` 작성**

```tsx
import Image from "next/image";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section id="hero" className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 pt-32 pb-20 md:flex-row md:items-center md:gap-16">
      <div className="shrink-0">
        <Image src={profile.photo} alt={profile.nameKo} width={200} height={250}
          className="rounded-2xl border border-border object-cover shadow-sm" priority />
      </div>
      <div className="text-center md:text-left">
        <p className="text-sm font-medium text-accent">{profile.title}{/* TODO: 타이틀 문구 확정 */}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          {profile.nameKo} <span className="text-muted">· {profile.nameEn}</span>
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-muted">{profile.intro}{/* TODO: 소개 문구 확정 */}</p>
        <p className="mt-4 text-sm text-muted">
          🎓 {profile.education.school} {profile.education.major}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
          <a href={profile.socials.github} target="_blank" rel="noreferrer"
            className="rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-card">GitHub</a>
          <a href={profile.socials.blog} target="_blank" rel="noreferrer"
            className="rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-card">Blog</a>
          <a href={`mailto:${profile.email}`}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">Email</a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `app/page.tsx`에 Nav + Hero 임시 조립**

`app/page.tsx` 전체 교체:
```tsx
import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 3: dev 서버 육안 확인**

Run: `npm run dev` → `http://localhost:3000` → 프로필 사진·이름·소개·학력·소셜 버튼이 라이트/다크 모두 정상 렌더되는지 확인 → `Ctrl+C`.
Expected: 레이아웃 깨짐 없음, 다크모드 토글 동작.

- [ ] **Step 4: 커밋**

```bash
git add -A && git commit -m "feat: Hero 섹션"
```

---

## Task 6: Skills 섹션

**Files:**
- Create: `components/sections/skills.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: `components/sections/skills.tsx` 작성**

```tsx
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
```

- [ ] **Step 2: `app/page.tsx`에 Skills 추가**

`<Hero />` 아래에 `<Skills />` 추가하고 상단 import에 `import { Skills } from "@/components/sections/skills";` 추가.

- [ ] **Step 3: 육안 확인 + 커밋**

Run: `npm run dev` → Skills 4개 카테고리 카드 확인 → `Ctrl+C`.
```bash
git add -A && git commit -m "feat: Skills 섹션"
```

---

## Task 7: Projects 섹션 (카드 그리드)

**Files:**
- Create: `components/sections/projects.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: `components/sections/projects.tsx` 작성**

```tsx
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
```

- [ ] **Step 2: `app/page.tsx`에 Projects 추가** (import + `<Projects />`)

- [ ] **Step 3: 육안 확인 + 커밋**

Run: `npm run dev` → 4개 프로젝트 카드 확인(링크는 다음 태스크에서 페이지 생성) → `Ctrl+C`.
```bash
git add -A && git commit -m "feat: Projects 카드 섹션"
```

---

## Task 8: Blog + Contact 섹션

**Files:**
- Create: `components/sections/blog.tsx`, `components/sections/contact.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: `components/sections/blog.tsx` 작성**

```tsx
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
```

- [ ] **Step 2: `components/sections/contact.tsx` 작성** (이메일 표시 + 복사 버튼, 폼 없음)

```tsx
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
```

- [ ] **Step 3: `app/page.tsx`에 Blog + Contact 추가** (import + `<Blog />`, `<Contact />`)

- [ ] **Step 4: 육안 확인 + 커밋**

Run: `npm run dev` → Blog 카드, Contact 이메일 복사 동작 확인 → `Ctrl+C`.
```bash
git add -A && git commit -m "feat: Blog 및 Contact 섹션"
```

---

## Task 9: 콘텐츠 렌더링 프리미티브 (Markdown + Mermaid + slug)

**Files:**
- Create: `lib/slug.ts`, `components/content/mermaid.tsx`, `components/content/markdown.tsx`

- [ ] **Step 1: `lib/slug.ts` 작성**

```tsx
import GithubSlugger from "github-slugger";

export function slugify(text: string): string {
  return new GithubSlugger().slug(text);
}
```

- [ ] **Step 2: `components/content/mermaid.tsx` 작성**

```tsx
"use client";

import { useEffect, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

let counter = 0;

export function Mermaid({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let active = true;
    const id = `mermaid-${counter++}`;
    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === "dark" ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "Pretendard Variable, Pretendard, sans-serif",
    });
    mermaid
      .render(id, chart)
      .then(({ svg }) => { if (active) setSvg(svg); })
      .catch(() => { if (active) setSvg(`<pre>${chart}</pre>`); });
    return () => { active = false; };
  }, [chart, resolvedTheme]);

  return (
    <div className="my-6 flex justify-center overflow-x-auto rounded-xl border border-border bg-card p-4"
      dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
```

- [ ] **Step 3: `components/content/markdown.tsx` 작성**

```tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import { Mermaid } from "./mermaid";

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) return extractText((node.props as { children?: ReactNode }).children);
  return "";
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert
      prose-headings:scroll-mt-24 prose-headings:font-bold
      prose-h2:mt-14 prose-h2:border-t prose-h2:border-border prose-h2:pt-10
      prose-a:text-accent prose-table:text-sm
      prose-img:rounded-lg prose-img:border prose-img:border-border
      prose-code:before:content-[''] prose-code:after:content-['']">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          pre({ children }) {
            const child = Array.isArray(children) ? children[0] : children;
            const className = isValidElement(child)
              ? ((child.props as { className?: string }).className ?? "")
              : "";
            if (/language-mermaid/.test(className) && isValidElement(child)) {
              return <Mermaid chart={extractText((child.props as { children?: ReactNode }).children).trim()} />;
            }
            return (
              <pre className="overflow-x-auto rounded-xl border border-border bg-card p-4 text-sm">{children}</pre>
            );
          },
          img({ src, alt }) {
            if (typeof src !== "string") return null;
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={src} alt={alt ?? ""} loading="lazy" className="mx-auto" />;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 4: 타입체크 + 커밋**

Run: `npx tsc --noEmit` → Expected: 에러 없음.
```bash
git add -A && git commit -m "feat: 마크다운/Mermaid 렌더링 프리미티브"
```

---

## Task 10: 프로젝트 상세 페이지 라우트 + 헤더 + 목차

**Files:**
- Create: `components/content/project-header.tsx`, `components/content/toc.tsx`, `app/projects/[slug]/page.tsx`
- Create(빈 파일 임시): `content/projects/eventmaker.md` 등 4개 (다음 태스크에서 채움)

- [ ] **Step 1: 임시 md 파일 생성 (빌드 통과용 최소 내용)**

Run:
```bash
cd /Users/maruhxn/aswemake/portfolio-web
mkdir -p content/projects
for s in eventmaker qmoney-expiration wallet opensearch; do printf '## 준비 중\n\n내용 이관 예정.\n' > "content/projects/$s.md"; done
```

- [ ] **Step 2: `components/content/project-header.tsx` 작성**

```tsx
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
```

- [ ] **Step 3: `components/content/toc.tsx` 작성**

```tsx
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
```

- [ ] **Step 4: `app/projects/[slug]/page.tsx` 작성**

```tsx
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
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
        <a href="/#projects" className="text-sm text-accent hover:underline">← 프로젝트 목록으로</a>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: 빌드 확인 + 커밋**

Run: `npm run build`
Expected: 4개 `/projects/[slug]` 라우트가 정적 생성(SSG)됨, 에러 없음.
```bash
git add -A && git commit -m "feat: 프로젝트 상세 페이지 라우트·헤더·목차"
```

---

## Task 11: 노션 이미지 다운로드 → /public/projects

노션 S3 URL은 약 5분 만료다. 다운로드 직전 노션 페이지를 다시 조회해 **신선한 서명 URL**을 얻어야 한다. 이미지의 안정적 식별자는 URL 경로의 UUID 세그먼트다(쿼리 서명만 매번 바뀜).

**Files:**
- Create: `public/projects/eventmaker/img-1.png ~ img-4.png`, `public/projects/qmoney-expiration/img-1.png`

이미지 매핑(등장 순서 기준):

| 파일 | 프로젝트 | 노션 이미지 UUID 세그먼트 | 설명 |
|---|---|---|---|
| eventmaker/img-1.png | 이벤트메이커 | `6d9f6e26-db24-4a61-91a6-8456c07d995b` | 다중 디바이스 동시 참여 |
| eventmaker/img-2.png | 이벤트메이커 | `1a7a1e62-55ec-4cd2-947e-280636032536` | 다중 인스턴스 따닥 |
| eventmaker/img-3.png | 이벤트메이커 | `29a35d04-da20-4526-ae18-0c0a0ded8eed` | 외부 장애 상황 1 |
| eventmaker/img-4.png | 이벤트메이커 | `36cac5a4-bd0e-42df-9b51-eecdcd4a6b3e` | 외부 장애 상황 2 |
| qmoney-expiration/img-1.png | 큐머니 | `abd7fb82-ca7f-48b1-bda9-6e77bd2902f8` | 큐머니 데이터 구조 |

- [ ] **Step 1: 디렉터리 생성**

Run:
```bash
mkdir -p /Users/maruhxn/aswemake/portfolio-web/public/projects/eventmaker \
         /Users/maruhxn/aswemake/portfolio-web/public/projects/qmoney-expiration
```

- [ ] **Step 2: 노션 재조회 → 신선한 URL 확보**

`mcp__notion__notion-fetch`로 아래 두 페이지를 다시 조회한다.
- 이벤트메이커: `39a5659be3b680deb326dccb34e7d553`
- 큐머니: `39a5659be3b680b596b0ced7c9aba69c`

응답 본문에서 위 UUID 세그먼트를 포함하는 `![](...)` URL을 각각 찾아 매핑한다.

- [ ] **Step 3: 각 이미지 curl 다운로드**

각 이미지에 대해(예시, 실제 URL은 Step 2에서 확보한 신선한 서명 URL로 교체):
```bash
curl -sSL "<fresh-signed-url-for-6d9f6e26>" -o /Users/maruhxn/aswemake/portfolio-web/public/projects/eventmaker/img-1.png
```
5개 이미지 모두 반복.

- [ ] **Step 4: 다운로드 검증**

Run:
```bash
ls -la /Users/maruhxn/aswemake/portfolio-web/public/projects/eventmaker/ \
       /Users/maruhxn/aswemake/portfolio-web/public/projects/qmoney-expiration/
file /Users/maruhxn/aswemake/portfolio-web/public/projects/eventmaker/img-1.png
```
Expected: 각 파일 크기 > 0, `file` 결과가 PNG/JPEG 이미지. (0바이트거나 XML/HTML이면 URL 만료 → Step 2부터 재시도)

- [ ] **Step 5: 커밋**

```bash
git add -A && git commit -m "chore: 노션 프로젝트 이미지 다운로드"
```

---

## Task 12: 이벤트메이커 콘텐츠 이관 (eventmaker.md)

**Files:**
- Modify: `content/projects/eventmaker.md`

노션 페이지 `39a5659be3b680deb326dccb34e7d553`의 본문을 **누락 없이** 마크다운으로 옮긴다. 변환 규칙:
- Mermaid: ` ```mermaid ` 코드펜스로 그대로.
- 이미지 `![](S3url)` → `![설명](/projects/eventmaker/img-N.png)` (Task 11 매핑 순서대로 img-1~img-4).
- 표(`<table>...`)·`<br>`·`**bold**`·` `inline code` `·`> 인용`·` ```plain text ` 코드펜스는 원문 그대로 유지(rehype-raw가 HTML 표를 렌더).
- 상세 페이지 헤더가 제목·기간을 이미 표시하므로, md 본문은 인트로 문단부터 시작한다(맨 위 `> 기간: ...` 줄은 제외). 나머지 문장/문단은 하나도 생략하지 않는다.

- [ ] **Step 1: eventmaker.md 작성 (인벤토리 대조)**

아래 요소가 모두 포함되어야 한다(설계 인벤토리):
- 인트로 문단 + 핵심 과제 문장
- "## 리워드 지급 처리 흐름" + Mermaid sequenceDiagram ×1
- "## 1. 참여 처리와 외부 리워드 지급을 분리했습니다" — 문제(3)·해결(3, `참여 트랜잭션 → COMMIT ...` 코드블록)·결과(3)
- "## 2. 다중 인스턴스·다중 디바이스의 중복 참여를 차단했습니다" — 문제(4)·이미지 ×2(img-1,img-2)·해결(4)·결과(4)
- "## 3. 외부 보상 서버 장애를 격리하고 미지급 건을 복구했습니다" — 이미지 ×2(img-3,img-4)·문제(3)·해결(3, Mermaid sequenceDiagram ×1)·결과(3)
- "## 4. 성능 목표와 검증" — 목표 산정 코드블록 + AWS DLT 표(7행)
- "## 5. Strategy·Composite 디자인 패턴으로 확장 구조를 만들었습니다" — 문제(2)·해결(2)·결과(2)

- [ ] **Step 2: 렌더 육안 확인**

Run: `npm run dev` → `http://localhost:3000/projects/eventmaker` → 두 Mermaid 다이어그램 렌더, 이미지 4장 표시, 표·코드블록·문제/해결/결과 번호 대응 확인. 다크모드에서 다이어그램 테마 전환 확인 → `Ctrl+C`.
Expected: 인벤토리 항목 누락 없음.

- [ ] **Step 3: 커밋**

```bash
git add -A && git commit -m "content: 이벤트메이커 프로젝트 상세 이관"
```

---

## Task 13: 큐머니 유효기간 전환 콘텐츠 이관 (qmoney-expiration.md)

**Files:**
- Modify: `content/projects/qmoney-expiration.md`

노션 `39a5659be3b680b596b0ced7c9aba69c` 본문을 Task 12와 동일 규칙으로 이관. 이미지: `abd7fb82...` → `/projects/qmoney-expiration/img-1.png`.

- [ ] **Step 1: qmoney-expiration.md 작성 (인벤토리 대조)**
- 인트로 + 핵심 과제
- "## 큐머니 데이터 구조" — 이미지 ×1(img-1) + 표(3행: q_money/q_money_lot/q_money_usage)
- "## 1. 합계 기반 잔액을 적립 건별 Lot으로 전환했습니다" — 문제(4)·해결(4)·결과(4)
- "## 2. 마이그레이션 전·후 사용자를 같은 서버에서 처리했습니다" — 문제(4)·해결(4, Mermaid flowchart ×1)·결과(4, 바이트 계산 코드블록)
- "## 3. 기존 원장을 잔액이 일치하는 Lot으로 재구성했습니다" — 문제(3, 코드블록)·해결(3, 코드블록 + Mermaid sequenceDiagram ×1)·결과(3)
- "## 4. 결제와 소멸 배치가 같은 Lot을 동시에 차감하지 않게 했습니다" — 문제(3)·해결(3)·결과(3)

- [ ] **Step 2: 렌더 육안 확인**

Run: `npm run dev` → `/projects/qmoney-expiration` → Mermaid ×2, 이미지 1장, 표 2개, 코드블록들 확인 → `Ctrl+C`.

- [ ] **Step 3: 커밋**

```bash
git add -A && git commit -m "content: 큐머니 유효기간 전환 프로젝트 상세 이관"
```

---

## Task 14: 월렛 콘텐츠 이관 (wallet.md)

**Files:**
- Modify: `content/projects/wallet.md`

노션 `39a5659be3b680318e46f7972ec39a24` 본문 이관(이미지 없음).

- [ ] **Step 1: wallet.md 작성 (인벤토리 대조)**
- 인트로 + 핵심 과제
- "## 구독 결제 처리 구조" — Mermaid sequenceDiagram ×1
- "## 1. 순서가 보장되지 않는 비동기 결제를 상태 머신으로 통제했습니다" — 문제(3)·해결(3, Mermaid stateDiagram ×1)·결과(3)
- "## 2. 출금과 크레딧 지급 사이의 유실을 Outbox로 복구했습니다" — 문제(3)·해결(3)·결과(3) + 표(4행: 장애 시점)
- "## 3. 구독 상태 전이 모델로 결제 실패와 서비스 이용 상태를 분리했습니다" — 문제(3)·해결(3, Mermaid stateDiagram ×1)·결과(3) + 표(4행: 구독 상태)

- [ ] **Step 2: 렌더 육안 확인**

Run: `npm run dev` → `/projects/wallet` → Mermaid ×3(sequence 1 + state 2), 표 2개 확인 → `Ctrl+C`.

- [ ] **Step 3: 커밋**

```bash
git add -A && git commit -m "content: 월렛 프로젝트 상세 이관"
```

---

## Task 15: OpenSearch 콘텐츠 이관 (opensearch.md)

**Files:**
- Modify: `content/projects/opensearch.md`

노션 `39a5659be3b68098bd4df4e86b862841` 본문 이관(이미지 없음).

- [ ] **Step 1: opensearch.md 작성 (인벤토리 대조)**
- 인트로 + 핵심 과제
- "## 검색 처리 구조" — Mermaid sequenceDiagram ×1
- "## 1. 엔진보다 먼저 품질을 측정할 기준을 만들었습니다" — 문제(4)·해결(4)·결과(불릿) + NDCG@10 정의 인용문
- "## 2. 데이터 문제부터 해결한 뒤 하이브리드 검색을 도입했습니다" — 문제(7)·해결(7)·결과 표(5행 NDCG) + 불릿
- "## 3. 전체 색인과 증분 색인을 분리해 검색 데이터를 동기화했습니다" — 문제(5)·해결(Mermaid flowchart ×1 + 5항목)·결과 표(5행) + 불릿
- "## 4. 서로 다른 두 지연 원인을 계측으로 분리해 해결했습니다" — 문제(4)·해결(4)·결과 표(4행) + 불릿
- "## 5. A/B 테스트로 사용자 행동을 비교할 온라인 평가 기반을 만들었습니다" — 문제(4)·해결(4)·결과(불릿)

- [ ] **Step 2: 렌더 육안 확인**

Run: `npm run dev` → `/projects/opensearch` → Mermaid ×2(sequence 1 + flowchart 1), 표 3개, "진행 중" 기간 배지 확인 → `Ctrl+C`.

- [ ] **Step 3: 커밋**

```bash
git add -A && git commit -m "content: OpenSearch 검색 엔진 내재화 프로젝트 상세 이관"
```

---

## Task 16: 최종 폴리시 · 프로덕션 빌드 · README

**Files:**
- Create: `README.md`
- Modify: 필요 시 스타일 미세 조정

- [ ] **Step 1: 반응형·다크모드 감사**

Run: `npm run dev` → 모바일 폭(≤400px)과 데스크톱에서 메인 5개 섹션 + 4개 상세 페이지를 라이트/다크 모두 확인. 가로 스크롤 발생·대비 부족·다이어그램 넘침이 없는지 점검. 문제 발견 시 해당 컴포넌트 클래스만 수정 → `Ctrl+C`.

- [ ] **Step 2: `README.md` 작성**

```markdown
# 포트폴리오 웹사이트 — 고지완 (Ko Ji Wan)

Next.js(App Router) + Tailwind CSS 기반 정적 포트폴리오. Vercel 배포.

## 개발
\`\`\`bash
npm install
npm run dev
\`\`\`

## 빌드
\`\`\`bash
npm run build && npm start
\`\`\`

## 콘텐츠 수정
- 프로필/스킬/프로젝트 메타: \`content/*.ts\`
- 프로젝트 상세 본문: \`content/projects/*.md\` (노션에서 1회 복사한 정적 콘텐츠, 연동 아님)
- 이미지: \`public/projects/\`

## 남은 TODO
- Hero 타이틀 세부 문구 (\`content/profile.ts\`)
- 자기소개 최종 문구 (\`content/profile.ts\`)

## 배포 (Vercel)
GitHub에 push 후 Vercel에서 이 레포를 import → 기본 설정으로 배포(환경변수 불필요).
```

- [ ] **Step 3: 린트 + 프로덕션 빌드**

Run: `npm run lint && npm run build`
Expected: 린트 통과, 4개 상세 페이지 SSG + 메인 정적 생성, 빌드 성공.

- [ ] **Step 4: 커밋**

```bash
git add -A && git commit -m "docs: README 추가 및 최종 폴리시"
```

---

## Self-Review 체크리스트 (구현 전 참고)

- 스펙 커버리지: Nav(T4)·Hero(T5)·Skills(T6)·Projects(T7)·Blog·Contact(T8)·상세 4종(T10~T15)·이미지(T11)·배포(T16) 모두 태스크 존재.
- Contact은 폼 없이 이메일 표시만(T8) — 스펙 반영.
- Skills 4개 카테고리, Frontend 제외(T3) — 스펙 반영.
- 노션 연동 없음: 상세는 로컬 md를 fs로 읽음(T10) — 스펙 반영.
- 타입 일관성: `PROJECTS`/`ProjectMeta`(T3) ↔ 상세 페이지·카드에서 동일 사용. `Markdown`/`Mermaid`/`slugify` 시그니처 T9 정의 ↔ T10 사용 일치.
