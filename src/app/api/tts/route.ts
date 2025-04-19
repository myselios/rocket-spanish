import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { processTTS } from "@/utils/tts/ttsService";
import { TextItem } from "@/types";

export async function POST(request: NextRequest): Promise<Response> {
  console.log("========== TTS API 요청 시작 ==========");

  try {
    // 프로젝트 루트 경로 설정
    const projectRoot = process.cwd();
    console.log(`프로젝트 루트 경로: ${projectRoot}`);

    // DB 파일 경로 설정
    const DB_PATH = path.resolve(projectRoot, "db.json");
    console.log(`DB 파일 경로: ${DB_PATH}`);

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

    // DB 파일 존재 확인
    try {
      const { access } = await import("fs/promises");
      await access(DB_PATH);
      console.log(`DB 파일 존재 확인 완료: ${DB_PATH}`);
    } catch (accessError) {
      console.error(`DB 파일 접근 오류: ${DB_PATH}`, accessError);
      return NextResponse.json(
        { error: "DB 파일을 찾을 수 없습니다" },
        { status: 500 }
      );
    }

    // DB 파일 읽기
    let dbData;
    try {
      const { readFile } = await import("fs/promises");
      const dbContent = await readFile(DB_PATH, "utf8");
      console.log(
        `DB 파일 읽기 성공: ${DB_PATH}, 크기: ${dbContent.length} 바이트`
      );

      try {
        dbData = JSON.parse(dbContent);
        console.log(
          `DB 파일 파싱 성공: 텍스트 항목 수: ${dbData.texts?.length || 0}`
        );
      } catch (parseError) {
        console.error(`DB 파일 JSON 파싱 오류:`, parseError);
        return NextResponse.json(
          { error: "DB 파일이 유효한 JSON 형식이 아닙니다" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error(`DB 파일 읽기 실패: ${DB_PATH}`, error);
      return NextResponse.json(
        { error: "DB 파일을 읽는 중 오류가 발생했습니다" },
        { status: 500 }
      );
    }

    // 해당 id를 가진 텍스트 항목 찾기
    const textItem = dbData.texts.find(
      (item: { id: number }) => item.id === text_id
    );

    if (textItem) {
      console.log(`찾은 텍스트 항목:`);
      console.log(`- ID: ${textItem.id}`);
      console.log(`- 언어: ${textItem.language}`);
      console.log(`- 상태: ${textItem.status}`);
      console.log(`- 텍스트 길이: ${textItem.text?.length || 0}자`);
    } else {
      console.error(`ID ${text_id}를 가진 텍스트를 찾을 수 없음`);
    }

    if (!textItem) {
      return NextResponse.json(
        { error: `ID ${text_id}를 가진 텍스트를 찾을 수 없습니다` },
        { status: 404 }
      );
    }

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
      ttsResult = await processTTS(textItem as TextItem);
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

    // db.json 파일 업데이트
    try {
      // 텍스트 항목 상태 업데이트
      textItem.status = "TTS 완료";
      textItem.audioPath = outputDir;
      textItem.audioUrl = `file://${outputDir}/output_1.mp3`;
      textItem.updatedAt = new Date().toISOString();
      textItem.tts_files = mp3Files;

      console.log(`텍스트 항목 상태 업데이트:`, {
        status: textItem.status,
        audioPath: textItem.audioPath,
        updatedAt: textItem.updatedAt,
      });

      // db.json 파일에 변경사항 저장
      const { writeFile } = await import("fs/promises");
      await writeFile(DB_PATH, JSON.stringify(dbData, null, 2), "utf8");
      console.log(`DB 파일 업데이트 성공: ${DB_PATH}`);
    } catch (updateError) {
      console.error(`DB 파일 업데이트 실패: ${DB_PATH}`, updateError);
      return NextResponse.json(
        {
          error: "DB 파일 업데이트 중 오류가 발생했습니다",
          success: true,
          text_id,
          outputDir,
          mp3Files,
        },
        { status: 500 }
      );
    }

    console.log("========== TTS API 요청 완료 ==========");
    console.log("TTS 변환 완료: ", { text_id, outputDir, mp3Files });

    // 응답 반환
    return NextResponse.json({
      success: true,
      text_id,
      outputDir,
      mp3Files,
    });
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
