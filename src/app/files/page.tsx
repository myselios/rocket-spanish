"use client";

import React, { useState, useEffect } from "react";
import {
  fetchTextsFromApi,
  updateTextInApi,
  deleteTextFromApi,
} from "@/utils/api";
import Link from "next/link";
import { IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { FiMusic, FiDownload, FiTrash2 } from "react-icons/fi";

// TextItem 인터페이스 정의
interface TextItem {
  id: number;
  text: string;
  language?: string;
  level?: string;
  examType?: string | null;
  status?:
    | "텍스트만"
    | "TTS 처리 중"
    | "음성 변환 완료"
    | "TTS 변환 실패"
    | "변환 완료"
    | "오디오 생성됨"
    | "TTS 완료";
  createdAt?: string;
  audioUrl?: string | null;
  audioPath?: string | null;
}

export default function Files() {
  const [dateFilter, setDateFilter] = useState("전체 기간");
  const [statusFilter, setStatusFilter] = useState("전체 상태");
  const [searchTerm, setSearchTerm] = useState("");
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "all" | "audio" | "스널트" | "플렉스" | "오픽"
  >("all");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // 데이터 불러오기
  useEffect(() => {
    fetchTexts();
  }, []);

  // 텍스트 데이터 불러오기 함수
  const fetchTexts = async () => {
    try {
      setLoading(true);
      const data = await fetchTextsFromApi();
      // API 응답을 로컬 타입으로 변환
      const convertedData = data.map((item) => ({
        id: item.id,
        text: item.text,
        language: item.language,
        level: item.level || undefined,
        examType: item.examType,
        status: item.status,
        createdAt: item.createdAt,
        audioUrl: item.audioUrl,
        audioPath: item.audioPath,
      }));

      setTexts(convertedData as unknown as TextItem[]);
      setError(null);
    } catch (err) {
      setError("텍스트를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 필터링된 텍스트 목록
  const filteredTexts = texts.filter((text) => {
    // 검색어 필터링
    if (
      searchTerm &&
      !text.text.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // 상태 필터링
    if (statusFilter !== "전체 상태" && text.status !== statusFilter) {
      return false;
    }

    // 탭 필터링
    if (activeTab === "audio" && text.status !== "TTS 완료") {
      return false;
    }

    // 시험 종류별 필터링
    if (activeTab === "스널트" && text.examType !== "스널트") {
      return false;
    }
    if (activeTab === "플렉스" && text.examType !== "플렉스") {
      return false;
    }
    if (activeTab === "오픽" && text.examType !== "오픽") {
      return false;
    }

    // 날짜 필터링 (간단한 예시)
    if (dateFilter === "오늘") {
      const today = new Date().toISOString().split("T")[0];
      const textDate = text.createdAt
        ? new Date(text.createdAt).toISOString().split("T")[0]
        : "";
      if (today !== textDate) {
        return false;
      }
    }

    return true;
  });

  // 텍스트 삭제 처리
  const handleDelete = async (id: number) => {
    if (window.confirm("정말 이 텍스트를 삭제하시겠습니까?")) {
      try {
        await deleteTextFromApi(id);
        // 텍스트를 삭제할 때 관련 파일도 함께 삭제
        setTexts(texts.filter((text) => text.id !== id));
        toast({
          title: "텍스트 삭제 완료",
          description: "텍스트가 성공적으로 삭제되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        console.error("삭제 중 오류:", err);
        toast({
          title: "텍스트 삭제 실패",
          description: "텍스트 삭제 중 오류가 발생했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // TTS 변환 처리 함수
  const handleTTSProcess = async (textId: number) => {
    try {
      setIsLoading(true);
      setShowUploadModal(true);
      setUploadProgress(10);

      // 서버에 TTS 요청 보내기
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text_id: textId }),
      });

      if (!response.ok) {
        throw new Error(`TTS 변환 실패: ${response.statusText}`);
      }

      setUploadProgress(90);

      const result = await response.json();

      // 텍스트 상태 업데이트
      await updateTextInApi(textId, {
        status: "TTS 완료",
        audioUrl: result.outputDir,
      });

      // 텍스트 목록 새로고침
      await fetchTexts();

      setUploadProgress(100);

      toast({
        title: "TTS 변환 완료",
        description: "텍스트가 성공적으로 음성으로 변환되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("TTS 처리 오류:", error);
      toast({
        title: "TTS 변환 실패",
        description: "오디오 생성 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  // 오디오 다운로드 처리
  const handleAudioDownload = async (id: number) => {
    try {
      // 선택된 텍스트 정보 가져오기
      const textItem = texts.find((t) => t.id === id);
      if (!textItem || !textItem.audioUrl) {
        throw new Error("오디오 URL이 존재하지 않습니다.");
      }

      // 오디오 파일 다운로드 요청
      const response = await fetch(`/api/download/${id}`);

      if (!response.ok) {
        throw new Error("다운로드 실패: " + response.statusText);
      }

      // 응답을 blob으로 변환
      const blob = await response.blob();

      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audio_${id}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "다운로드 성공",
        description: "오디오 파일이 성공적으로 다운로드되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("다운로드 오류:", error);
      toast({
        title: "다운로드 실패",
        description: "오디오 파일을 다운로드하는 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">모든 텍스트 목록</h1>

      {/* 검색 및 필터 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="텍스트 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            <option value="전체 상태">전체 상태</option>
            <option value="텍스트만">텍스트만</option>
            <option value="TTS 처리 중">TTS 처리 중</option>
            <option value="TTS 완료">TTS 완료</option>
            <option value="TTS 변환 실패">TTS 변환 실패</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            <option value="전체 기간">전체 기간</option>
            <option value="오늘">오늘</option>
            <option value="이번 주">이번 주</option>
            <option value="이번 달">이번 달</option>
          </select>
        </div>

        <div>
          <Link href="/add">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              + 새 텍스트 추가
            </button>
          </Link>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 ${
            activeTab === "all"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("all")}
        >
          전체
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "audio"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("audio")}
        >
          오디오 있음
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "스널트"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("스널트")}
        >
          스널트
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "플렉스"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("플렉스")}
        >
          플렉스
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "오픽"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("오픽")}
        >
          오픽
        </button>
      </div>

      {/* 로딩 상태 */}
      {loading && <p className="text-center py-4">데이터를 불러오는 중...</p>}

      {/* 에러 표시 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 데이터 테이블 */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">텍스트</th>
                <th className="py-2 px-4 border-b text-left">언어</th>
                <th className="py-2 px-4 border-b text-left">시험종류</th>
                <th className="py-2 px-4 border-b text-left">수준</th>
                <th className="py-2 px-4 border-b text-left">상태</th>
                <th className="py-2 px-4 border-b text-left">생성일</th>
                <th className="py-2 px-4 border-b text-center">작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredTexts.map((text) => (
                <tr key={text.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{text.id}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="max-w-xs truncate">
                      {text.text.length > 50
                        ? `${text.text.substring(0, 50)}...`
                        : text.text}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">{text.language}</td>
                  <td className="py-2 px-4 border-b">{text.examType || "-"}</td>
                  <td className="py-2 px-4 border-b">{text.level || "-"}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        text.status === "TTS 완료"
                          ? "bg-green-100 text-green-800"
                          : text.status === "TTS 처리 중"
                          ? "bg-yellow-100 text-yellow-800"
                          : text.status === "TTS 변환 실패"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {text.status || "텍스트만"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {text.createdAt
                      ? new Date(text.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex justify-center space-x-2">
                      {/* TTS 변환 버튼 */}
                      <Tooltip label="TTS 변환" placement="top">
                        <IconButton
                          aria-label="Convert to speech"
                          icon={<FiMusic />}
                          isDisabled={
                            text.status === "TTS 처리 중" ||
                            text.status === "TTS 완료"
                          }
                          onClick={() => handleTTSProcess(text.id)}
                          colorScheme="blue"
                          size="sm"
                          isLoading={isLoading}
                        />
                      </Tooltip>

                      {/* 오디오 다운로드 버튼 */}
                      <Tooltip label="오디오 다운로드" placement="top">
                        <IconButton
                          aria-label="Download audio"
                          icon={<FiDownload />}
                          isDisabled={
                            text.status !== "TTS 완료" || !text.audioUrl
                          }
                          onClick={() => handleAudioDownload(text.id)}
                          colorScheme="green"
                          size="sm"
                        />
                      </Tooltip>

                      {/* 삭제 버튼 */}
                      <Tooltip label="삭제" placement="top">
                        <IconButton
                          aria-label="Delete"
                          icon={<FiTrash2 />}
                          onClick={() => handleDelete(text.id)}
                          colorScheme="red"
                          size="sm"
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 결과가 없을 때 메시지 */}
      {!loading && !error && filteredTexts.length === 0 && (
        <p className="text-center py-4 text-gray-500">
          일치하는 텍스트가 없습니다.
        </p>
      )}

      {/* 업로드 진행 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">TTS 처리 중...</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {uploadProgress < 100
                ? "텍스트를 음성으로 변환하는 중입니다..."
                : "변환이 완료되었습니다!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
