"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  getAllTexts,
  updateTextStatus,
  deleteText,
  TextItem,
} from "@/utils/api";
import Link from "next/link";

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
  const [ttsTextId, setTtsTextId] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "audio" | "스널트" | "플렉스" | "오픽"
  >("all");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 업로드된 파일을 저장하는 Map (파일 ID를 키로 사용)
  const [uploadedFiles, setUploadedFiles] = useState<Map<number, File>>(
    new Map()
  );

  // 데이터 불러오기
  useEffect(() => {
    const fetchTexts = async () => {
      try {
        setLoading(true);
        const data = await getAllTexts();
        setTexts(data);
        setError(null);
      } catch (err) {
        setError("텍스트를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTexts();
  }, []);

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
      const textDate = new Date(text.createdAt).toISOString().split("T")[0];
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
        const success = await deleteText(id);
        if (success) {
          // 텍스트를 삭제할 때 관련 파일도 함께 삭제
          const newUploadedFiles = new Map(uploadedFiles);
          newUploadedFiles.delete(id);
          setUploadedFiles(newUploadedFiles);
          setTexts(texts.filter((text) => text.id !== id));
        } else {
          alert("텍스트 삭제에 실패했습니다.");
        }
      } catch (err) {
        console.error("삭제 중 오류:", err);
        alert("텍스트 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // TTS 처리를 위한 파일 업로드 모달 열기
  const handleTTSProcess = (id: number) => {
    setTtsTextId(id);
    setShowUploadModal(true);
  };

  // 파일 다운로드 처리
  const handleDownload = (textId: number, fileName: string) => {
    const file = uploadedFiles.get(textId);
    if (!file) {
      alert("파일을 찾을 수 없습니다. 다시 업로드해 주세요.");
      return;
    }

    // 파일 다운로드를 위한 URL 생성
    const url = URL.createObjectURL(file);

    // 다운로드 링크 생성 및 클릭
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || file.name;
    document.body.appendChild(a);
    a.click();

    // 링크 제거 및 URL 해제
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 파일 업로드 처리
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !ttsTextId) return;

    const file = files[0];

    // 허용된 오디오 파일 타입 확인
    const allowedTypes = ["audio/mpeg", "audio/mp4", "audio/x-m4a"];
    if (!allowedTypes.includes(file.type)) {
      alert("MP3 또는 M4A 파일만 업로드할 수 있습니다.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // 업로드 진행 상태 시뮬레이션
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // 실제 파일 업로드 처리 (여기서는 시뮬레이션)
      // 실제 구현에서는 FormData와 fetch를 사용하여 파일을 서버에 업로드해야 함
      // 예:
      // const formData = new FormData();
      // formData.append('file', file);
      // await fetch('/api/upload', { method: 'POST', body: formData });

      // 3초 후 업로드 완료 시뮬레이션
      setTimeout(async () => {
        // 파일 이름을 기반으로 URL 생성 (실제로는 서버에서 반환된 URL을 사용)
        const audioUrl = `/audios/${file.name}`;

        // 파일을 업로드된 파일 Map에 저장
        const newUploadedFiles = new Map(uploadedFiles);
        newUploadedFiles.set(ttsTextId, file);
        setUploadedFiles(newUploadedFiles);

        // 텍스트 상태 업데이트
        const updatedText = await updateTextStatus(
          ttsTextId,
          "TTS 완료",
          audioUrl
        );

        if (updatedText) {
          setTexts(
            texts.map((text) => (text.id === ttsTextId ? updatedText : text))
          );
        }

        clearInterval(interval);
        setUploadProgress(100);

        // 업로드 완료 후 정리
        setTimeout(() => {
          setIsUploading(false);
          setShowUploadModal(false);
          setTtsTextId(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 1000);
      }, 3000);
    } catch (err) {
      console.error("파일 업로드 중 오류:", err);
      clearInterval(interval);
      setIsUploading(false);
      alert("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  // 파일 입력 변경 핸들러
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  // 드래그 이벤트 핸들러
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // 업로드 모달 닫기
  const closeUploadModal = () => {
    if (!isUploading) {
      setShowUploadModal(false);
      setTtsTextId(null);
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
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
  const getStatusColor = (status: string) => {
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
                      {text.language === "spanish" ? "스페인어" : "한국어"}
                    </div>
                    <div className="col-span-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                      {text.examType || "-"}
                    </div>
                    <div className="col-span-1 text-sm text-gray-700 dark:text-gray-300">
                      {text.level || "-"}
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
                        <button
                          onClick={() => handleTTSProcess(text.id)}
                          className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 text-sm font-medium transition-colors"
                        >
                          파일 업로드
                        </button>
                      )}
                      {text.status === "TTS 완료" && text.audioUrl && (
                        <button
                          onClick={() =>
                            handleDownload(
                              text.id,
                              text.audioUrl?.split("/").pop() || "audio.mp3"
                            )
                          }
                          className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-200 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 text-sm font-medium transition-colors"
                        >
                          다운로드
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(text.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 text-sm font-medium transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 새 텍스트 업로드 버튼 */}
      <div className="flex justify-end">
        <Link
          href="/files/upload"
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-sm"
        >
          새 텍스트 추가하기
        </Link>
      </div>

      {/* 텍스트 상세 모달 - 디자인 개선 */}
      {showModal && selectedText && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeTextModal}
          ></div>
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg z-10 max-w-2xl w-full mx-4 relative">
            <button
              onClick={closeTextModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-xl font-semibold mb-2">
              {selectedText.language === "spanish"
                ? "스페인어 텍스트"
                : "한국어 텍스트"}
              {selectedText.examType && ` (${selectedText.examType})`}
              {selectedText.level && ` - ${selectedText.level}`}
            </h3>
            <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              작성일: {formatDate(selectedText.createdAt)}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
              <pre className="whitespace-pre-wrap font-sans text-base">
                {selectedText.text}
              </pre>
            </div>
            <div className="flex justify-between">
              {selectedText.status === "TTS 완료" &&
                selectedText.audioUrl &&
                uploadedFiles.has(selectedText.id) && (
                  <button
                    onClick={() =>
                      handleDownload(
                        selectedText.id,
                        selectedText.audioUrl?.split("/").pop() || "audio.mp3"
                      )
                    }
                    className="px-5 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                  >
                    오디오 다운로드
                  </button>
                )}
              <div className="flex-grow"></div>
              <button
                onClick={closeTextModal}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 파일 업로드 모달 - 디자인 개선 */}
      {showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={isUploading ? undefined : closeUploadModal}
          ></div>
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg z-10 max-w-md w-full mx-4 relative">
            <h3 className="text-xl font-semibold mb-4">파일 업로드</h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              선택한 텍스트에 대한 음성 파일을 업로드하세요.
            </p>

            {!isUploading ? (
              <div className="mb-6">
                <input
                  type="file"
                  accept="audio/mpeg,audio/mp4,audio/x-m4a"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="audio-file-upload"
                />
                <label
                  htmlFor="audio-file-upload"
                  className={`block w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 ${
                    isDragging
                      ? "bg-blue-50 dark:bg-blue-900 ring-2 ring-blue-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isDragging
                      ? "파일을 여기에 놓으세요"
                      : "클릭하거나 파일을 이곳에 끌어다 놓으세요"}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    음성 파일(MP3, M4A)을 업로드해주세요.
                  </p>
                </label>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">업로드 중...</span>
                  <span className="text-sm font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={closeUploadModal}
                disabled={isUploading}
                className={`px-5 py-2.5 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors ${
                  isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
