// 텍스트 데이터 타입 정의
export interface TextItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  language: "spanish" | "korean";
  text: string;
  status:
    | "텍스트만"
    | "TTS 처리 중"
    | "TTS 완료"
    | "음성 변환 완료"
    | "TTS 변환 실패"
    | "오디오 생성됨";
  audioUrl: string | null;
  audioFile?: string | null;
  audioPath?: string | null;
  examType?: "스널트" | "플렉스" | "오픽" | null;
  level?: "초급" | "중급" | "실전" | null;
}

// API URL - json-server가 실행되는 포트
const API_URL = "http://localhost:3002";

// 모든 텍스트 목록 가져오기
export async function getAllTexts(): Promise<TextItem[]> {
  try {
    console.log("텍스트 목록 가져오기 시도 중...");
    const response = await fetch(`${API_URL}/texts`);
    if (!response.ok) {
      throw new Error(
        `텍스트 목록 가져오기 실패: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    console.log("텍스트 목록 가져오기 성공:", data);
    return data;
  } catch (error) {
    console.error("API 오류:", error);
    return [];
  }
}

// 새 텍스트 추가하기
export async function addText(
  textData: Omit<TextItem, "id">
): Promise<TextItem | null> {
  try {
    console.log("텍스트 추가 시도 중...", textData);

    // API 서버에 연결 가능한지 확인
    try {
      const pingResponse = await fetch(`${API_URL}/texts`, { method: "HEAD" });
      console.log("API 서버 연결 상태:", pingResponse.status);
    } catch (pingError) {
      console.error("API 서버 연결 실패:", pingError);
      throw new Error(
        "JSON 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요."
      );
    }

    const response = await fetch(`${API_URL}/texts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(textData),
    });

    const responseText = await response.text();
    console.log("응답 텍스트:", responseText);

    if (!response.ok) {
      throw new Error(`텍스트 추가 실패 (${response.status}): ${responseText}`);
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError);
      throw new Error("서버 응답을 파싱할 수 없습니다.");
    }

    console.log("텍스트 추가 성공:", responseData);
    return responseData;
  } catch (error) {
    console.error("API 오류:", error);
    alert(
      `텍스트 저장 중 오류: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
    return null;
  }
}

// 텍스트 상태 업데이트하기
export async function updateTextStatus(
  id: number,
  status: TextItem["status"],
  audioPath?: string | null
): Promise<TextItem | null> {
  try {
    console.log(`텍스트 ID ${id} 상태 업데이트 시도 중...`);
    // 먼저 현재 텍스트 데이터 가져오기
    const currentResponse = await fetch(`${API_URL}/texts/${id}`);
    if (!currentResponse.ok) {
      throw new Error(`텍스트 데이터 가져오기 실패: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();
    console.log("현재 텍스트 데이터:", currentData);

    // 업데이트할 데이터 준비
    const updateData = {
      ...currentData,
      status,
      updatedAt: new Date().toISOString(),
      ...(audioPath !== undefined && {
        audioPath,
        audioUrl: `file://${audioPath}/output_1.mp3`,
      }),
    };
    console.log("업데이트할 데이터:", updateData);

    // 업데이트 요청
    const response = await fetch(`${API_URL}/texts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`텍스트 상태 업데이트 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log("텍스트 상태 업데이트 성공:", data);
    return data;
  } catch (error) {
    console.error("API 오류:", error);
    return null;
  }
}

// 텍스트 삭제하기
export async function deleteText(id: number): Promise<boolean> {
  try {
    console.log(`텍스트 ID ${id} 삭제 시도 중...`);
    const response = await fetch(`${API_URL}/texts/${id}`, {
      method: "DELETE",
    });

    console.log(`텍스트 삭제 응답 상태: ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error("API 오류:", error);
    return false;
  }
}
