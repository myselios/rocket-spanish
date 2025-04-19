"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddTextRedirect() {
  const router = useRouter();

  useEffect(() => {
    // /files/upload로 리다이렉트
    router.replace("/files/upload");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg mb-2">리다이렉션 중...</p>
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
      </div>
    </div>
  );
}
