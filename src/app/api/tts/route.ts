import { NextRequest, NextResponse } from "next/server";
import { processTTS } from "@/utils/tts/ttsService";
import {
  fetchTextFromSupabase,
  updateTextStatusInSupabase,
} from "@/utils/supabaseApi";
import { put } from "@vercel/blob";
import { readFile } from "fs/promises";

export async function POST(request: NextRequest): Promise<Response> {
  console.log("========== TTS API 요청 시작 ==========");

  try {
    // 요청 본문에서 text_id 파싱
    let body;
    try {
      body = await request.json();
      console.log(`요청 본문: ${JSON.stringify(body)}`);
    } catch (parseError) {
      console.error(`요청 본문 파싱 오류:`, parseError);
      return NextResponse.json(
        { error: "유효하지 않은 요청 본문입니다" },
        { status: 400 }
      );
    }

    // id를 숫자로 변환 (프론트엔드에서 문자열로 전송될 수 있음)
    const text_id = Number(body.text_id);

    console.log(`변환할 텍스트 ID: ${text_id}`);

    if (!text_id) {
      console.error(`유효하지 않은 text_id: ${body.text_id}`);
      return NextResponse.json(
        { error: "유효한 text_id가 필요합니다" },
        { status: 400 }
      );
    }

    // Supabase에서 텍스트 항목 가져오기
    const textItem = await fetchTextFromSupabase(text_id);

    if (!textItem) {
      console.error(`ID ${text_id}를 가진 텍스트를 찾을 수 없음`);
      return NextResponse.json(
        { error: `ID ${text_id}를 가진 텍스트를 찾을 수 없습니다` },
        { status: 404 }
      );
    }

    console.log(`찾은 텍스트 항목:`);
    console.log(`- ID: ${textItem.id}`);
    console.log(`- 언어: ${textItem.language}`);
    console.log(`- 상태: ${textItem.status}`);
    console.log(`- 텍스트 길이: ${textItem.text?.length || 0}자`);

    // 텍스트 검증
    if (!textItem.text || textItem.text.trim() === "") {
      console.error(`텍스트 내용이 비어 있음: ID ${text_id}`);
      return NextResponse.json(
        { error: "텍스트 내용이 비어 있습니다" },
        { status: 400 }
      );
    }

    console.log("TTS 변환 프로세스 시작...");
    // TTS 처리 실행
    let ttsResult;
    try {
      ttsResult = await processTTS(textItem);
      console.log(`TTS 변환 성공:`, ttsResult);
    } catch (ttsError) {
      console.error(`TTS 변환 처리 오류:`, ttsError);
      return NextResponse.json(
        {
          error: "TTS 변환 중 오류가 발생했습니다",
          details:
            ttsError instanceof Error ? ttsError.message : String(ttsError),
        },
        { status: 500 }
      );
    }

    const { outputDir, mp3Files } = ttsResult;

    // MP3 파일 생성 확인
    if (mp3Files.length === 0) {
      console.warn(`생성된 MP3 파일이 없음: ${outputDir}`);
      // 오류로 처리하지 않고 경고만 남김
    }

    // Vercel Blob Storage에 파일 업로드
    try {
      if (mp3Files.length === 0) {
        throw new Error("생성된 MP3 파일이 없습니다");
      }

      const mp3FilePath = mp3Files[0]; // 첫 번째 MP3 파일 사용
      console.log(`MP3 파일 경로: ${mp3FilePath}`);

      // 파일 내용을 버퍼로 읽기
      try {
        const fileBuffer = await readFile(mp3FilePath);

        // Vercel Blob Storage에 업로드
        const blob = await put(`tts_${text_id}_${Date.now()}.mp3`, fileBuffer, {
          access: "public",
        });

        console.log(`Blob Storage에 업로드 완료: ${blob.url}`);

        // Supabase에서 텍스트 상태 업데이트
        await updateTextStatusInSupabase(text_id, "TTS 완료", blob.url);

        console.log(`텍스트 상태 업데이트 완료: ${text_id}`);

        console.log("========== TTS API 요청 완료 ==========");

        // 응답 반환
        return NextResponse.json({
          success: true,
          text_id,
          audioUrl: blob.url,
          mp3Files: [mp3FilePath],
        });
      } catch (readError) {
        console.error(`파일 읽기 오류: ${mp3FilePath}`, readError);
        throw new Error(`MP3 파일을 읽을 수 없습니다: ${mp3FilePath}`);
      }
    } catch (uploadError) {
      console.error(`파일 업로드 또는 DB 업데이트 오류:`, uploadError);
      return NextResponse.json(
        {
          error: "파일 업로드 또는 DB 업데이트 중 오류가 발생했습니다",
          details:
            uploadError instanceof Error
              ? uploadError.message
              : String(uploadError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("========== TTS API 요청 실패 ==========");
    console.error("TTS 변환 중 오류:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다",
        success: false,
      },
      { status: 500 }
    );
  }
}
