"use client";

import { fetchTextsFromApi, convertTextToSpeech } from "@/utils/api";
import { TextItem } from "@/types";
import { useState, useEffect } from "react";

export default function TextsPage() {
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [converting, setConverting] = useState<boolean>(false);

  // 텍스트 목록 불러오기
  const loadTexts = async () => {
    setLoading(true);
    try {
      const texts = await fetchTextsFromApi();
      setTexts(texts);
    } catch (error) {
      console.error("텍스트 로딩 오류:", error);
      console.error("텍스트 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // TTS 변환 처리
  const handleTTSConversion = async (textId: number) => {
    setConverting(true);
    try {
      await convertTextToSpeech(textId);
      console.log("TTS 변환 완료!");
      // 변환 후 텍스트 목록 새로고침
      loadTexts();
    } catch (error) {
      console.error("TTS 변환 오류:", error);
      console.error("TTS 변환 중 오류가 발생했습니다.");
    } finally {
      setConverting(false);
    }
  };

  // 오디오 파일 다운로드 처리
  const handleDownload = (textId: number) => {
    window.open(`/api/download/${textId}`, "_blank");
  };

  // 컴포넌트 마운트 시 텍스트 목록 로드
  useEffect(() => {
    loadTexts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">텍스트 관리</h1>
      {loading ? (
        <div className="flex justify-center">
          <p>로딩 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {texts.map((text) => (
            <div
              key={text.id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold">텍스트 #{text.id}</h2>
              <p className="text-gray-600 mt-2 line-clamp-3">{text.text}</p>
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    text.status === "텍스트만"
                      ? "bg-yellow-100 text-yellow-800"
                      : text.status === "TTS 완료"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {text.status}
                </span>
                <div className="flex space-x-2">
                  {(text.status === "TTS 완료" ||
                    text.status === "오디오 생성됨" ||
                    text.status === "변환 완료") && (
                    <button
                      onClick={() => handleDownload(text.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      MP3 다운로드
                    </button>
                  )}
                  <button
                    onClick={() => handleTTSConversion(text.id)}
                    disabled={
                      converting ||
                      text.status === "TTS 완료" ||
                      text.status === "오디오 생성됨" ||
                      text.status === "변환 완료"
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {converting ? "변환 중..." : "TTS 변환"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
