"use client";
import { useEffect, useState } from "react";

// 전역 window에 __kakaoReady 플래그만 얇게 타입 선언
declare global {
  interface Window {
    __kakaoReady?: boolean;
  }
}

export function useKakaoReady() {
  const [ready, setReady] = useState<boolean>(
    typeof window !== "undefined" && Boolean(window.__kakaoReady),
  );

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR 안전
    if (window.__kakaoReady) {
      setReady(true);
      return;
    }

    const handler = () => setReady(true);
    window.addEventListener("kakao:ready", handler, { once: true });
    return () => window.removeEventListener("kakao:ready", handler);
  }, []);

  return ready;
}
