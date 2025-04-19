import { NextRequest, NextResponse } from "next/server";
import {
  fetchTextFromSupabase,
  deleteTextFromSupabase,
  updateTextStatusInSupabase,
  updateAudioUrlInSupabase,
} from "@/utils/supabaseApi";

// GET 요청 처리 - 텍스트 항목 가져오기
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "유효하지 않은 ID 형식입니다" },
        { status: 400 }
      );
    }

    const text = await fetchTextFromSupabase(id);

    if (!text) {
      return NextResponse.json(
        { error: "텍스트를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json(text);
  } catch (error) {
    console.error(`텍스트 항목 가져오기 오류 (ID: ${params.id}):`, error);

    return NextResponse.json(
      {
        error: "텍스트 항목을 가져오는 중 오류가 발생했습니다",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE 요청 처리 - 텍스트 항목 삭제하기
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "유효하지 않은 ID 형식입니다" },
        { status: 400 }
      );
    }

    await deleteTextFromSupabase(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`텍스트 항목 삭제 오류 (ID: ${params.id}):`, error);

    return NextResponse.json(
      {
        error: "텍스트 항목을 삭제하는 중 오류가 발생했습니다",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PATCH 요청 처리 - 텍스트 항목 업데이트하기
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "유효하지 않은 ID 형식입니다" },
        { status: 400 }
      );
    }

    const data = await request.json();
    let updated = false;

    // status 업데이트
    if (data.status) {
      await updateTextStatusInSupabase(id, data.status);
      updated = true;
    }

    // audioUrl 업데이트
    if (data.audioUrl) {
      await updateAudioUrlInSupabase(id, data.audioUrl);
      updated = true;
    }

    if (!updated) {
      return NextResponse.json(
        { error: "업데이트할 필드가 제공되지 않았습니다" },
        { status: 400 }
      );
    }

    const updatedText = await fetchTextFromSupabase(id);

    return NextResponse.json(updatedText);
  } catch (error) {
    console.error(`텍스트 항목 업데이트 오류 (ID: ${params.id}):`, error);

    return NextResponse.json(
      {
        error: "텍스트 항목을 업데이트하는 중 오류가 발생했습니다",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
