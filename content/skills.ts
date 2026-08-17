export const skillCategories = [
  { name: "Backend", items: ["Kotlin", "Java", "Spring Boot", "Spring Security", "Spring Batch", "JPA / QueryDSL", "Resilience4j"] },
  // 복구 시 items 끝에 "OpenSearch" 추가
  { name: "Database", items: ["MySQL", "PostgreSQL", "Redis (Redisson)"] },
  { name: "DevOps", items: ["AWS", "NCP", "Docker", "GitHub Actions", "Kubernetes", "Jenkins"] },
  { name: "Tools", items: ["Git", "Datadog", "IntelliJ IDEA", "Notion", "Slack"] },
] as const;
