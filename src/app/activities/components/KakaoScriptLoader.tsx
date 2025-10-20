"use client";
import Script from "next/script";

export default function KakaoScriptLoader() {
  return (
    <Script
      strategy="beforeInteractive"
      src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&autoload=false&libraries=services`}
    />
  );
}
