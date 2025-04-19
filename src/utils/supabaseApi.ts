import { ExamType, Level, Language } from "@/types";
import { supabase, TEXTS_TABLE } from "./supabase";
import { put } from "@vercel/blob";

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

// 텍스트 상태 타입
export type TextStatus =
  | "텍스트만"
  | "TTS 처리 중"
  | "TTS 완료"
  | "음성 변환 완료"
  | "TTS 변환 실패"
  | "변환 완료"
  | "오디오 생성됨";

/**
 * Supabase에서 모든 텍스트 가져오기
 */
export async function fetchTextsFromSupabase(): Promise<TextItem[]> {
  try {
    const { data, error } = await supabase
      .from(TEXTS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("텍스트 조회 오류:", error);
      throw error;
    }

    // 데이터베이스의 snake_case 필드를 JavaScript의 camelCase로 변환
    return data.map((item) => ({
      id: item.id,
      text: item.text,
      status: item.status,
      audioUrl: item.audio_url,
      createdAt: item.created_at,
      examType: item.exam_type,
      level: item.level,
      language: item.language || "한국어", // 기본값 설정
    }));
  } catch (error) {
    console.error("텍스트 조회 오류:", error);
    throw error;
  }
}

/**
 * ID로 단일 텍스트 항목 가져오기
 */
export async function fetchTextFromSupabase(
  id: number
): Promise<TextItem | null> {
  try {
    const { data, error } = await supabase
      .from(TEXTS_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 결과가 없는 경우
        return null;
      }
      console.error(`텍스트 항목 가져오기 오류 (ID: ${id}):`, error);
      throw error;
    }

    // 데이터베이스의 snake_case 필드를 JavaScript의 camelCase로 변환
    return {
      id: data.id,
      text: data.text,
      status: data.status,
      audioUrl: data.audio_url,
      createdAt: data.created_at,
      examType: data.exam_type,
      level: data.level,
      language: data.language || "한국어",
    };
  } catch (error) {
    console.error(`텍스트 항목 가져오기 오류 (ID: ${id}):`, error);
    throw error;
  }
}

/**
 * 새 텍스트를 Supabase에 추가
 */
export async function addTextToSupabase({
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
  try {
    const now = new Date().toISOString();

    // 기본 필드
    const textData = {
      text,
      status: "텍스트만" as TextStatus,
      audio_url: null,
      exam_type: examType || null,
      level: level || null,
      language,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from(TEXTS_TABLE)
      .insert(textData)
      .select()
      .single();

    if (error) {
      console.error("텍스트 추가 오류:", error);
      throw error;
    }

    // 데이터베이스의 snake_case 필드를 JavaScript의 camelCase로 변환
    return {
      id: data.id,
      text: data.text,
      status: data.status,
      audioUrl: data.audio_url,
      createdAt: data.created_at,
      examType: data.exam_type,
      level: data.level,
      language: data.language,
    };
  } catch (error) {
    console.error("텍스트 추가 오류:", error);
    throw error;
  }
}

/**
 * 텍스트를 Supabase에서 삭제
 */
export async function deleteTextFromSupabase(id: number): Promise<void> {
  try {
    // 실제 구현에서는 연결된 오디오 파일이 있다면 삭제하는 로직이 필요할 수 있음
    const { error } = await supabase.from(TEXTS_TABLE).delete().eq("id", id);

    if (error) {
      console.error(`텍스트 삭제 오류 (ID: ${id}):`, error);
      throw error;
    }
  } catch (error) {
    console.error(`텍스트 삭제 오류 (ID: ${id}):`, error);
    throw error;
  }
}

/**
 * 텍스트 상태 업데이트
 */
export async function updateTextStatusInSupabase(
  id: number,
  status: TextStatus,
  audioUrl?: string
): Promise<void> {
  try {
    const updateData: { status: TextStatus; audio_url?: string } = { status };

    // audioUrl이 제공된 경우 업데이트 데이터에 추가
    if (audioUrl) {
      updateData.audio_url = audioUrl;
    }

    const { error } = await supabase
      .from(TEXTS_TABLE)
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error(`텍스트 상태 업데이트 오류 (ID: ${id}):`, error);
      throw error;
    }
  } catch (error) {
    console.error(`텍스트 상태 업데이트 오류 (ID: ${id}):`, error);
    throw error;
  }
}

/**
 * 오디오 URL 업데이트
 */
export async function updateAudioUrlInSupabase(
  id: number,
  audioUrl: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from(TEXTS_TABLE)
      .update({ audio_url: audioUrl })
      .eq("id", id);

    if (error) {
      console.error(`오디오 URL 업데이트 오류 (ID: ${id}):`, error);
      throw error;
    }
  } catch (error) {
    console.error(`오디오 URL 업데이트 오류 (ID: ${id}):`, error);
    throw error;
  }
}

// 텍스트를 음성으로 변환하고 Vercel Blob Storage에 업로드
export async function convertTextToSpeechWithBlobStorage(
  textId: number,
  mp3Buffer: Buffer
): Promise<string | null> {
  try {
    // Vercel Blob Storage에 MP3 파일 업로드
    const blob = await put(`tts_${textId}_${Date.now()}.mp3`, mp3Buffer, {
      access: "public",
    });

    // Supabase에서 텍스트 상태 업데이트
    await updateTextStatusInSupabase(textId, "TTS 완료");

    return blob.url;
  } catch (error) {
    console.error("TTS 변환 및 업로드 오류:", error);
    return null;
  }
}
