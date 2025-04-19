import { exec } from "child_process";
import { writeFile, readdir, mkdir, stat, access } from "fs/promises";
import path from "path";
import util from "util";
import { TextItem } from "@/types";
import { ExecException } from "child_process";

const execPromise = util.promisify(exec);

// 디렉토리 존재 여부 확인 및 생성하는 유틸리티 함수
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    // 디렉토리 상태 확인
    await stat(dirPath);
    console.log(`디렉토리가 이미 존재합니다: ${dirPath}`);
  } catch (error: unknown) {
    // ENOENT 오류는 디렉토리가 존재하지 않음을 의미
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      try {
        console.log(`디렉토리를 생성 시도: ${dirPath}`);
        await mkdir(dirPath, { recursive: true });

        // 디렉토리 생성 확인
        try {
          await access(dirPath);
          console.log(`디렉토리를 성공적으로 생성했습니다: ${dirPath}`);
        } catch (accessError) {
          console.error(
            `디렉토리 접근 권한 확인 실패: ${dirPath}`,
            accessError
          );
          throw new Error(
            `디렉토리를 생성했으나 접근할 수 없습니다: ${dirPath}`
          );
        }
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

// 텍스트를 파일에 저장하는 함수
export async function saveTextToFile(
  filePath: string,
  text: string
): Promise<void> {
  try {
    // 파일 디렉토리 확인 및 생성
    const fileDir = path.dirname(filePath);
    await ensureDirectoryExists(fileDir);

    await writeFile(filePath, text, "utf8");
    console.log(`텍스트를 파일에 저장했습니다: ${filePath}`);

    // 파일이 실제로 생성되었는지 확인
    const stats = await stat(filePath);
    console.log(`파일 생성 확인: ${filePath}, 크기: ${stats.size} 바이트`);
  } catch (error) {
    console.error(`파일 쓰기 실패: ${filePath}`, error);
    throw new Error(
      `텍스트를 파일에 저장하는 중 오류가 발생했습니다: ${error}`
    );
  }
}

// Python 스크립트 실행 함수
export async function runTtsScript(
  scriptPath: string,
  language: string
): Promise<string> {
  console.log(`실행할 스크립트 경로: ${scriptPath}`);
  console.log(`사용할 언어 매개변수: ${language}`);

  try {
    // 스크립트 파일 존재 여부 확인
    try {
      await stat(scriptPath);
      console.log(`스크립트 파일이 존재합니다: ${scriptPath}`);
    } catch (statError) {
      console.error(
        `스크립트 파일이 존재하지 않습니다: ${scriptPath}`,
        statError
      );
      throw new Error(`스크립트 파일을 찾을 수 없습니다: ${scriptPath}`);
    }

    // Python 실행 명령 설정 (Docker 환경에서는 가상환경 사용)
    const pythonCommand =
      process.env.NODE_ENV === "production"
        ? "/app/venv/bin/python3"
        : "python";

    console.log(`사용할 Python 명령: ${pythonCommand}`);
    console.log(`현재 실행 환경: ${process.env.NODE_ENV || "development"}`);
    console.log(
      `스크립트 실행 명령: ${pythonCommand} ${scriptPath} ${language}`
    );

    // 권한 확인
    try {
      await access(scriptPath);
      console.log(`스크립트 파일 접근 권한 확인 완료: ${scriptPath}`);
    } catch (accessError) {
      console.error(`스크립트 파일 접근 권한 오류: ${scriptPath}`, accessError);
      throw new Error(`스크립트 파일에 접근할 수 없습니다: ${scriptPath}`);
    }

    const { stdout, stderr } = await execPromise(
      `${pythonCommand} ${scriptPath} ${language}`
    );
    console.log(`스크립트 실행 성공: ${scriptPath}`);
    console.log(`스크립트 출력: ${stdout}`);

    if (stderr) {
      console.error(`스크립트 오류 출력: ${stderr}`);
    }

    return stdout;
  } catch (error) {
    console.error(`스크립트 실행 실패: ${scriptPath}`, error);
    // 더 자세한 오류 정보 추출
    let errorDetail = "";
    if (error instanceof Error) {
      errorDetail = error.message;
      if ("stderr" in error) {
        errorDetail += `\n스크립트 오류 출력: ${
          (error as ExecException & { stderr: string }).stderr
        }`;
      }
    } else {
      errorDetail = String(error);
    }

    throw new Error(
      `TTS 변환 스크립트 실행 중 오류가 발생했습니다: ${errorDetail}`
    );
  }
}

// 스크립트 출력에서 출력 디렉토리 경로 추출 함수
export function extractOutputDir(
  scriptOutput: string,
  projectRoot: string
): string {
  // 스크립트의 출력에서 출력 디렉토리 경로 추출
  // 출력 패턴 1: "출력 폴더: {path}"
  // 출력 패턴 2: "OUTPUT_DIR={path}"
  let outputDir = null;
  console.log(`스크립트 출력 분석 중: ${scriptOutput}`);

  const folderMatch = scriptOutput.match(/출력 폴더: (.+?)(\r?\n|$)/);
  const dirMatch = scriptOutput.match(/OUTPUT_DIR=(.+?)(\r?\n|$)/);

  if (folderMatch) {
    outputDir = folderMatch[1].trim();
    console.log(`"출력 폴더:" 패턴에서 추출된 디렉토리: ${outputDir}`);
  } else if (dirMatch) {
    outputDir = dirMatch[1].trim();
    console.log(`"OUTPUT_DIR=" 패턴에서 추출된 디렉토리: ${outputDir}`);
  } else {
    console.log("기존 패턴으로 출력 폴더를 찾을 수 없음");
    // 다른 패턴 시도
    const lines = scriptOutput.split(/\r?\n/);
    for (const line of lines) {
      if (line.includes("output") && line.includes("/")) {
        outputDir = line.trim();
        console.log(`대체 패턴으로 출력 디렉토리 후보 찾음: ${outputDir}`);
        break;
      }
    }
  }

  console.log(`추출된 출력 디렉토리: ${outputDir}`);

  if (!outputDir) {
    console.error(
      "출력 디렉토리를 찾을 수 없습니다. 스크립트 출력:",
      scriptOutput
    );
    throw new Error("출력 디렉토리를 찾을 수 없습니다");
  }

  // 상대 경로로 출력 디렉토리 재설정 (한글 경로 문제 우회)
  // 프로젝트 기준으로 상대 경로를 사용하여 한글 인코딩 문제 방지
  const timeStampDirName = path.basename(outputDir);
  const relativeOutputDir = path.join("data", "output", timeStampDirName);
  const normalizedOutputDir = path.resolve(projectRoot, relativeOutputDir);

  console.log(`타임스탬프 디렉토리: ${timeStampDirName}`);
  console.log(`상대 출력 경로: ${relativeOutputDir}`);
  console.log(`정규화된 출력 경로: ${normalizedOutputDir}`);

  return normalizedOutputDir;
}

// 출력 디렉토리 유효성 확인 함수
export async function validateOutputDir(
  normalizedOutputDir: string,
  originalOutputDir: string
): Promise<string> {
  console.log(`출력 디렉토리 유효성 검사 시작...`);
  console.log(`정규화된 출력 경로: ${normalizedOutputDir}`);
  console.log(`원래 출력 경로: ${originalOutputDir}`);

  try {
    const dirStat = await stat(normalizedOutputDir);
    console.log(`출력 디렉토리가 존재합니다: ${normalizedOutputDir}`);
    console.log(`디렉토리 정보: ${JSON.stringify(dirStat)}`);

    // 디렉토리인지 확인
    if (!dirStat.isDirectory()) {
      console.error(`${normalizedOutputDir}가 디렉토리가 아닙니다!`);
      throw new Error(`${normalizedOutputDir}가 디렉토리가 아닙니다`);
    }

    return normalizedOutputDir;
  } catch (error: unknown) {
    console.error(
      `출력 디렉토리가 존재하지 않습니다: ${normalizedOutputDir}`,
      error
    );

    // 대체 경로로 시도
    const alternativePath = path.join(
      process.cwd(),
      "data",
      "output",
      path.basename(normalizedOutputDir)
    );
    console.log(`대체 경로로 시도: ${alternativePath}`);

    try {
      const altStat = await stat(alternativePath);
      console.log(`대체 경로가 존재합니다: ${alternativePath}`);
      if (altStat.isDirectory()) {
        return alternativePath;
      } else {
        console.error(`${alternativePath}가 디렉토리가 아닙니다!`);
      }
    } catch (altError) {
      console.error(
        `대체 경로도 존재하지 않습니다: ${alternativePath}`,
        altError
      );
    }

    // 원래 경로로 다시 시도
    try {
      await stat(originalOutputDir);
      console.log(
        `원래 경로로 출력 디렉토리가 존재합니다: ${originalOutputDir}`
      );
      return originalOutputDir;
    } catch (error: unknown) {
      console.error(
        `원래 경로도 존재하지 않습니다: ${originalOutputDir}`,
        error
      );

      // 마지막 대안으로 새 디렉토리 생성
      try {
        console.log(`새 출력 디렉토리 생성 시도: ${normalizedOutputDir}`);
        await mkdir(normalizedOutputDir, { recursive: true });
        console.log(`새 출력 디렉토리 생성 성공: ${normalizedOutputDir}`);
        return normalizedOutputDir;
      } catch (mkdirError) {
        console.error(
          `새 출력 디렉토리 생성 실패: ${normalizedOutputDir}`,
          mkdirError
        );
        throw new Error("유효한 출력 디렉토리를 찾을 수 없습니다");
      }
    }
  }
}

// MP3 파일 목록 가져오기 함수
export async function getMP3Files(outputDir: string): Promise<string[]> {
  console.log(`MP3 파일 목록 조회 시작: ${outputDir}`);

  try {
    // 디렉토리 확인
    const dirStat = await stat(outputDir);
    if (!dirStat.isDirectory()) {
      console.error(`${outputDir}가 디렉토리가 아닙니다!`);
      throw new Error(`${outputDir}가 디렉토리가 아닙니다`);
    }

    // 파일 목록 가져오기
    const files = await readdir(outputDir);
    console.log(`디렉토리 내 파일 목록: ${files.join(", ")}`);

    const mp3Files = files.filter((file) => file.endsWith(".mp3"));
    console.log(`발견된 MP3 파일: ${mp3Files.join(", ")}`);

    if (mp3Files.length === 0) {
      console.warn(`${outputDir}에 MP3 파일이 없습니다!`);
    }

    return mp3Files.map((file) => path.join(outputDir, file));
  } catch (error) {
    console.error(`MP3 파일 목록 가져오기 실패: ${outputDir}`, error);
    // 오류가 발생했지만, 빈 배열을 반환하여 프로세스는 계속 진행
    return [];
  }
}

// TTS 변환 프로세스 전체 실행 함수
export async function processTTS(textItem: TextItem): Promise<{
  outputDir: string;
  mp3Files: string[];
}> {
  console.log("========== TTS 변환 프로세스 시작 ==========");
  console.log(`처리할 텍스트 항목: ${JSON.stringify(textItem, null, 2)}`);

  // 프로젝트 루트 경로 설정
  const projectRoot = process.cwd();
  console.log(`프로젝트 루트 경로: ${projectRoot}`);

  // 절대 경로로 디렉토리 및 파일 경로 설정
  const TEXT_DIR = path.resolve(projectRoot, "data", "input");
  const INPUT_FILE_PATH = path.resolve(TEXT_DIR, "input.txt");

  console.log(`텍스트 디렉토리 경로: ${TEXT_DIR}`);
  console.log(`입력 파일 경로: ${INPUT_FILE_PATH}`);

  // 텍스트 항목에서 언어 정보 가져오기
  const language = textItem.language || "korean"; // 기본값은 korean
  console.log(`텍스트 언어 타입: ${typeof textItem.language}`);
  console.log(`텍스트 언어 값: ${textItem.language}`);
  console.log(`사용할 언어 매개변수: ${language}`);

  try {
    // 디렉토리 존재 여부 확인 및 생성
    await ensureDirectoryExists(TEXT_DIR);

    // input.txt 파일에 텍스트 저장
    await saveTextToFile(INPUT_FILE_PATH, textItem.text);

    // Python 스크립트 실행 (절대 경로 사용)
    const scriptPath = path.resolve(
      projectRoot,
      "src",
      "scripts",
      "minimax_tts.py"
    );

    console.log(`스크립트 실행 시작...`);
    const scriptOutput = await runTtsScript(scriptPath, language);
    console.log(`스크립트 실행 완료`);

    // 스크립트의 출력에서 출력 디렉토리 경로 추출
    const outputDir = extractOutputDir(scriptOutput, projectRoot);

    // 출력 디렉토리 존재 여부 확인
    const validatedOutputDir = await validateOutputDir(outputDir, outputDir);

    // 출력 디렉토리에서 MP3 파일 목록 가져오기
    const mp3Files = await getMP3Files(validatedOutputDir);

    console.log("========== TTS 변환 프로세스 완료 ==========");
    console.log(`출력 디렉토리: ${validatedOutputDir}`);
    console.log(`MP3 파일 목록: ${mp3Files.join(", ")}`);

    return {
      outputDir: validatedOutputDir,
      mp3Files,
    };
  } catch (error) {
    console.error("========== TTS 변환 프로세스 실패 ==========");
    console.error(
      `오류 정보: ${error instanceof Error ? error.message : String(error)}`
    );

    // 실패했지만 프로세스가 중단되지 않도록 빈 결과 반환
    return {
      outputDir: path.resolve(
        projectRoot,
        "data",
        "output",
        "error_" + Date.now()
      ),
      mp3Files: [],
    };
  }
}
