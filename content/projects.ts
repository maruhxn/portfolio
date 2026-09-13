export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
};

export const PROJECTS: ProjectMeta[] = [
  {
    slug: "eventmaker",
    title: "이벤트메이커",
    summary: "참여 응답에서 외부 포인트 지급 호출을 비동기로 분리하고, 상태 머신·재시도 워커·대사 시스템으로 장애 상황에서도 지급이 유실 없이 정합성을 갖추게 한 서비스. 부하테스트로 100 TPS에서 2193 TPS까지 처리량을 끌어올렸습니다.",
    tags: ["비동기 처리", "상태 머신", "부하테스트", "대사(Reconciliation)"],
  },
  // 비노출 (복구하려면 주석 해제. 본문은 content/projects/qmoney-expiration.md 유지)
  // {
  //   slug: "qmoney-expiration",
  //   title: "큐머니 유효기간 무중단 전환",
  //   summary: "합계 기반 잔액을 적립 건별 Lot 구조로 전환하며, 마이그레이션 전·후 사용자를 같은 서버에서 정합성 있게 처리한 무중단 전환.",
  //   tags: ["데이터 마이그레이션", "Redis Bitmap", "Feature Toggle", "FIFO"],
  // },
  // 비노출 (복구하려면 주석 해제. 본문은 content/projects/wallet.md 유지)
  // {
  //   slug: "wallet",
  //   title: "월렛",
  //   summary: "효성 CMS 자동이체 구독 결제·정산. 중복·역순 웹훅을 상태 머신과 Inbox 멱등 처리로 거르고, 일시적 결제 실패가 서비스 해지로 이어지지 않게 한 시스템.",
  //   tags: ["상태 머신", "Inbox 패턴", "멱등성", "구독 결제"],
  // },
  // 비노출 (복구하려면 주석 해제. 본문은 content/projects/opensearch.md 유지)
  // {
  //   slug: "opensearch",
  //   title: "OpenSearch 검색 엔진 내재화",
  //   summary: "외부 유료 AI 검색을 OpenSearch 자체 엔진으로 전환. 골든셋으로 품질을 증명하고 하이브리드 검색·색인·A/B를 구축.",
  //   tags: ["OpenSearch", "하이브리드 검색", "NDCG@10", "A/B 테스트"],
  // },
];
