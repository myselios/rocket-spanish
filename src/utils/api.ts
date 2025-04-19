import { TextItem, TextStatus, API_BASE_URL } from "@/types";

// API URL
const API_URL = API_BASE_URL;

// 모든 텍스트 목록 가져오기 (외부 JSON 서버)
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

// 새 텍스트 추가하기 (외부 JSON 서버)
export async function addTextToServer(
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

// 텍스트 상태 업데이트하기 (외부 JSON 서버)
export async function updateTextStatus(
  id: number,
  status: TextStatus,
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

// 텍스트 삭제하기 (외부 JSON 서버)
export async function deleteTextFromServer(id: number): Promise<boolean> {
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

// 텍스트 목록을 가져오는 함수 (내부 API 라우트)
export async function fetchTextsFromApi(): Promise<TextItem[]> {
  try {
    const response = await fetch("/api/files");
    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }
    const data = await response.json();
    return data.texts || [];
  } catch (error) {
    console.error("텍스트 가져오기 오류:", error);
    throw error;
  }
}

// 단일 텍스트를 가져오는 함수 (내부 API 라우트)
export async function fetchTextFromApi(id: number): Promise<TextItem | null> {
  try {
    const response = await fetch(`/api/files/${id}`);
    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }
    const data = await response.json();
    return data.text || null;
  } catch (error) {
    console.error(`텍스트 ID ${id} 가져오기 오류:`, error);
    throw error;
  }
}

// 텍스트 추가 함수 (내부 API 라우트)
export async function addTextToApi(
  text: Omit<TextItem, "id">
): Promise<TextItem> {
  try {
    const response = await fetch("/api/files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: text.text,
        language: text.language,
        level: text.level,
        examType: text.examType,
      }),
    });

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("텍스트 추가 오류:", error);
    throw error;
  }
}

// 텍스트를 음성으로 변환하는 함수
export async function convertTextToSpeech(textId: number) {
  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text_id: textId }),
    });

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("TTS 변환 오류:", error);
    throw error;
  }
}

// 텍스트 삭제 함수 (내부 API 라우트)
export async function deleteTextFromApi(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/files/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }
  } catch (error) {
    console.error(`텍스트 ID ${id} 삭제 오류:`, error);
    throw error;
  }
}

// 텍스트 업데이트 함수 (내부 API 라우트)
export async function updateTextInApi(
  id: number,
  text: Partial<TextItem>
): Promise<TextItem> {
  try {
    const response = await fetch(`/api/files/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(text),
    });

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();
    return data.text || data;
  } catch (error) {
    console.error(`텍스트 ID ${id} 업데이트 오류:`, error);
    throw error;
  }
}
