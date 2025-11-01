"use client";
import { useEffect } from "react";

const JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY ?? "";
const SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
const SDK_ATTR = "data-kakao-sdk-loaded";

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
    };
  }
}

export default function KakaoSDKLoader() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!JS_KEY) return;

    if (window.Kakao?.isInitialized()) return;

    const existing = document.querySelector<HTMLScriptElement>(`script[${SDK_ATTR}="true"]`);
    if (existing) {
      existing.addEventListener("load", () => {
        try {
          if (window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(JS_KEY);
        } catch (e) {
          console.error("[Kakao SDK] init 실패:", e);
        }
      });
      return;
    }

    const s = document.createElement("script");
    s.src = SDK_SRC;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.setAttribute(SDK_ATTR, "true");

    s.addEventListener("load", () => {
      try {
        if (window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(JS_KEY);
      } catch (e) {
        console.error("[Kakao SDK] init 실패:", e);
      }
    });

    document.head.appendChild(s);
  }, []);

  return null;
}
