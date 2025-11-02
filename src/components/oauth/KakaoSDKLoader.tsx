"use client";

import { useEffect } from "react";

const JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY ?? "";
const SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";

export default function KakaoSDKLoader() {
  useEffect(() => {
    if (typeof window === "undefined" || !JS_KEY) return;
    if (window.Kakao?.isInitialized()) return;

    const s = document.createElement("script");
    s.src = SDK_SRC;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.addEventListener("load", () => {
      try {
        window.Kakao?.init(JS_KEY);
      } catch (e) {
        console.error("[Kakao SDK] init 실패:", e);
      }
    });
    document.head.appendChild(s);
  }, []);

  return null;
}
