import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { TextItem } from "@/types";
import { NextRequest } from "next/server";

// DB 데이터 인터페이스
interface DbData {
  texts: TextItem[];
}

// 루트 디렉토리 경로 - 도커 및 로컬 환경 모두에서 일관되게 루트 디렉토리 사용
const DATA_DIR = process.cwd();
const DB_DATA_PATH = path.join(DATA_DIR, "db.json");

// 데이터 디렉토리가 존재하는지 확인하고 없으면 생성
async function ensureDataDirectoryExists() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    // 디렉토리가 없는 경우 생성
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// 데이터베이스 데이터 가져오기
async function getDbData(): Promise<DbData> {
  await ensureDataDirectoryExists();

  try {
    const data = await fs.readFile(DB_DATA_PATH, "utf8");
    console.log(`db.json 파일 읽기 성공: ${DB_DATA_PATH}`);
    return JSON.parse(data) as DbData;
  } catch (error) {
    console.error("Error reading database data:", error);
    return { texts: [] };
  }
}

// 데이터베이스 데이터 저장하기
async function saveDbData(data: DbData): Promise<boolean> {
  await ensureDataDirectoryExists();

  try {
    await fs.writeFile(DB_DATA_PATH, JSON.stringify(data, null, 2));
    console.log(`db.json 파일 저장 성공: ${DB_DATA_PATH}`);
    return true;
  } catch (error) {
    console.error("Error saving database data:", error);
    return false;
  }
}

// 특정 ID의 텍스트 가져오기
async function getTextById(id: string): Promise<TextItem | null> {
  const dbData = await getDbData();
  const text = dbData.texts.find((text) => text.id === parseInt(id, 10));
  return text || null;
}

// 특정 ID의 텍스트 삭제하기
async function deleteTextById(id: string): Promise<boolean> {
  const dbData = await getDbData();
  const textIndex = dbData.texts.findIndex(
    (text) => text.id === parseInt(id, 10)
  );

  if (textIndex === -1) {
    return false;
  }

  // 텍스트 항목이 존재하는지 확인 (사용하지 않으므로 주석 처리)
  // const text = dbData.texts[textIndex];

  try {
    // 실제 텍스트 삭제
    dbData.texts.splice(textIndex, 1);
    return await saveDbData(dbData);
  } catch (error) {
    console.error(`텍스트 ID ${id} 삭제 오류:`, error);
    return false;
  }
}

// 특정 ID의 텍스트 업데이트하기
async function updateTextById(
  id: string,
  updateData: Partial<TextItem>
): Promise<TextItem | null> {
  const dbData = await getDbData();
  const textIndex = dbData.texts.findIndex(
    (text) => text.id === parseInt(id, 10)
  );

  if (textIndex === -1) {
    return null;
  }

  // 현재 텍스트 데이터와 업데이트 데이터 병합
  const updatedText = {
    ...dbData.texts[textIndex],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  dbData.texts[textIndex] = updatedText;

  if (await saveDbData(dbData)) {
    return updatedText;
  }

  return null;
}

// GET 요청 처리 - 특정 ID의 텍스트 가져오기
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    console.log(`GET /api/files/${id} 요청 처리 중...`);

    if (!id) {
      return NextResponse.json(
        { error: "ID는 필수 항목입니다" },
        { status: 400 }
      );
    }

    // db.json에서 데이터 읽기
    const data = await fs.readFile(DB_DATA_PATH, "utf8");
    const { texts } = JSON.parse(data);

    // audioPath가 없거나 tts_status가 completed가 아니면 오류 반환
    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json(
        { error: "데이터를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 파일 경로 확인 및 반환
    return NextResponse.json({ id, success: true }, { status: 200 });
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
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    console.log(`DELETE /api/files/${id} 요청 처리 중...`);

    const textExists = await getTextById(id);

    if (!textExists) {
      console.error(`텍스트 ID ${id}를 찾을 수 없습니다.`);
      return NextResponse.json(
        { error: "텍스트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const success = await deleteTextById(id);

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
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    console.log(`PATCH /api/files/${id} 요청 처리 중...`);

    const textExists = await getTextById(id);

    if (!textExists) {
      console.error(`텍스트 ID ${id}를 찾을 수 없습니다.`);
      return NextResponse.json(
        { error: "텍스트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const updateData = await request.json();
    console.log(`텍스트 ID ${id} 업데이트 데이터:`, updateData);

    const updatedText = await updateTextById(id, updateData);

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
