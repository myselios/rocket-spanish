"use client";

import React, { useState, useEffect } from "react";
import {
  getAllTexts,
  updateTextStatus,
  deleteTextFromServer,
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
  const [selectedText, setSelectedText] = useState<TextItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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
      const data = await getAllTexts();
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
        await deleteTextFromServer(id);
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
      setIsUploading(true);
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
      await updateTextStatus(textId, "TTS 완료", result.outputDir);

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
      setIsUploading(false);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  // 파일 다운로드 처리
  const handleDownload = (textId: number, fileName: string) => {
    const audioUrl = texts.find((text) => text.id === textId)?.audioUrl;
    if (!audioUrl) {
      alert("파일을 찾을 수 없습니다. 다시 업로드해 주세요.");
      return;
    }

    // 다운로드 링크 생성 및 클릭
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // 링크 제거
    document.body.removeChild(a);
  };

  // 날짜 포맷 함수
  const formatDate = (dateString?: string) => {
    if (!dateString) return "날짜 없음";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 텍스트 요약 함수 (너무 긴 텍스트 처리)
  const summarizeText = (text: string, maxLength: number = 50) => {
    // 줄바꿈을 <br>로 변환하지 않고 텍스트 길이만 제한
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // 모달 열기 함수
  const openTextModal = (text: TextItem) => {
    setSelectedText(text);
    setShowModal(true);
  };

  // 모달 닫기 함수
  const closeTextModal = () => {
    setShowModal(false);
    setSelectedText(null);
  };

  // 상태에 따른 태그 색상
  const getStatusColor = (status?: string) => {
    if (!status)
      return "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300";

    switch (status) {
      case "텍스트만":
        return "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200";
      case "TTS 처리 중":
        return "bg-yellow-50 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200";
      case "TTS 완료":
        return "bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // 언어 표시 포맷
  const formatLanguage = (lang?: string) => {
    if (!lang) return "언어 없음";
    const langMap: { [key: string]: string } = {
      spanish: "스페인어",
      korean: "한국어",
    };
    return langMap[lang] || lang;
  };

  // 레벨 표시 포맷
  const formatLevel = (level: string | null | undefined) => {
    if (!level) return "미지정"; // null이나 undefined인 경우 기본값 표시

    const levelMap: { [key: string]: string } = {
      beginner: "입문 (A1)",
      basic: "기초 (A2)",
      intermediate: "중급 (B1)",
      advanced: "고급 (B2)",
      초급: "초급",
      중급: "중급",
      실전: "실전",
    };
    return levelMap[level] || level;
  };

  // 시험 유형 표시 포맷
  const formatExamType = (type: string | null | undefined) => {
    console.log("examType 값:", type); // 디버깅용 로그
    if (!type) return "일반"; // null이나 undefined인 경우 기본값 표시

    const typeMap: { [key: string]: string } = {
      snult: "스널트",
      스널트: "스널트",
      flex: "플렉스",
      opic: "오픽",
    };
    return typeMap[type] || type;
  };

  // 업로드 모달 닫기 함수
  const closeUploadModal = () => {
    setShowUploadModal(false);
  };

  return (
    <div className="container mx-auto p-5">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">텍스트 관리</h1>
        <p className="text-gray-500 dark:text-gray-400">
          업로드된 모든 텍스트와 처리 상태를 관리하세요
        </p>
      </div>

      {/* 탭 영역 - 디자인 개선 */}
      <div className="mb-8">
        <div className="flex flex-nowrap overflow-x-auto bg-gray-50 dark:bg-gray-900 rounded-xl p-1">
          <button
            className={`py-3 px-5 rounded-lg font-medium transition-colors ${
              activeTab === "all"
                ? "bg-white dark:bg-black shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab("all")}
          >
            전체 텍스트
          </button>
          <button
            className={`py-3 px-5 rounded-lg font-medium transition-colors ${
              activeTab === "스널트"
                ? "bg-white dark:bg-black shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab("스널트")}
          >
            스널트
          </button>
          <button
            className={`py-3 px-5 rounded-lg font-medium transition-colors ${
              activeTab === "플렉스"
                ? "bg-white dark:bg-black shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab("플렉스")}
          >
            플렉스
          </button>
          <button
            className={`py-3 px-5 rounded-lg font-medium transition-colors ${
              activeTab === "오픽"
                ? "bg-white dark:bg-black shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab("오픽")}
          >
            오픽
          </button>
          <button
            className={`py-3 px-5 rounded-lg font-medium transition-colors ${
              activeTab === "audio"
                ? "bg-white dark:bg-black shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab("audio")}
          >
            음성 파일
          </button>
        </div>
      </div>

      {/* 필터 영역 - 디자인 개선 */}
      <div className="mb-8 bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              htmlFor="date-filter"
            >
              날짜
            </label>
            <select
              id="date-filter"
              className="w-full p-3 rounded-xl bg-white dark:bg-black border-0 shadow-sm focus:ring-2 focus:ring-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option>전체 기간</option>
              <option>오늘</option>
              <option>지난 7일</option>
              <option>지난 30일</option>
              <option>이번 달</option>
              <option>지난 달</option>
            </select>
          </div>
          {activeTab !== "audio" && (
            <div className="flex-1">
              <label
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                htmlFor="status-filter"
              >
                상태
              </label>
              <select
                id="status-filter"
                className="w-full p-3 rounded-xl bg-white dark:bg-black border-0 shadow-sm focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>전체 상태</option>
                <option>텍스트만</option>
                <option>TTS 처리 중</option>
                <option>TTS 완료</option>
              </select>
            </div>
          )}
          <div className="flex-1 md:flex-2">
            <label
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              htmlFor="search"
            >
              검색
            </label>
            <input
              id="search"
              type="text"
              className="w-full p-3 rounded-xl bg-white dark:bg-black border-0 shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="텍스트 내용 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 텍스트 테이블 - 디자인 개선 */}
      <div className="bg-white dark:bg-black rounded-xl shadow-sm mb-8">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-gray-500 dark:text-gray-400">
              <svg
                className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              로딩 중...
            </div>
          ) : error ? (
            <div className="p-10 text-center text-red-500">{error}</div>
          ) : filteredTexts.length === 0 ? (
            <div className="p-10 text-center text-gray-500 dark:text-gray-400">
              {activeTab === "all"
                ? "아직 업로드된 텍스트가 없습니다. '텍스트 업로드'에서 새 텍스트를 추가해 보세요."
                : activeTab === "audio"
                ? "아직 음성 파일이 없습니다. 텍스트에 MP3 파일을 업로드해 보세요."
                : `${activeTab} 유형의 텍스트가 없습니다. '텍스트 업로드'에서 새 텍스트를 추가해 보세요.`}
            </div>
          ) : (
            <div className="min-w-full">
              {/* 테이블 헤더 */}
              <div className="bg-gray-50 dark:bg-gray-900 py-4 px-6 grid grid-cols-12 gap-3 rounded-t-xl">
                <div className="col-span-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                  날짜/시간
                </div>
                <div className="col-span-1 font-medium text-sm text-gray-700 dark:text-gray-300">
                  언어
                </div>
                <div className="col-span-1 font-medium text-sm text-gray-700 dark:text-gray-300">
                  시험 종류
                </div>
                <div className="col-span-1 font-medium text-sm text-gray-700 dark:text-gray-300">
                  난이도
                </div>
                <div className="col-span-4 font-medium text-sm text-gray-700 dark:text-gray-300">
                  텍스트
                </div>
                <div className="col-span-1 font-medium text-sm text-gray-700 dark:text-gray-300">
                  상태
                </div>
                <div className="col-span-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                  액션
                </div>
              </div>

              {/* 테이블 본문 */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredTexts.map((text) => (
                  <div
                    key={text.id}
                    className="grid grid-cols-12 gap-3 py-4 px-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="col-span-2 text-sm text-gray-700 dark:text-gray-300 truncate">
                      {formatDate(text.createdAt)}
                    </div>
                    <div className="col-span-1 text-sm text-gray-700 dark:text-gray-300">
                      {formatLanguage(text.language)}
                    </div>
                    <div className="col-span-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                      {formatExamType(text.examType)}
                    </div>
                    <div className="col-span-1 text-sm text-gray-700 dark:text-gray-300">
                      {formatLevel(text.level)}
                    </div>
                    <div className="col-span-4 text-sm text-gray-700 dark:text-gray-300">
                      <div
                        className="cursor-pointer hover:text-black dark:hover:text-white transition-colors"
                        onClick={() => openTextModal(text)}
                      >
                        {summarizeText(text.text)}
                      </div>
                    </div>
                    <div className="col-span-1 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          text.status
                        )}`}
                      >
                        {text.status}
                      </span>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      {text.status === "텍스트만" && (
                        <Tooltip label="TTS변환">
                          <IconButton
                            aria-label="TTS변환"
                            icon={<FiMusic />}
                            size="sm"
                            colorScheme="green"
                            isLoading={isLoading}
                            onClick={() => handleTTSProcess(text.id)}
                          />
                        </Tooltip>
                      )}
                      {text.status === "TTS 완료" && text.audioUrl && (
                        <Tooltip label="다운로드">
                          <IconButton
                            aria-label="다운로드"
                            icon={<FiDownload />}
                            size="sm"
                            colorScheme="blue"
                            onClick={() =>
                              handleDownload(
                                text.id,
                                text.audioUrl?.split("/").pop() || "audio.mp3"
                              )
                            }
                          />
                        </Tooltip>
                      )}
                      <Tooltip label="삭제">
                        <IconButton
                          aria-label="삭제"
                          icon={<FiTrash2 />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(text.id)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 새 텍스트 업로드 버튼 - 오른쪽 끝으로 이동 */}
      <div className="flex justify-end mb-8">
        <Link href="/files/upload">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
            텍스트 업로드
          </button>
        </Link>
      </div>

      {/* 텍스트 상세 모달 */}
      {showModal && selectedText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="relative p-6 mx-auto my-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* 모달 헤더 - 고정 */}
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-xl font-semibold dark:text-white">
                텍스트 상세 정보
              </h2>
              <button
                onClick={closeTextModal}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* 모달 본문 - 스크롤 가능 */}
            <div className="space-y-4 overflow-y-auto flex-1">
              <div>
                <h3 className="text-lg font-medium dark:text-white">텍스트:</h3>
                <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedText.text}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium dark:text-white">언어:</h3>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {formatLanguage(selectedText.language)}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium dark:text-white">레벨:</h3>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {formatLevel(selectedText.level)}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium dark:text-white">
                    시험 유형:
                  </h3>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {formatExamType(selectedText.examType)}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium dark:text-white">상태:</h3>
                  <p
                    className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      selectedText.status
                    )}`}
                  >
                    {selectedText.status || "상태 없음"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium dark:text-white">
                    생성 날짜:
                  </h3>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {formatDate(selectedText.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* 모달 푸터 - 고정 */}
            <div className="flex space-x-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
              {selectedText.status === "텍스트만" && (
                <Tooltip label="TTS변환">
                  <IconButton
                    aria-label="TTS변환"
                    icon={<FiMusic />}
                    colorScheme="blue"
                    isLoading={isLoading}
                    onClick={() => handleTTSProcess(selectedText.id)}
                  />
                </Tooltip>
              )}
              {(selectedText.status === "TTS 완료" ||
                selectedText.status === "변환 완료" ||
                selectedText.status === "오디오 생성됨") &&
                selectedText.audioUrl && (
                  <div className="tooltip" data-tip="오디오 다운로드">
                    <button
                      aria-label="오디오 다운로드"
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                      onClick={() =>
                        handleDownload(
                          selectedText.id,
                          `audio_${selectedText.id}.mp3`
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              <div className="tooltip" data-tip="텍스트 삭제">
                <button
                  aria-label="텍스트 삭제"
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={() => {
                    closeTextModal();
                    handleDelete(selectedText.id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 파일 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              텍스트 업로드
            </h2>
            <div className="mb-4 overflow-y-auto flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-gray-700 dark:text-gray-300">
                {isUploading
                  ? `TTS 변환중... ${uploadProgress}%`
                  : uploadProgress === 100
                  ? "변환 완료!"
                  : "준비중..."}
              </p>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeUploadModal}
                disabled={isUploading}
                className={`px-4 py-2 text-white rounded ${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                }`}
              >
                {isUploading ? "처리중..." : "닫기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
