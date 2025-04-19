import { NextRequest, NextResponse } from "next/server";
import { fetchTextsFromSupabase, addTextToSupabase } from "@/utils/supabaseApi";
import { ExamType, Level, Language } from "@/types";

// GET 핸들러 - 모든 텍스트 항목 조회
export async function GET(): Promise<Response> {
  try {
    const texts = await fetchTextsFromSupabase();
    return NextResponse.json(texts);
  } catch (error) {
    console.error("Error fetching texts:", error);
    return NextResponse.json(
      { message: "텍스트 목록 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// POST 핸들러 - 새 텍스트 항목 추가
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { text, examType, level, language } = await request.json();

    // 필수 필드 검증
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { message: "텍스트가 필요합니다" },
        { status: 400 }
      );
    }

    if (!language || typeof language !== "string") {
      return NextResponse.json(
        { message: "언어를 선택해주세요" },
        { status: 400 }
      );
    }

    // 선택적 필드 검증
    if (examType && typeof examType !== "string") {
      return NextResponse.json(
        { message: "유효하지 않은 시험 유형입니다" },
        { status: 400 }
      );
    }

    if (level && typeof level !== "string") {
      return NextResponse.json(
        { message: "유효하지 않은 난이도입니다" },
        { status: 400 }
      );
    }

    // 새 텍스트 추가
    const result = await addTextToSupabase({
      text,
      examType: examType as ExamType,
      level: level as Level,
      language: language as Language,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error adding text:", error);
    return NextResponse.json(
      { message: "텍스트 추가 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
