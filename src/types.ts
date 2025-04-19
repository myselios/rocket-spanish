// 시험 유형
export type ExamType = "스널트" | "플렉스" | "오픽";

// 난이도
export type Level = "입문" | "기초" | "중급" | "고급";

// 언어
export type Language = "한국어" | "스페인어";

// 언어 맵핑
export const LANGUAGE_MAP: Record<Language, string> = {
  한국어: "한국어",
  스페인어: "스페인어",
};

// 레벨 맵핑
export const LEVEL_MAP: Record<Level, string> = {
  입문: "입문",
  기초: "기초",
  중급: "중급",
  고급: "고급",
};
