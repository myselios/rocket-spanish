"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl">
          {/* 헤더 섹션 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-blue-600">
              스페인어 시험 준비 플랫폼
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              스페인어 시험(스널트, 플렉스, 오픽) 학습자를 위한 맞춤형 학습 및
              관리 시스템
            </p>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 shadow-inner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold">효과적인 학습 관리</h2>
              </div>
              <p className="text-gray-700 mb-6">
                스페인어 시험 준비를 위한 100개의 스페인어 문장과 한국어 번역을
                효과적으로 관리하고 학습할 수 있습니다. 맞춤형 학습 커리큘럼을
                통해 스페인어 시험 점수 향상에 도움을 드립니다.
              </p>
              <Link href="/dashboard">
                <span className="inline-block bg-blue-500 hover:bg-blue-600 transition-colors text-white font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
                  대시보드 보기
                </span>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 shadow-inner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold">손쉬운 파일 업로드</h2>
              </div>
              <p className="text-gray-700 mb-6">
                스페인어 문장과 한국어 번역을 텍스트 파일로 쉽게 업로드하고
                관리할 수 있습니다. 시험 유형별로 분류하여 효율적인 학습이
                가능합니다.
              </p>
              <Link href="/files/upload">
                <span className="inline-block bg-green-500 hover:bg-green-600 transition-colors text-white font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
                  파일 업로드
                </span>
              </Link>
            </div>
          </div>

          {/* YouTube 채널 섹션 */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="24px"
                  height="24px"
                  className="text-red-600 fill-current"
                >
                  <path d="M 23.857422 8.5 C 17.504717 8.5 11.602344 8.9526234 8.234375 9.65625 A 1.50015 1.50015 0 0 0 8.2128906 9.6621094 C 5.6754768 10.230478 3.2861597 12.048234 2.7832031 14.894531 A 1.50015 1.50015 0 0 0 2.7792969 14.908203 C 2.394951 17.202854 2 20.190662 2 24.5 C 2 28.801151 2.3811835 31.773312 2.7675781 34.083984 A 1.50015 1.50015 0 0 0 2.7714844 34.097656 C 3.2768832 36.952439 5.6628075 38.766883 8.1953125 39.335938 A 1.50015 1.50015 0 0 0 8.234375 39.347656 C 11.568944 40.047816 17.415872 40.5 23.857422 40.5 C 30.299592 40.5 36.146964 40.04997 39.482422 39.351562 A 1.50015 1.50015 0 0 0 39.498047 39.347656 C 42.035133 38.779671 44.717189 36.963629 45.220703 34.101562 A 1.50015 1.50015 0 0 0 45.224609 34.089844 C 45.612031 31.779043 46 28.809338 46 24.5 C 46 20.199289 45.618688 17.226915 45.232422 14.916016 A 1.50015 1.50015 0 0 0 45.228516 14.902344 C 44.722189 12.037913 42.033461 10.223673 39.494141 9.6542969 A 1.50015 1.50015 0 0 0 39.482422 9.6523438 C 36.114314 8.9489169 30.210747 8.5 23.857422 8.5 z M 23.857422 11.5 C 30.017773 11.5 35.812427 11.947851 38.863281 12.564453 C 40.552803 12.896158 42.194028 14.061332 42.294922 15.083984 C 42.651347 17.219184 43 19.963764 43 24.5 C 43 29.028036 42.648519 31.78257 42.287109 33.912109 C 42.1875 34.942971 40.558756 36.105633 38.863281 36.439453 C 35.777458 37.049841 30.03145 37.5 23.857422 37.5 C 17.684973 37.5 11.935941 37.047799 8.8535156 36.435547 C 7.1531335 36.10421 5.6639025 34.945998 5.3457031 33.917969 C 4.9787663 31.787038 4.5 29.035766 4.5 24.5 C 4.5 19.971036 4.9787663 17.216962 5.3457031 15.085938 C 5.6639025 14.057909 7.1531335 12.89579 8.8535156 12.564453 C 11.903798 11.948651 17.697649 11.5 23.857422 11.5 z M 19 17.201172 L 19 31.798828 L 32 24.5 L 19 17.201172 z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Rocket Spanish YouTube</h2>
            </div>
            <p className="text-gray-700 mb-6">
              스페인어 학습 컨텐츠, 시험 준비 팁, 발음 가이드 등 다양한 학습
              자료를 확인해보세요.
            </p>
            <a
              href="https://www.youtube.com/@rocket_spanish"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-500 hover:bg-red-600 transition-colors text-white font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
            >
              채널 방문하기
            </a>
          </div>

          {/* 추가 정보 섹션 */}
          <div className="text-center">
            <p className="text-gray-600 font-medium mb-4">
              스페인어 학습에 필요한 모든 도구를 한 곳에서 관리하세요
            </p>
            <p className="text-gray-500 text-sm">
              © 2023 스페인어 시험 준비 플랫폼. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
