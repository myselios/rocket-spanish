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
export type Language = "한국어" | "스페인어";

// 레벨 타입
export type Level = "입문" | "기초" | "중급" | "고급";

// 시험 타입
export type ExamType = "스널트" | "플렉스" | "오픽";

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
export const LANGUAGE_MAP: Record<Language, string> = {
  한국어: "한국어",
  스페인어: "스페인어",
};

// 레벨 표시 맵핑
export const LEVEL_MAP: Record<Level, string> = {
  입문: "입문",
  기초: "기초",
  중급: "중급",
  고급: "고급",
};

// 시험 유형 맵핑
export const EXAM_TYPE_MAP: Record<ExamType, string> = {
  스널트: "스널트",
  플렉스: "플렉스",
  오픽: "오픽",
};

// API 경로
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
