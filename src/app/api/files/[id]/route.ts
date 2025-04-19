import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {
  fetchTextFromSupabase,
  deleteTextFromSupabase,
  updateTextStatusInSupabase,
} from "@/utils/supabaseApi";

// GET 요청 처리 - 특정 ID의 텍스트 가져오기
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const { id } = params;
    console.log(`GET /api/files/${id} 요청 처리 중...`);

    if (!id) {
      return NextResponse.json(
        { error: "ID는 필수 항목입니다" },
        { status: 400 }
      );
    }

    // Supabase에서 텍스트 가져오기
    const text = await fetchTextFromSupabase(parseInt(id, 10));

    if (!text) {
      return NextResponse.json(
        { error: "텍스트를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 파일 경로 확인 및 반환
    return NextResponse.json(
      {
        success: true,
        text,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "파일을 가져오는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// DELETE 요청 처리 - 특정 ID의 텍스트 삭제하기
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const { id } = params;
    console.log(`DELETE /api/files/${id} 요청 처리 중...`);

    // Supabase에서 텍스트 삭제
    const success = await deleteTextFromSupabase(parseInt(id, 10));

    if (success) {
      console.log(`텍스트 ID ${id} 삭제 성공`);
      return NextResponse.json({
        success: true,
        message: "텍스트가 삭제되었습니다.",
      });
    } else {
      console.error(`텍스트 ID ${id} 삭제 실패`);
      return NextResponse.json(
        { error: "텍스트 삭제에 실패했습니다." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error in DELETE /api/files/:id:`, error);
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PATCH 또는 PUT 요청 처리 - 특정 ID의 텍스트 업데이트하기
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const { id } = params;
    console.log(`PATCH /api/files/${id} 요청 처리 중...`);

    // 기존 텍스트 확인
    const text = await fetchTextFromSupabase(parseInt(id, 10));

    if (!text) {
      console.error(`텍스트 ID ${id}를 찾을 수 없습니다.`);
      return NextResponse.json(
        { error: "텍스트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const updateData = await request.json();
    console.log(`텍스트 ID ${id} 업데이트 데이터:`, updateData);

    // Supabase에서 텍스트 업데이트
    const updatedText = await updateTextStatusInSupabase(
      parseInt(id, 10),
      updateData.status || text.status,
      updateData.audioUrl
    );

    if (updatedText) {
      console.log(`텍스트 ID ${id} 업데이트 성공:`, updatedText);
      return NextResponse.json({
        success: true,
        text: updatedText,
      });
    } else {
      console.error(`텍스트 ID ${id} 업데이트 실패`);
      return NextResponse.json(
        { error: "텍스트 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error in PATCH /api/files/:id:`, error);
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
