"use client";
import { usePathname } from "next/navigation";
import Script from "next/script";

export default function KakaoScriptLoader() {
  const pathname = usePathname();
  const needKakao = pathname.startsWith("/activities") || pathname.startsWith("/me/activities");

  if (!needKakao) return null;

  return (
    <Script
      strategy="beforeInteractive"
      src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&autoload=false&libraries=services`}
    />
  );
}
