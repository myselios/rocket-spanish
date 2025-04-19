import { NextRequest, NextResponse } from "next/server";
import { TextItem } from "@/types";
import { fetchTextsFromSupabase, addTextToSupabase } from "@/utils/supabaseApi";

// GET 요청 처리 - 모든 텍스트 목록 가져오기
export async function GET(): Promise<Response> {
  try {
    console.log("GET /api/files 요청 처리 중...");

    // Supabase에서 텍스트 데이터 가져오기
    const texts = await fetchTextsFromSupabase();

    console.log(`텍스트 데이터 ${texts.length}개 불러옴`);
    return NextResponse.json({ texts });
  } catch (error) {
    console.error("Error in GET /api/files:", error);
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST 요청 처리 - 새 텍스트 생성하기
export async function POST(request: NextRequest): Promise<Response> {
  try {
    console.log("POST /api/files 요청 처리 중...");
    const body = await request.json();

    // 필수 필드 확인
    if (!body.content) {
      return NextResponse.json(
        { error: "텍스트 내용은 필수 항목입니다." },
        { status: 400 }
      );
    }

    // 새 텍스트 객체 생성
    const newTextData: Omit<TextItem, "id"> = {
      text: body.content,
      language: body.language || "korean",
      level: body.level || "중급",
      examType: body.examType || "스널트",
      status: "텍스트만",
      audioUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("새 텍스트 생성:", newTextData);

    // Supabase에 저장
    const newText = await addTextToSupabase(newTextData);

    if (newText) {
      return NextResponse.json({
        success: true,
        text: newText,
      });
    } else {
      return NextResponse.json(
        { error: "텍스트 저장에 실패했습니다." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST /api/files:", error);
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
