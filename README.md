# 포트폴리오 웹사이트 — 고지완 (Ko Ji Wan)

Next.js(App Router) + Tailwind CSS 기반 정적 포트폴리오. Vercel 배포. 외부 런타임 의존(백엔드·노션 API·이메일 서비스) 없음.

## 개발

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인.

## 빌드

```bash
npm run build && npm start
```

## 구조

- 메인 한 페이지: Hero · Skills · Projects · Blog · Contact (`app/page.tsx`, `components/sections/*`)
- 프로젝트 상세: `/projects/[slug]` SSG (`app/projects/[slug]/page.tsx`)
- 상세 본문 렌더링: `react-markdown` + `rehype-raw` + Mermaid 클라이언트 렌더 (`components/content/*`)

## 콘텐츠 수정

- 프로필/스킬/프로젝트 메타: `content/profile.ts`, `content/skills.ts`, `content/projects.ts`
- 프로젝트 상세 본문: `content/projects/*.md` (노션에서 1회 복사한 정적 콘텐츠, 실시간 연동 아님)
- 이미지: `public/projects/`
- 프로필 사진: `public/profile.jpeg`

## 남은 TODO

- Hero 타이틀 세부 문구 (`content/profile.ts`의 `title`)
- 자기소개 최종 문구 (`content/profile.ts`의 `intro`)

## 배포 (Vercel)

GitHub에 push 후 Vercel에서 이 레포를 import → 기본 설정으로 배포. 환경변수 불필요.
