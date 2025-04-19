"use client";

import React from "react";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 상태 카드 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold mb-4">오늘의 상태</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">업로드된 파일</p>
              <p className="text-3xl font-bold">34/100</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500"
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
            </div>
          </div>
        </div>

        {/* 작업 진행 카드 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold mb-4">작업 진행 상황</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">완료된 작업</p>
              <p className="text-3xl font-bold">67%</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
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
          </div>
        </div>

        {/* 알림 카드 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold mb-4">알림</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">새 알림</p>
              <p className="text-3xl font-bold">3</p>
            </div>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 주간 진행 상황 그래프 */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8 hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-semibold mb-4">주간 진행 상황</h2>
        <div className="h-64 flex items-end justify-between">
          {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
            <div key={day} className="flex flex-col items-center">
              <div
                className={`w-10 bg-blue-500 rounded-t-md shadow-sm`}
                style={{ height: `${Math.random() * 150 + 50}px` }}
              ></div>
              <p className="mt-2 text-gray-600 font-medium">{day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-semibold mb-4">최근 활동</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 shadow-sm"></div>
                <div>
                  <p className="font-medium">작업자 {item % 2 ? "A" : "B"}</p>
                  <p className="text-sm text-gray-600">
                    {item % 3 === 0
                      ? "새 파일을 업로드했습니다."
                      : item % 3 === 1
                      ? "파일을 다운로드했습니다."
                      : "유튜브에 영상을 업로드했습니다."}
                  </p>
                  <p className="text-xs text-gray-500">3시간 전</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
