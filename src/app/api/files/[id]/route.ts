import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 파일 데이터 인터페이스 정의
interface FileData {
  id: string;
  content: string;
  language: string;
  level: string;
  examType: string;
  createdAt: string;
}

// 파일 데이터 목록 인터페이스
interface FilesData {
  files: FileData[];
}

// 데이터 디렉토리 경로
const DATA_DIR = path.join(process.cwd(), "data");
const FILES_DATA_PATH = path.join(DATA_DIR, "files.json");

// 데이터 디렉토리가 존재하는지 확인하고 없으면 생성
function ensureDataDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 파일 데이터 가져오기
function getFilesData(): FilesData {
  ensureDataDirectoryExists();

  if (!fs.existsSync(FILES_DATA_PATH)) {
    return { files: [] };
  }

  try {
    const data = fs.readFileSync(FILES_DATA_PATH, "utf8");
    return JSON.parse(data) as FilesData;
  } catch (error) {
    console.error("Error reading files data:", error);
    return { files: [] };
  }
}

// 파일 데이터 저장하기
function saveFilesData(data: FilesData): boolean {
  ensureDataDirectoryExists();

  try {
    fs.writeFileSync(FILES_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error saving files data:", error);
    return false;
  }
}

// 특정 ID의 파일 가져오기
function getFileById(id: string): FileData | null {
  const filesData = getFilesData();
  const file = filesData.files.find((file) => file.id === id);
  return file || null;
}

// 특정 ID의 파일 삭제하기
function deleteFileById(id: string): boolean {
  const filesData = getFilesData();
  const fileIndex = filesData.files.findIndex((file) => file.id === id);

  if (fileIndex === -1) {
    return false;
  }

  filesData.files.splice(fileIndex, 1);
  return saveFilesData(filesData);
}

// 특정 ID의 파일 업데이트하기
function updateFileById(
  id: string,
  updateData: Partial<FileData>
): FileData | null {
  const filesData = getFilesData();
  const fileIndex = filesData.files.findIndex((file) => file.id === id);

  if (fileIndex === -1) {
    return null;
  }

  // 현재 파일 데이터와 업데이트 데이터 병합
  const updatedFile = {
    ...filesData.files[fileIndex],
    ...updateData,
  };

  filesData.files[fileIndex] = updatedFile;

  if (saveFilesData(filesData)) {
    return updatedFile;
  }

  return null;
}

// GET 요청 처리 - 특정 ID의 파일 가져오기
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id;
    const file = getFileById(fileId);

    if (!file) {
      return NextResponse.json(
        { error: "파일을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(file);
  } catch (error) {
    console.error("Error in GET /api/files/[id]:", error);
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE 요청 처리 - 특정 ID의 파일 삭제하기
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id;
    const fileExists = getFileById(fileId);

    if (!fileExists) {
      return NextResponse.json(
        { error: "파일을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const success = deleteFileById(fileId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "파일이 삭제되었습니다.",
      });
    } else {
      return NextResponse.json(
        { error: "파일 삭제에 실패했습니다." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in DELETE /api/files/[id]:", error);
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PATCH 또는 PUT 요청 처리 - 특정 ID의 파일 업데이트하기
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id;
    const fileExists = getFileById(fileId);

    if (!fileExists) {
      return NextResponse.json(
        { error: "파일을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const updateData = await request.json();
    const updatedFile = updateFileById(fileId, updateData);

    if (updatedFile) {
      return NextResponse.json({
        success: true,
        file: updatedFile,
      });
    } else {
      return NextResponse.json(
        { error: "파일 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in PATCH /api/files/[id]:", error);
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
