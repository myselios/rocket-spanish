// 텍스트 상태 타입
export type TextStatus =
  | "텍스트만"
  | "TTS 처리 중"
  | "TTS 완료"
  | "음성 변환 완료"
  | "TTS 변환 실패"
  | "변환 완료"
  | "오디오 생성됨";

// 언어 타입
export type Language = "spanish" | "korean";

// 레벨 타입
export type Level =
  | "초급"
  | "중급"
  | "실전"
  | "beginner"
  | "basic"
  | "intermediate"
  | "advanced";

// 시험 타입
export type ExamType =
  | "스널트"
  | "플렉스"
  | "오픽"
  | "snult"
  | "flex"
  | "opic"
  | null;

// 텍스트 데이터 타입 정의
export interface TextItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  language: Language;
  text: string;
  status: TextStatus;
  audioUrl: string | null;
  audioFile?: string | null;
  audioPath?: string | null;
  examType?: ExamType;
  level?: Level | null;
  tts_files?: string[];
}

// 언어 표시 맵핑
export const LANGUAGE_MAP: Record<string, string> = {
  spanish: "스페인어",
  korean: "한국어",
};

// 레벨 표시 맵핑
export const LEVEL_MAP: Record<string, string> = {
  beginner: "입문 (A1)",
  basic: "기초 (A2)",
  intermediate: "중급 (B1)",
  advanced: "고급 (B2)",
  초급: "초급",
  중급: "중급",
  실전: "실전",
};

// 시험 유형 맵핑
export const EXAM_TYPE_MAP: Record<string, string> = {
  snult: "스널트",
  스널트: "스널트",
  flex: "플렉스",
  플렉스: "플렉스",
  opic: "오픽",
  오픽: "오픽",
};

// API 경로
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
