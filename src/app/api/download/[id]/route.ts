import { NextRequest, NextResponse } from "next/server";
import { fetchTextFromSupabase } from "@/utils/supabaseApi";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  console.log(`다운로드 API 요청 받음: ID ${params.id}`);

  try {
    // ID를 숫자로 변환
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      console.error(`유효하지 않은 ID 형식: ${params.id}`);
      return NextResponse.json(
        { error: "유효하지 않은 ID 형식입니다" },
        { status: 400 }
      );
    }

    // Supabase에서 텍스트 항목 가져오기
    const textItem = await fetchTextFromSupabase(id);

    if (!textItem) {
      console.error(`텍스트 항목을 찾을 수 없음: ID ${id}`);
      return NextResponse.json(
        { error: "텍스트 항목을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 오디오 URL 확인
    if (!textItem.audioUrl) {
      console.error(`오디오 URL이 없음: ID ${id}`);
      return NextResponse.json(
        { error: "이 텍스트에 대한 오디오 파일이 없습니다" },
        { status: 404 }
      );
    }

    console.log(`오디오 URL: ${textItem.audioUrl}`);

    // URL이 'https://'로 시작하는지 확인 (Vercel Blob Storage)
    if (textItem.audioUrl.startsWith("https://")) {
      // 오디오 파일 다운로드
      try {
        console.log(`원격 오디오 파일 다운로드 중: ${textItem.audioUrl}`);

        // 리디렉션 응답 반환
        return NextResponse.redirect(textItem.audioUrl);
      } catch (downloadError) {
        console.error(`오디오 파일 다운로드 오류:`, downloadError);
        return NextResponse.json(
          { error: "오디오 파일 다운로드 중 오류가 발생했습니다" },
          { status: 500 }
        );
      }
    }
    // 로컬 파일 경로인 경우
    else if (textItem.audioPath) {
      try {
        const filePath = path.join(process.cwd(), textItem.audioPath);
        console.log(`로컬 오디오 파일 경로: ${filePath}`);

        if (!fs.existsSync(filePath)) {
          console.error(`파일을 찾을 수 없음: ${filePath}`);
          return NextResponse.json(
            { error: "오디오 파일을 찾을 수 없습니다" },
            { status: 404 }
          );
        }

        // 파일을 스트림으로 읽어 응답으로 반환
        const fileBuffer = fs.readFileSync(filePath);
        const headers = new Headers();
        headers.set("Content-Type", "audio/mpeg");
        headers.set(
          "Content-Disposition",
          `attachment; filename="audio_${id}.mp3"`
        );

        return new Response(fileBuffer, {
          headers,
        });
      } catch (fileError) {
        console.error(`로컬 파일 처리 오류:`, fileError);
        return NextResponse.json(
          { error: "오디오 파일 처리 중 오류가 발생했습니다" },
          { status: 500 }
        );
      }
    } else {
      console.error(`유효한 오디오 URL 또는 경로가 없음: ID ${id}`);
      return NextResponse.json(
        { error: "유효한 오디오 URL 또는 경로가 없습니다" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`다운로드 처리 중 오류:`, error);
    return NextResponse.json(
      {
        error: "다운로드 처리 중 오류가 발생했습니다",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
