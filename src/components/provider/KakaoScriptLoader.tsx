"use client";
import { usePathname } from "next/navigation";
import Script from "next/script";

export default function KakaoScriptLoader() {
  const pathname = usePathname();

  const needMap = pathname.startsWith("/activities");
  const needPostcode = pathname.startsWith("/me/activities");

  return (
    <>
      {needMap && (
        <Script
          strategy="beforeInteractive"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&autoload=false&libraries=services`}
        />
      )}

      {needPostcode && (
        <Script
          strategy="afterInteractive"
          src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        />
      )}
    </>
  );
}
