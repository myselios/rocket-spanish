"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("spanish");
  const [level, setLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);

    // 진행 상태를 위한 타이머 설정
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prevProgress + 10;
      });
    }, 300);

    try {
      // 실제 데이터를 서버에 저장하는 API 호출
      const response = await fetch("/api/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          language,
          level,
          examType,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("데이터 저장에 실패했습니다. 다시 시도해주세요.");
      }

      // 업로드 완료 표시
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        router.push("/files");
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    setContent("");
    setLanguage("spanish");
    setLevel("");
    setExamType("");
    setError(null);
    router.push("/files");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
              텍스트 업로드
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 왼쪽 컬럼 */}
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      내용
                    </label>
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={12}
                      className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="문서 내용을 입력하세요"
                      required
                    ></textarea>
                  </div>
                </div>

                {/* 오른쪽 컬럼 */}
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      언어
                    </label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="spanish">스페인어</option>
                      <option value="korean">한국어</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="examType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      시험 유형
                    </label>
                    <select
                      id="examType"
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="" disabled>
                        시험 유형을 선택하세요
                      </option>
                      <option value="snult">스널트</option>
                      <option value="flex">플렉스</option>
                      <option value="opic">오픽</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="level"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      레벨
                    </label>
                    <select
                      id="level"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="" disabled>
                        레벨을 선택하세요
                      </option>
                      <option value="beginner">입문 (A1)</option>
                      <option value="basic">기초 (A2)</option>
                      <option value="intermediate">중급 (B1)</option>
                      <option value="advanced">고급 (B2)</option>
                    </select>
                  </div>
                </div>
              </div>

              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md transition-shadow focus:outline-none"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 hover:shadow-md transition-shadow focus:outline-none ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? "업로드 중..." : "업로드"}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              업로드 가이드
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 shadow-inner">
                  <span className="text-blue-600 font-medium">1</span>
                </div>
                <p>
                  <span className="font-medium">내용</span>에 학습할 텍스트를
                  입력합니다.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 shadow-inner">
                  <span className="text-blue-600 font-medium">2</span>
                </div>
                <p>
                  <span className="font-medium">언어, 시험 유형, 레벨</span>을
                  선택하여 문서를 분류합니다.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 shadow-inner">
                  <span className="text-blue-600 font-medium">3</span>
                </div>
                <p>
                  모든 정보를 입력한 후{" "}
                  <span className="font-medium">업로드 버튼</span>을 클릭하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
