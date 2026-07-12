# 포트폴리오 웹사이트 설계 (Design Doc)

- 작성일: 2026-07-12
- 대상: 고지완(Ko Ji Wan) 개인 포트폴리오 웹사이트
- 상태: 승인됨 (구현 계획 단계로 진행)

## 1. 목표

애즈위메이크에서 진행한 4개 백엔드 프로젝트 경험을 중심으로, 이력서형 요약 + 스킬 + 프로젝트 상세 + 블로그 + 연락처를 담은 개인 포트폴리오 사이트를 만든다. Next.js로 개발해 Vercel에 정적 배포하며 별도 서버는 두지 않는다.

## 2. 비목표 (Non-goals)

- **노션 API 연동 없음.** 노션 내용은 최초 1회 복사해 오는 원본 소스일 뿐이다. 빌드/런타임에 노션을 호출하지 않으며, 이후 노션이 바뀌어도 사이트는 변하지 않는다.
- **백엔드/서버 없음.** 모든 것은 정적 자산으로 배포된다.
- **이메일 전송 기능 없음.** Contact은 이메일 주소를 보여주기만 한다(복사 버튼 + `mailto` 링크). Web3Forms 등 외부 폼 서비스 연동 없음.
- **테스트 코드 없음.** (사용자 요청)

## 3. 기술 스택

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- `next-themes` (라이트/다크 토글)
- Mermaid (다이어그램 렌더링, 동적 import, 테마 연동)
- 폰트: Pretendard(한글) + Inter(영문)
- 배포: Vercel (정적)

## 4. 위치 & 디렉터리 구조

새 독립 Git 레포: `/Users/maruhxn/aswemake/portfolio-web` (백엔드 레포 Qmarket-Server와 분리)

```
app/
  layout.tsx            # 폰트, 테마 provider, 메타데이터
  page.tsx              # 메인 (Hero → Skills → Projects → Blog → Contact 한 페이지 스크롤)
  projects/[slug]/page.tsx   # 4개 상세 페이지 (generateStaticParams로 SSG)
components/
  nav.tsx, theme-toggle.tsx
  sections/  hero, skills, projects, blog, contact
  content/   Section, ProblemSolutionResult, DataTable, CodeBlock, Mermaid, Callout, ImageBlock, ProjectHeader, Toc
content/
  profile.ts           # 이름, 타이틀, 소개, 학력, 소셜
  skills.ts            # 4개 카테고리
  projects/
    index.ts           # 카드용 메타(제목/기간/요약/태그/slug)
    eventmaker.ts
    qmoney-expiration.ts
    wallet.ts
    opensearch.ts
public/
  profile.jpeg         # 프로필 사진 (스크래치패드에 백업본 보관 중)
  projects/            # 노션에서 내려받은 이미지
lib/
  (필요 시 유틸)
```

## 5. 콘텐츠 전략 — "누락 없이"의 핵심

- 노션 4개 페이지 내용을 `content/projects/*.ts`에 **타입 구조로 1:1 이관**한다. 문제/해결/결과 번호 대응, 표, 코드블록, 다이어그램, 이미지를 모두 포함한다.
- **Mermaid 다이어그램**은 원문 코드를 그대로 넣어 실제 렌더링한다.
- **이미지**: 노션 S3 서명 URL은 약 5분 만료된다. 구현 시점에 노션 페이지를 다시 불러와 신선한 URL로 이미지를 `/public/projects/`에 내려받은 뒤 로컬 경로로 참조한다. 이후 노션과 무관하게 유지된다.
- 콘텐츠 소스: 본 대화에서 2026-07-12 기준으로 조회한 노션 페이지 4종. 재조회가 필요하면 아래 URL 사용.

### 노션 원본 URL
- 이벤트메이커: https://app.notion.com/p/39a5659be3b680deb326dccb34e7d553
- 큐머니 유효기간 무중단 전환: https://app.notion.com/p/39a5659be3b680b596b0ced7c9aba69c
- 월렛: https://app.notion.com/p/39a5659be3b680318e46f7972ec39a24
- OpenSearch 검색 엔진 내재화: https://app.notion.com/p/39a5659be3b68098bd4df4e86b862841

## 6. 메인 페이지 섹션

### Navigation Bar (고정 헤더)
- 앵커 링크: `#hero`, `#skills`, `#projects`, `#blog`, `#contact` (스무스 스크롤)
- 다크모드 토글
- 모바일: 햄버거 메뉴

