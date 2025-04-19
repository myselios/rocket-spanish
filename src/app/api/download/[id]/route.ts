import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

interface TextItem {
  id: number;
  text: string;
  status: string;
  audioPath?: string;
  language: string;
  updatedAt: string;
}

// 루트 디렉토리의 db.json 사용
const DB_PATH = path.join(process.cwd(), "db.json");

// ID로 텍스트 항목 가져오기
async function getTextById(id: string): Promise<TextItem | null> {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    const { texts } = JSON.parse(data);
    const text = texts.find((item: TextItem) => item.id === parseInt(id));
    return text || null;
  } catch (error) {
    console.error("Error fetching text:", error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    console.log(`Download request for ID: ${id}`);

    const text = await getTextById(id);
    if (!text) {
      return NextResponse.json({ error: "Text not found" }, { status: 404 });
    }

    if (!text.audioPath) {
      return NextResponse.json(
        { error: "Audio not available" },
        { status: 404 }
      );
    }

    // 상대 경로를 확인하고 사용
    const audioPath = text.audioPath.startsWith("/")
      ? text.audioPath.substring(1)
      : text.audioPath;

    // 프로젝트 루트 기준 절대 경로 구성
    const absoluteAudioPath = path.join(process.cwd(), audioPath);
    console.log(`File path: ${absoluteAudioPath}`);

    try {
      const fileExists = await fs
        .stat(absoluteAudioPath)
        .then(() => true)
        .catch(() => false);

      if (!fileExists) {
        console.error(`File not found at: ${absoluteAudioPath}`);
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      const fileData = await fs.readFile(absoluteAudioPath);
      const fileName = path.basename(absoluteAudioPath);

      // MP3 파일 반환
      return new NextResponse(fileData, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    } catch (error) {
      console.error("Error reading file:", error);
      return NextResponse.json(
        { error: "Error reading audio file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in download handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
