"use client";

import React from "react";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center max-w-3xl px-6">
        <h1 className="text-4xl font-bold mb-6">
          스페인어-한국어 음성 자동화 플랫폼
        </h1>
        <p className="text-xl mb-8">
          스페인어와 한국어 음성 녹음 및 유튜브 업로드 자동화 시스템
        </p>
        <div className="space-y-4">
          <p className="text-gray-600">
            매일 100개의 스페인어 문장과 한국어 번역 문장을 음성으로 변환하고
            관리하는 플랫폼입니다. 음성 생성부터 유튜브 업로드까지 효율적인 작업
            파이프라인을 제공합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
              href="/dashboard"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
            >
              대시보드로 이동
            </a>
            <a
              href="/files/upload"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-md transition duration-200"
            >
              파일 업로드
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