### Section 1: Hero (이력서형 요약)
- 프로필 사진 (`/public/profile.jpeg`)
- 이름: **고지완 · Ko Ji Wan**
- 타이틀: **"백엔드 개발자"** — 세부 문구는 `TODO` 마커
- 자기소개: 초안 작성 + `TODO` 마커 (최종 문구 교체 예정)
- 학력: **서울과학기술대학교 컴퓨터공학과**
- 소셜: GitHub(https://github.com/maruhxn), 블로그(https://mxruhxn.tistory.com/), 이메일(maruhan1016@gmail.com)

### Section 2: Skills (4개 카테고리 — Frontend 제외)
- **Backend**: Kotlin, Java, Spring Boot, Spring Security, Spring Batch, JPA/QueryDSL, Resilience4j
- **Database**: MySQL, PostgreSQL, Redis(Redisson), OpenSearch
- **DevOps**: AWS, NCP, Docker, GitHub Actions, Kubernetes, Jenkins
- **Tools**: Git, Datadog, IntelliJ IDEA, Notion, Slack

### Section 3: Projects
4개 카드(제목 · 기간 · 한 줄 요약 · 태그). 클릭 시 `/projects/[slug]` 상세로 이동.
- 이벤트메이커 → `eventmaker`
- 큐머니 유효기간 무중단 전환 → `qmoney-expiration`
- 월렛 → `wallet`
- OpenSearch 검색 엔진 내재화 → `opensearch`

### Section 4: Blog
Tistory(https://mxruhxn.tistory.com/)로 이동하는 링크 카드. 연동 없음.

### Section 5: Contact
- 이메일 주소 표시 + 복사 버튼 + `mailto` 링크
- 연락처 정보: 이메일 / GitHub / 블로그
- 전송 폼 없음

## 7. 프로젝트 상세 페이지 구조

공통 레이아웃: 헤더(제목 · 기간 배지 · 개요 인용) → 번호별 섹션(문제 · 해결 · 결과) → 표/코드/다이어그램/이미지 → 목차(TOC) + "목록으로" 네비.

### 콘텐츠 인벤토리 (누락 방지 체크리스트)

구현 시 각 프로젝트가 아래 요소를 모두 포함하는지 대조한다.

**이벤트메이커** (기간 2025/09/29 ~ 2025/11/10)
- 인트로 문단 + 핵심 과제 문장
- "리워드 지급 처리 흐름": Mermaid sequenceDiagram ×1
- 1. 참여/외부 지급 분리 — 문제(3) · 해결(3, plain 코드블록 1) · 결과(3)
- 2. 다중 인스턴스·디바이스 중복 참여 차단 — 문제(4) · 이미지 ×2 · 해결(4) · 결과(4)
- 3. 외부 보상 서버 장애 격리·복구 — 이미지 ×2 · 문제(3) · 해결(3, Mermaid sequenceDiagram ×1) · 결과(3)
- 4. 성능 목표와 검증 — 목표 산정(plain 코드블록 1) · AWS DLT 표(7행)
- 5. Strategy·Composite 패턴 — 문제(2) · 해결(2) · 결과(2)
- 합계: Mermaid ×2, 이미지 ×4, 코드블록 ×2, 표 ×1

**큐머니 유효기간 무중단 전환** (기간 2026/01/15 ~ 2026/02/06)
- 인트로 + 핵심 과제
- "큐머니 데이터 구조": 이미지 ×1 + 표(3행: q_money / q_money_lot / q_money_usage)
- 1. 합계→Lot 전환 — 문제(4) · 해결(4) · 결과(4)
- 2. 마이그레이션 전·후 공존 — 문제(4) · 해결(4, Mermaid flowchart ×1) · 결과(4, plain 코드블록 1)
- 3. 원장→Lot 재구성 — 문제(3, 코드블록 1) · 해결(3, 코드블록 1 + Mermaid sequenceDiagram ×1) · 결과(3)
- 4. 결제·소멸 배치 동시 차감 방지 — 문제(3) · 해결(3) · 결과(3)
- 합계: Mermaid ×2, 이미지 ×1, 코드블록 다수, 표 ×2

**월렛** (기간 2026.03.16 ~ 2026.06.16)
- 인트로 + 핵심 과제
- "구독 결제 처리 구조": Mermaid sequenceDiagram ×1
- 1. 비동기 결제 상태 머신 — 문제(3) · 해결(3, Mermaid stateDiagram ×1) · 결과(3)
- 2. Outbox 유실 복구 — 문제(3) · 해결(3) · 결과(3) + 표(4행: 장애 시점)
- 3. 구독 상태 전이 모델 — 문제(3) · 해결(3, Mermaid stateDiagram ×1) · 결과(3) + 표(4행: 구독 상태)
- 합계: Mermaid ×3, 이미지 ×0, 표 ×2

**OpenSearch 검색 엔진 내재화** (기간 2026.06.09 ~ 진행 중)
- 인트로 + 핵심 과제
- "검색 처리 구조": Mermaid sequenceDiagram ×1
- 1. 품질 측정 기준 — 문제(4) · 해결(4) · 결과(불릿) + NDCG@10 정의 인용
- 2. 데이터 문제 후 하이브리드 — 문제(7) · 해결(7) · 결과 표(5행 NDCG) + 불릿
- 3. 전체/증분 색인 — 문제(5) · 해결(Mermaid flowchart ×1 + 5항목) · 결과 표(5행) + 불릿
- 4. 지연 원인 분리 — 문제(4) · 해결(4) · 결과 표(4행) + 불릿
- 5. A/B 테스트 — 문제(4) · 해결(4) · 결과(불릿)
- 합계: Mermaid ×2, 이미지 ×0, 표 ×3

## 8. 디자인 언어

모던·미니멀. 중립 톤(zinc/slate) 기반 + 단일 액센트 컬러. 넉넉한 여백, 명확한 타이포 위계, 스크롤 시 은은한 페이드/슬라이드 인. 완전 반응형(모바일·데스크톱). 라이트/다크 모두 정돈되게. 코드블록·표·다이어그램은 가독성 우선으로 스타일링하되 원문 내용은 변경하지 않는다.

## 9. 남은 TODO

- Hero 타이틀 세부 문구
- 자기소개 최종 문구
- (사이트 코드 주석/화면 상 `TODO` 마커로 표시)

## 10. 배포

Vercel에 연결(GitHub 레포 → Vercel import). 정적 빌드. 환경변수 불필요.
