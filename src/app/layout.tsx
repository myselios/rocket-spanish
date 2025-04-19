import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "로켓스페인어 - 스페인어 학습 플랫폼",
  description: "스페인어와 한국어 음성 녹음 및 유튜브 업로드 자동화 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-white dark:bg-black">
        <div className="flex min-h-screen">
          {/* 사이드바 */}
          <div className="w-64 border-r thread-border flex flex-col bg-white dark:bg-gray-900 z-10 transition-all duration-300 ease-in-out">
            {/* 로고 */}
            <div className="p-5 mb-6 border-b thread-border">
              <Link href="/" className="flex items-center">
                <h1 className="text-xl font-bold thread-text-accent transition-colors">
                  Rocket Spanish
                </h1>
              </Link>
            </div>

            {/* 네비게이션 메뉴 */}
            <nav className="flex-1 px-5">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    대시보드
                  </Link>
                </li>
                <li>
                  <Link
                    href="/files"
                    className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                    텍스트 관리
                  </Link>
                </li>
                <li>
                  <Link
                    href="/files/upload"
                    className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    텍스트 업로드
                  </Link>
                </li>
                <li>
                  <Link
                    href="/workers"
                    className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    작업자 상태
                  </Link>
                </li>
                <li>
                  <Link
                    href="/statistics"
                    className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    통계 및 보고서
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    설정
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 flex flex-col">
            <main className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out px-4 pb-4">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
