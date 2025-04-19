import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, readdir, mkdir, stat } from "fs/promises";
import { exec } from "child_process";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

// 디렉토리 존재 여부 확인 및 생성하는 유틸리티 함수
async function ensureDirectoryExists(dirPath: string) {
  try {
    // 디렉토리 상태 확인
    await stat(dirPath);
    console.log(`디렉토리가 이미 존재합니다: ${dirPath}`);
  } catch (error: unknown) {
    // ENOENT 오류는 디렉토리가 존재하지 않음을 의미
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      try {
        await mkdir(dirPath, { recursive: true });
        console.log(`디렉토리를 생성했습니다: ${dirPath}`);
      } catch (mkdirError) {
        console.error(`디렉토리 생성 중 오류 발생: ${dirPath}`, mkdirError);
        throw mkdirError;
      }
    } else {
      console.error(`디렉토리 확인 중 오류 발생: ${dirPath}`, error);
      throw error;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // 프로젝트 루트 경로 설정
    const projectRoot = process.cwd();
    console.log(`프로젝트 루트 경로: ${projectRoot}`);

    // 절대 경로로 디렉토리 및 파일 경로 설정
    const TEXT_DIR = path.resolve(projectRoot, "src", "data", "input");
    const INPUT_FILE_PATH = path.resolve(TEXT_DIR, "input.txt");
    const DB_PATH = path.resolve(projectRoot, "db.json");

    console.log(`텍스트 디렉토리 경로: ${TEXT_DIR}`);
    console.log(`입력 파일 경로: ${INPUT_FILE_PATH}`);
    console.log(`DB 파일 경로: ${DB_PATH}`);

    // 요청 본문에서 text_id 파싱
    const body = await request.json();
    // id를 숫자로 변환 (프론트엔드에서 문자열로 전송될 수 있음)
    const text_id = Number(body.id);

    console.log(`변환할 텍스트 ID: ${text_id}`);

    if (!text_id) {
      return NextResponse.json(
        { error: "유효한 text_id가 필요합니다" },
        { status: 400 }
      );
    }

    // DB 파일 읽기
    let dbData;
    try {
      const dbContent = await readFile(DB_PATH, "utf8");
      dbData = JSON.parse(dbContent);
      console.log(`DB 파일 읽기 성공: ${DB_PATH}`);
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
    console.log(`찾은 텍스트 항목:`, JSON.stringify(textItem, null, 2));

    if (!textItem) {
      return NextResponse.json(
        { error: `ID ${text_id}를 가진 텍스트를 찾을 수 없습니다` },
        { status: 404 }
      );
    }

    // 디렉토리 존재 여부 확인 및 생성
    await ensureDirectoryExists(TEXT_DIR);

    // input.txt 파일에 텍스트 저장
    try {
      await writeFile(INPUT_FILE_PATH, textItem.text, "utf8");
      console.log(`텍스트를 파일에 저장했습니다: ${INPUT_FILE_PATH}`);

      // 파일이 실제로 생성되었는지 확인
      try {
        const stats = await stat(INPUT_FILE_PATH);
        console.log(
          `파일 생성 확인: ${INPUT_FILE_PATH}, 크기: ${stats.size} 바이트`
        );
      } catch (checkError) {
        console.error(`파일 생성 확인 실패: ${INPUT_FILE_PATH}`, checkError);
      }
    } catch (writeError) {
      console.error(`파일 쓰기 실패: ${INPUT_FILE_PATH}`, writeError);
      return NextResponse.json(
        { error: "텍스트를 파일에 저장하는 중 오류가 발생했습니다" },
        { status: 500 }
      );
    }

    // Python 스크립트 실행 (절대 경로 사용)
    const scriptPath = path.resolve(
      projectRoot,
      "src",
      "scripts",
      "minimax_tts.py"
    );
    console.log(`실행할 스크립트 경로: ${scriptPath}`);

    // 텍스트 항목에서 언어 정보 가져오기
    const language = textItem.language || "korean"; // 기본값은 korean
    console.log(`텍스트 언어 타입: ${typeof textItem.language}`);
    console.log(`텍스트 언어 값: ${textItem.language}`);
    console.log(`사용할 언어 매개변수: ${language}`);

    let scriptOutput;
    try {
      // Python 실행 가능 여부 확인
      console.log("Python 실행 가능 여부 확인 중...");
      try {
        await execPromise("python --version");
        console.log("Python이 정상적으로 설치되어 있습니다.");
      } catch (pythonCheckError) {
        console.error("Python 확인 오류:", pythonCheckError);
        return NextResponse.json(
          { error: "Python이 설치되어 있지 않거나 실행할 수 없습니다" },
          { status: 500 }
        );
      }

      // 스크립트 파일 존재 여부 확인
      try {
        await stat(scriptPath);
        console.log(`스크립트 파일이 존재합니다: ${scriptPath}`);
      } catch (statError) {
        console.error(
          `스크립트 파일이 존재하지 않습니다: ${scriptPath}`,
          statError
        );
        return NextResponse.json(
          { error: `스크립트 파일을 찾을 수 없습니다: ${scriptPath}` },
          { status: 500 }
        );
      }

      console.log(`스크립트 실행 명령: python ${scriptPath} ${language}`);
      const { stdout, stderr } = await execPromise(
        `python ${scriptPath} ${language}`
      );
      scriptOutput = stdout;
      console.log(`스크립트 실행 성공: ${scriptPath}`);
      console.log(`스크립트 출력: ${stdout}`);

      if (stderr) {
        console.error(`스크립트 오류 출력: ${stderr}`);
      }
    } catch (error) {
      console.error(`스크립트 실행 실패: ${scriptPath}`, error);
      // 더 자세한 오류 정보 추출
      const errorDetail =
        error instanceof Error ? error.message : String(error);
      return NextResponse.json(
        {
          error: "TTS 변환 스크립트 실행 중 오류가 발생했습니다",
          detail: errorDetail,
          command: `python ${scriptPath} ${language}`,
        },
        { status: 500 }
      );
    }

    // 스크립트의 출력에서 출력 디렉토리 경로 추출
    // 출력 패턴 1: "출력 폴더: {path}"
    // 출력 패턴 2: "OUTPUT_DIR={path}"
    let outputDir = null;
    const folderMatch = scriptOutput.match(/출력 폴더: (.+?)(\r?\n|$)/);
    const dirMatch = scriptOutput.match(/OUTPUT_DIR=(.+?)(\r?\n|$)/);

    if (folderMatch) {
      outputDir = folderMatch[1].trim();
      console.log(`"출력 폴더:" 패턴에서 추출된 디렉토리: ${outputDir}`);
    } else if (dirMatch) {
      outputDir = dirMatch[1].trim();
      console.log(`"OUTPUT_DIR=" 패턴에서 추출된 디렉토리: ${outputDir}`);
    }

    console.log(`추출된 출력 디렉토리: ${outputDir}`);

    if (!outputDir) {
      console.error(
        "출력 디렉토리를 찾을 수 없습니다. 스크립트 출력:",
        scriptOutput
      );
      return NextResponse.json(
        { error: "출력 디렉토리를 찾을 수 없습니다" },
        { status: 500 }
      );
    }

    // 상대 경로로 출력 디렉토리 재설정 (한글 경로 문제 우회)
    // 프로젝트 기준으로 상대 경로를 사용하여 한글 인코딩 문제 방지
    const timeStampDirName = path.basename(outputDir);
    const relativeOutputDir = path.join(
      "src",
      "data",
      "output",
      timeStampDirName
    );
    const normalizedOutputDir = path.resolve(projectRoot, relativeOutputDir);

    console.log(`타임스탬프 디렉토리: ${timeStampDirName}`);
    console.log(`상대 출력 경로: ${relativeOutputDir}`);
    console.log(`정규화된 출력 경로: ${normalizedOutputDir}`);

    // 출력 디렉토리 존재 여부 확인
    try {
      await stat(normalizedOutputDir);
      console.log(`출력 디렉토리가 존재합니다: ${normalizedOutputDir}`);
      outputDir = normalizedOutputDir;
    } catch (error: unknown) {
      console.error(
        `출력 디렉토리가 존재하지 않습니다: ${normalizedOutputDir}`,
        error
      );

      // 원래 경로로 다시 시도
      try {
        await stat(outputDir);
        console.log(`원래 경로로 출력 디렉토리가 존재합니다: ${outputDir}`);
      } catch (error: unknown) {
        console.error(`원래 경로도 존재하지 않습니다: ${outputDir}`, error);
        return NextResponse.json(
          { error: "유효한 출력 디렉토리를 찾을 수 없습니다" },
          { status: 500 }
        );
      }
    }

    // 디렉토리 내의 mp3 파일들 가져오기
    let mp3Files;
    try {
      const files = await readdir(outputDir);
      mp3Files = files.filter((file) => file.endsWith(".mp3"));
      console.log(`MP3 파일 목록: ${mp3Files.join(", ")}`);
    } catch (error) {
      console.error(`출력 디렉토리 읽기 실패: ${outputDir}`, error);
      return NextResponse.json(
        { error: "MP3 파일 목록을 가져오는 중 오류가 발생했습니다" },
        { status: 500 }
      );
    }

    // DB에 정보 업데이트
    textItem.status = "converted";
    textItem.tts_files = mp3Files.map((file) => path.join(outputDir, file));

    try {
      await writeFile(DB_PATH, JSON.stringify(dbData, null, 2), "utf8");
      console.log(`DB 파일 업데이트 성공: ${DB_PATH}`);
    } catch (error) {
      console.error(`DB 파일 업데이트 실패: ${DB_PATH}`, error);
      return NextResponse.json(
        { error: "DB 업데이트 중 오류가 발생했습니다" },
        { status: 500 }
      );
    }

    // 응답 반환
    return NextResponse.json({
      success: true,
      text_id,
      output_dir: outputDir,
      files: mp3Files,
    });
  } catch (error) {
    console.error("TTS 변환 중 예상치 못한 오류 발생:", error);
    return NextResponse.json(
      { error: "TTS 변환 중 예상치 못한 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
