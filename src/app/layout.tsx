import "@/styles/globals.css";
import Script from "next/script";

import BaseLayout from "@/components/layout/BaseLayout";
import QueryProviders from "@/components/provider/QueryProviders";
import { ToastProvider } from "@/components/provider/ToastProvider";

export const metadata = {
  title: "GlobalNomad",
  description: "일상을 벗어나 특별한 순간을 예약하세요",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div id="portal" />
        <Script
          strategy="beforeInteractive"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&autoload=false&libraries=services`}
        />
        <QueryProviders>
          <ToastProvider>
            <BaseLayout>{children}</BaseLayout>
          </ToastProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
