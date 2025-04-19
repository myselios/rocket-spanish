"use client";

import React, { useState } from "react";

export default function Files() {
  const [dateFilter, setDateFilter] = useState("전체 기간");
  const [statusFilter, setStatusFilter] = useState("전체 상태");
  const [searchTerm, setSearchTerm] = useState("");

  // 실제 구현에서는 여기에 API 호출 또는 데이터 가져오기 로직이 들어갑니다

  return (
    <div className="container mx-auto p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">파일 관리</h1>
        <p className="thread-text-secondary">
          업로드된 모든 파일과 처리 상태를 관리하세요
        </p>
      </div>

      {/* 필터 영역 */}
      <div className="bg-white dark:bg-black mb-6 p-4 border thread-border rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="date-filter"
            >
              날짜
            </label>
            <select
              id="date-filter"
              className="w-full p-2 border thread-border rounded-lg bg-transparent"
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
          <div className="flex-1">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="status-filter"
            >
              상태
            </label>
            <select
              id="status-filter"
              className="w-full p-2 border thread-border rounded-lg bg-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>전체 상태</option>
              <option>대기 중</option>
              <option>번역 중</option>
              <option>녹음 중</option>
              <option>완료됨</option>
              <option>오류</option>
            </select>
          </div>
          <div className="flex-1 md:flex-2">
            <label className="block text-sm font-medium mb-1" htmlFor="search">
              검색
            </label>
            <input
              id="search"
              type="text"
              className="w-full p-2 border thread-border rounded-lg bg-transparent"
              placeholder="파일 이름, 내용 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 파일 테이블 */}
      <div className="bg-white dark:bg-black border thread-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b thread-border">
              <tr>
                <th className="px-6 py-3 text-sm font-medium">날짜/시간</th>
                <th className="px-6 py-3 text-sm font-medium">스페인어 문장</th>
                <th className="px-6 py-3 text-sm font-medium">한국어 문장</th>
                <th className="px-6 py-3 text-sm font-medium">상태</th>
                <th className="px-6 py-3 text-sm font-medium">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y thread-border">
              {/* 샘플 데이터 행 */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 text-sm">2023-07-15 14:23</td>
                <td className="px-6 py-4 text-sm">
                  <div className="line-clamp-1">
                    Hola, ¿cómo estás? Espero que tengas un buen día.
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="line-clamp-1">
                    안녕하세요, 어떻게 지내세요? 좋은 하루 되길 바랍니다.
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    완료됨
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-black dark:text-white hover:opacity-70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button className="text-black dark:text-white hover:opacity-70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 text-sm">2023-07-15 10:45</td>
                <td className="px-6 py-4 text-sm">
                  <div className="line-clamp-1">
                    Me gustaría reservar una mesa para dos personas esta noche.
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="line-clamp-1">
                    오늘 저녁 두 명을 위한 테이블을 예약하고 싶습니다.
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    녹음 중
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-black dark:text-white hover:opacity-70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button className="text-black dark:text-white hover:opacity-70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 text-sm">2023-07-14 16:05</td>
                <td className="px-6 py-4 text-sm">
                  <div className="line-clamp-1">
                    Por favor, ¿puede decirme dónde está la estación de metro
                    más cercana?
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="line-clamp-1">
                    가장 가까운 지하철역이 어디인지 알려주시겠어요?
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                    번역 중
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-black dark:text-white hover:opacity-70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button className="text-black dark:text-white hover:opacity-70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 text-sm">2023-07-14 09:30</td>
                <td className="px-6 py-4 text-sm">
                  <div className="line-clamp-1">
                    Necesito comprar un billete de tren para Madrid.
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="line-clamp-1">
                    마드리드행 기차표를 구매해야 합니다.
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    대기 중
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-black dark:text-white hover:opacity-70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button className="text-black dark:text-white hover:opacity-70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 text-sm">2023-07-13 14:20</td>
                <td className="px-6 py-4 text-sm">
                  <div className="line-clamp-1">
                    ¿Cuál es la diferencia entre ser y estar en español?
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="line-clamp-1">
                    스페인어에서 ser와 estar의 차이점은 무엇인가요?
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                    오류
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-black dark:text-white hover:opacity-70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button className="text-black dark:text-white hover:opacity-70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="border-t thread-border px-6 py-3 flex items-center justify-between">
          <p className="text-sm thread-text-secondary">총 247개 결과</p>
          <div className="flex space-x-1">
            <button className="px-3 py-1 rounded thread-hover">이전</button>
            <button className="px-3 py-1 rounded bg-black dark:bg-white text-white dark:text-black">
              1
            </button>
            <button className="px-3 py-1 rounded thread-hover">2</button>
            <button className="px-3 py-1 rounded thread-hover">3</button>
            <button className="px-3 py-1 rounded thread-hover">...</button>
            <button className="px-3 py-1 rounded thread-hover">25</button>
            <button className="px-3 py-1 rounded thread-hover">다음</button>
          </div>
        </div>
      </div>
    </div>
  );
}
