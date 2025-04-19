import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { TextItem } from "@/utils/api";

// 파일 데이터 목록 인터페이스
interface DbData {
  texts: TextItem[];
}

// 데이터 디렉토리 경로
const DATA_DIR = process.cwd();
const DB_DATA_PATH = path.join(DATA_DIR, "db.json");

// 데이터 디렉토리가 존재하는지 확인하고 없으면 생성
function ensureDataDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 데이터베이스 데이터 가져오기
function getDbData(): DbData {
  ensureDataDirectoryExists();

  if (!fs.existsSync(DB_DATA_PATH)) {
    return { texts: [] };
  }

  try {
    const data = fs.readFileSync(DB_DATA_PATH, "utf8");
    return JSON.parse(data) as DbData;
  } catch (error) {
    console.error("Error reading database data:", error);
    return { texts: [] };
  }
}

// 데이터베이스 데이터 저장하기
function saveDbData(data: DbData): boolean {
  ensureDataDirectoryExists();

  try {
    fs.writeFileSync(DB_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error saving database data:", error);
    return false;
  }
}

// GET 요청 처리 - 모든 텍스트 목록 가져오기
export async function GET() {
  try {
    const dbData = getDbData();
    return NextResponse.json({ texts: dbData.texts });
  } catch (error) {
    console.error("Error in GET /api/files:", error);
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST 요청 처리 - 새 텍스트 생성하기
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 필수 필드 확인
    if (!body.content) {
      return NextResponse.json(
        { error: "텍스트 내용은 필수 항목입니다." },
        { status: 400 }
      );
    }

    // 기존 데이터 가져오기
    const dbData = getDbData();

    // ID 생성 (숫자 형식)
    const maxId = dbData.texts.reduce(
      (max, item) => (item.id > max ? item.id : max),
      0
    );
    const newId = maxId + 1;

    // 새 텍스트 객체 생성
    const newText: TextItem = {
      id: newId,
      text: body.content,
      language: body.language || "korean",
      level: body.level || "중급",
      examType: body.examType || "스널트",
      status: "텍스트만",
      audioUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 데이터베이스에 추가
    dbData.texts.push(newText);

    // 데이터베이스 저장
    const success = saveDbData(dbData);

    if (success) {
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
