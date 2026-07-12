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
