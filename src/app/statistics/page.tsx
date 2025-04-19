"use client";

import React, { useState } from "react";

export default function Statistics() {
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">통계 및 보고서</h1>
        <p className="text-gray-500 dark:text-gray-400">
          작업 진행 상황과 시스템 사용량 통계를 확인하세요.
        </p>
      </div>

      {/* 필터 옵션 */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">기간</label>
          <div className="flex space-x-1">
            <button
              onClick={() => setPeriod("day")}
              className={`px-3 py-1.5 rounded text-sm ${
                period === "day"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-white dark:bg-black"
              }`}
            >
              일간
            </button>
            <button
              onClick={() => setPeriod("week")}
              className={`px-3 py-1.5 rounded text-sm ${
                period === "week"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-white dark:bg-black"
              }`}
            >
              주간
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`px-3 py-1.5 rounded text-sm ${
                period === "month"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-white dark:bg-black"
              }`}
            >
              월간
            </button>
            <button
              onClick={() => setPeriod("year")}
              className={`px-3 py-1.5 rounded text-sm ${
                period === "year"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-white dark:bg-black"
              }`}
            >
              연간
            </button>
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            보고서 다운로드
          </label>
          <button className="flex items-center bg-white dark:bg-gray-800 border thread-border px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            PDF로 내보내기
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border thread-border">
          <h3 className="text-lg font-semibold mb-3">총 번역 문장</h3>
          <p className="text-3xl font-bold">24,583</p>
          <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <span>15% 증가</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">
              지난 달 대비
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border thread-border">
          <h3 className="text-lg font-semibold mb-3">총 업로드 시간</h3>
          <p className="text-3xl font-bold">482 시간</p>
          <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <span>8% 증가</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">
              지난 달 대비
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border thread-border">
          <h3 className="text-lg font-semibold mb-3">활성 작업자</h3>
          <p className="text-3xl font-bold">12</p>
          <div className="flex items-center mt-2 text-sm text-yellow-600 dark:text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
            <span>동일</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">
              지난 달 대비
            </span>
          </div>
        </div>
      </div>

      {/* 그래프 영역 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border thread-border">
        <h3 className="text-lg font-semibold mb-4">월간 처리량</h3>
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            그래프 영역 - 데이터 시각화 표시
          </p>
        </div>
      </div>

      {/* 최근 처리 항목 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border thread-border">
        <div className="p-5 border-b thread-border">
          <h3 className="text-lg font-semibold">최근 처리 항목</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <th className="py-3 px-4 text-left font-medium text-sm">ID</th>
                <th className="py-3 px-4 text-left font-medium text-sm">
                  날짜
                </th>
                <th className="py-3 px-4 text-left font-medium text-sm">
                  항목 종류
                </th>
                <th className="py-3 px-4 text-left font-medium text-sm">
                  처리 시간
                </th>
                <th className="py-3 px-4 text-left font-medium text-sm">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="divide-y thread-border">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="py-3 px-4 text-sm">#8294</td>
                <td className="py-3 px-4 text-sm">2023-05-15</td>
                <td className="py-3 px-4 text-sm">음성 파일</td>
                <td className="py-3 px-4 text-sm">4분 32초</td>
                <td className="py-3 px-4 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    완료
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="py-3 px-4 text-sm">#8293</td>
                <td className="py-3 px-4 text-sm">2023-05-15</td>
                <td className="py-3 px-4 text-sm">텍스트 번역</td>
                <td className="py-3 px-4 text-sm">2분 15초</td>
                <td className="py-3 px-4 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    완료
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="py-3 px-4 text-sm">#8292</td>
                <td className="py-3 px-4 text-sm">2023-05-14</td>
                <td className="py-3 px-4 text-sm">유튜브 업로드</td>
                <td className="py-3 px-4 text-sm">15분 07초</td>
                <td className="py-3 px-4 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    진행중
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="py-3 px-4 text-sm">#8291</td>
                <td className="py-3 px-4 text-sm">2023-05-14</td>
                <td className="py-3 px-4 text-sm">음성 파일</td>
                <td className="py-3 px-4 text-sm">3분 45초</td>
                <td className="py-3 px-4 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    완료
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="py-3 px-4 text-sm">#8290</td>
                <td className="py-3 px-4 text-sm">2023-05-13</td>
                <td className="py-3 px-4 text-sm">텍스트 번역</td>
                <td className="py-3 px-4 text-sm">1분 54초</td>
                <td className="py-3 px-4 text-sm">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    검토중
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
