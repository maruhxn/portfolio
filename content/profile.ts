export const profile = {
  nameKo: "고지완",
  nameEn: "Ko Ji Wan",
  title: "문제를 집요하게 파고들어, 신뢰할 수 있는 결과를 책임지는 백엔드 개발자",
  intro:
    "이벤트 참여자에게 리워드를 지급하는 시스템을 개발하며, 외부 API 지연·중복·유실이 발생할 수 있는 환경에서 참여 기록의 무손실과 캐시-DB 간 정합성을 지키는 문제를 해결해왔습니다.\n'장애는 반드시 발생한다'라는 전제로 외부 API 장애를 참여 흐름에서 격리하고 실패를 끝까지 복구하는 구조를 설계한 뒤, 목표 처리량 확인에 그치지 않고 한계까지 부하를 올리는 실측으로 이 구조가 실제로 버티는지, 병목은 어디인지 추측이 아닌 데이터로 증명하며 검증했습니다.\n기능 구현에서 멈추지 않고 문제를 스스로 정의해 서비스 품질까지 챙기는 것이 저의 개발 기준입니다.",
  career: {
    company: "애즈위메이크",
    period: "2025.08 – 2026.07",
  },
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
