import { ExamType, Level, Language } from "@/types";

// API 호출을 위한 유틸리티 함수들

// 텍스트 항목 인터페이스
export interface TextItem {
  id: string;
  text: string;
  status: string;
  examType?: ExamType;
  level?: Level;
  language: Language;
  audioUrl?: string;
  createdAt: string;
}

// 모든 텍스트 가져오기
export async function fetchTextsFromApi(): Promise<TextItem[]> {
  const response = await fetch("/api/texts");

  if (!response.ok) {
    throw new Error("텍스트를 가져오는 중 오류가 발생했습니다");
  }

  return response.json();
}

// 특정 텍스트 가져오기
export async function fetchTextFromApi(id: string): Promise<TextItem> {
  const response = await fetch(`/api/texts/${id}`);

  if (!response.ok) {
    throw new Error("텍스트를 가져오는 중 오류가 발생했습니다");
  }

  return response.json();
}

// 새 텍스트 추가하기
export async function addTextToApi({
  text,
  examType,
  level,
  language = "한국어",
}: {
  text: string;
  examType?: ExamType;
  level?: Level;
  language?: Language;
}): Promise<TextItem> {
  const response = await fetch("/api/texts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, examType, level, language }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "텍스트 추가 중 오류가 발생했습니다");
  }

  return response.json();
}

// 텍스트 업데이트하기
export async function updateTextInApi(
  id: number | string,
  updateData: Partial<{
    text: string;
    status: string;
    examType: ExamType;
    level: Level;
    language: Language;
    audioUrl: string;
  }>
): Promise<TextItem> {
  const response = await fetch(`/api/texts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "텍스트 업데이트 중 오류가 발생했습니다");
  }

  return response.json();
}

// 텍스트 삭제하기
export async function deleteTextFromApi(id: string): Promise<void> {
  const response = await fetch(`/api/texts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("텍스트를 삭제하는 중 오류가 발생했습니다");
  }
}

// 텍스트 음성으로 변환
export async function convertTextToSpeechApi(id: string): Promise<TextItem> {
  const response = await fetch(`/api/texts/${id}/speech`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("텍스트를 음성으로 변환하는 중 오류가 발생했습니다");
  }

  return response.json();
}
