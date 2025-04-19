import { createClient } from "@supabase/supabase-js";

// Supabase URL과 서비스 키를 환경 변수에서 로드
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase 클라이언트가 초기화되지 않은 경우 오류 메시지 표시
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase URL 또는 API 키가 지정되지 않았습니다. 환경 변수를 확인하세요."
  );
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

// 텍스트 데이터를 위한 테이블 이름
export const TEXTS_TABLE = "texts";
