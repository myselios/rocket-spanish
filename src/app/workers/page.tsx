"use client";

import React, { useState } from "react";

export default function Workers() {
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">작업자 상태</h1>
        <p className="text-gray-500 dark:text-gray-400">
          현재 활동 중인 작업자들의 상태 및 작업 현황을 확인하세요.
        </p>
      </div>

      {/* 필터 영역 */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded text-sm ${
              filterStatus === "all"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "bg-white dark:bg-black"
            }`}
          >
            모든 작업자
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-3 py-1.5 rounded text-sm ${
              filterStatus === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-white dark:bg-black"
            }`}
          >
            활성 상태
          </button>
          <button
            onClick={() => setFilterStatus("idle")}
            className={`px-3 py-1.5 rounded text-sm ${
              filterStatus === "idle"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                : "bg-white dark:bg-black"
            }`}
          >
            대기 중
          </button>
          <button
            onClick={() => setFilterStatus("offline")}
            className={`px-3 py-1.5 rounded text-sm ${
              filterStatus === "offline"
                ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                : "bg-white dark:bg-black"
            }`}
          >
            오프라인
          </button>
        </div>
      </div>

      {/* 작업자 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 작업자 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border thread-border">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">
                A
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">김철수</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  음성 생성자
                </p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs rounded-full">
              활성 상태
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                현재 작업:
              </span>
              <span>음성 녹음 중</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">작업량:</span>
              <span>오늘 32개 파일 처리</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                작업 시간:
              </span>
              <span>6시간 23분</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs">
                <span>현재 진행률</span>
                <span>73%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "73%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 작업자 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border thread-border">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold">
                B
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">이영희</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  번역가
                </p>
              </div>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs rounded-full">
              대기 중
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                최근 작업:
              </span>
              <span>스페인어 번역</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">작업량:</span>
              <span>오늘 45개 문장 처리</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                작업 시간:
              </span>
              <span>4시간 15분</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs">
                <span>최근 작업 진행률</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 작업자 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border thread-border">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-700 dark:text-red-300 font-bold">
                C
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">박지민</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  유튜브 매니저
                </p>
              </div>
            </div>
            <span className="px-2 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs rounded-full">
              오프라인
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                최근 접속:
              </span>
              <span>3시간 전</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">작업량:</span>
              <span>오늘 5개 영상 업로드</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                작업 시간:
              </span>
              <span>2시간 40분</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs">
                <span>최근 작업 진행률</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 작업자 4 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border thread-border">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold">
                D
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">한미영</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  음성 편집자
                </p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs rounded-full">
              활성 상태
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                현재 작업:
              </span>
              <span>오디오 파일 편집</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">작업량:</span>
              <span>오늘 18개 파일 처리</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                작업 시간:
              </span>
              <span>5시간 10분</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs">
                <span>현재 진행률</span>
                <span>62%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "62%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 작업자 5 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border thread-border">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-700 dark:text-orange-300 font-bold">
                E
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">최준호</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  스크립트 작성자
                </p>
              </div>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs rounded-full">
              대기 중
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                최근 작업:
              </span>
              <span>스크립트 교정</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">작업량:</span>
              <span>오늘 12개 스크립트 처리</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                작업 시간:
              </span>
              <span>3시간 45분</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs">
                <span>최근 작업 진행률</span>
                <span>80%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 작업 요약 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border thread-border">
        <h3 className="text-lg font-semibold mb-4">오늘의 작업 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              활성 작업자
            </div>
            <div className="text-2xl font-bold mt-1">3/5</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-2">
              어제보다 1명 증가
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              완료된 작업
            </div>
            <div className="text-2xl font-bold mt-1">112</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-2">
              목표의 75% 달성
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              총 작업 시간
            </div>
            <div className="text-2xl font-bold mt-1">22시간 13분</div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
              어제와 동일
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
