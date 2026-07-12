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
