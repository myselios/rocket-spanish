"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("spanish");
  const [level, setLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    // 진행 상태를 위한 타이머 설정 (실제로는 업로드 진행에 따라 처리해야 함)
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);

    // 실제 업로드 로직을 여기에 구현 (현재는 타이머로 시뮬레이션만 함)
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      router.push("/files");
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setLanguage("spanish");
    setLevel("");
    setExamType("");
    setFile(null);
    router.push("/files");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
              텍스트 및 음성 파일 업로드
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 왼쪽 컬럼 */}
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      제목
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="문서 제목을 입력하세요"
                      required
                    />
                  </div>

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
                      rows={8}
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
                      <option value="english">영어</option>
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

                  <div>
                    <label
                      htmlFor="audioFile"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      오디오 파일 (선택사항)
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="audioFile"
                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-1 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p className="text-xs text-gray-500">
                            {file
                              ? file.name
                              : "파일을 업로드하거나 드래그앤드롭 하세요"}
                          </p>
                        </div>
                        <input
                          id="audioFile"
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
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
                  <span className="font-medium">문서 제목과 내용</span>을
                  입력하세요. 내용에는 학습할 텍스트를 입력합니다.
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
                  필요한 경우 <span className="font-medium">오디오 파일</span>을
                  첨부할 수 있습니다. (MP3, WAV 형식 지원)
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 shadow-inner">
                  <span className="text-blue-600 font-medium">4</span>
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
