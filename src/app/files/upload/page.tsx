"use client";

import React, { useState, useRef } from "react";

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [spanishText, setSpanishText] = useState("");
  const [koreanText, setKoreanText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // 실제로는 여기서 파일 내용을 읽어 텍스트 필드를 자동으로 채울 수 있습니다
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      // 실제로는 여기서 파일 내용을 읽어 텍스트 필드를 자동으로 채울 수 있습니다
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadStatus("success");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !spanishText) {
      alert("파일을 선택하거나 스페인어 텍스트를 입력해 주세요");
      return;
    }

    simulateUpload();

    // 실제 구현에서는 API 호출을 통해 파일과 텍스트를 서버에 업로드합니다
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSpanishText("");
    setKoreanText("");
    setUploadStatus("idle");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">파일 업로드</h1>
        <p className="thread-text-secondary">
          스페인어 파일을 업로드하여 번역을 시작하세요
        </p>
      </div>

      <div className="bg-white dark:bg-black border thread-border rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-5">
          {/* 파일 드래그 앤 드롭 영역 */}
          <div
            className="mb-6 border-2 border-dashed thread-border rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              className="mx-auto h-12 w-12 thread-text-secondary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-4 text-base">
              파일을 끌어다 놓거나{" "}
              <span className="font-medium">클릭하여 선택하세요</span>
            </p>
            <p className="mt-1 text-sm thread-text-secondary">
              MP3, MP4, WAV 파일 (최대 50MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".mp3,.mp4,.wav"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border thread-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="h-6 w-6 thread-text-secondary mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <div>
                    <p className="text-base font-medium">{selectedFile.name}</p>
                    <p className="text-sm thread-text-secondary">
                      {Math.round(selectedFile.size / 1024)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="thread-text-secondary hover:opacity-70 transition-opacity"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* 텍스트 입력 필드 그룹 */}
          <div className="mb-6 space-y-5">
            <div className="relative">
              <label
                className="block text-base font-medium mb-2"
                htmlFor="spanish-text"
              >
                스페인어 텍스트
              </label>
              <textarea
                id="spanish-text"
                rows={3}
                className="w-full px-4 py-3 border thread-border rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-transparent"
                placeholder="스페인어 문장을 입력하세요..."
                value={spanishText}
                onChange={(e) => setSpanishText(e.target.value)}
              />
            </div>

            <div className="relative">
              <label
                className="flex items-center text-base font-medium mb-2"
                htmlFor="korean-text"
              >
                한국어 텍스트{" "}
                <span className="ml-2 text-sm thread-text-secondary">
                  (선택사항)
                </span>
              </label>
              <textarea
                id="korean-text"
                rows={3}
                className="w-full px-4 py-3 border thread-border rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-transparent"
                placeholder="한국어 번역을 입력하세요..."
                value={koreanText}
                onChange={(e) => setKoreanText(e.target.value)}
              />
            </div>
          </div>

          {/* 진행 상태 표시 */}
          {isUploading && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-medium">업로드 진행 중...</span>
                <span className="text-base font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-black dark:bg-white h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* 상태 메시지 */}
          {uploadStatus === "success" && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 dark:text-green-400 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-base text-green-700 dark:text-green-300">
                  파일이 성공적으로 업로드되었습니다!
                </span>
              </div>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-red-500 dark:text-red-400 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
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
                <span className="text-base text-red-700 dark:text-red-300">
                  업로드 중 오류가 발생했습니다. 다시 시도해 주세요.
                </span>
              </div>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border thread-border rounded-full font-medium thread-hover transition-all duration-200"
            >
              초기화
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                isUploading
                  ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
              }`}
            >
              {isUploading ? "업로드 중..." : "업로드"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
