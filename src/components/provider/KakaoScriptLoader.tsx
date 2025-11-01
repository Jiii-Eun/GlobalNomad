"use client";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    __kakaoReady?: boolean;
    kakao?: {
      maps?: {
        /** SDK 로딩 완료 시 호출되는 래퍼 */
        load?: (cb: () => void) => void;
      };
    };
  }
}

export default function KakaoScriptLoader() {
  const pathname = usePathname();

  const needMap = pathname.startsWith("/activities");
  const needPostcode = pathname.startsWith("/me/activities");

  const appkey: string | undefined = process.env.NEXT_PUBLIC_KAKAOMAP_KEY;

  return (
    <>
      {needMap && appkey && (
        <Script
          strategy="afterInteractive"
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false&libraries=services`}
          onLoad={() => {
            // SDK 로드 완료 시점에만 ready 신호 발행
            const load = window.kakao?.maps?.load;
            if (typeof load === "function") {
              load(() => {
                window.__kakaoReady = true;
                window.dispatchEvent(new Event("kakao:ready"));
              });
            }
          }}
        />
      )}

      {needPostcode && (
        <Script
          strategy="afterInteractive"
          src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        />
      )}
    </>
  );
}
