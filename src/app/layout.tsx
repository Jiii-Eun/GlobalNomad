import "@/styles/globals.css";

import { ErrorProvider } from "@/components/provider/ErrorProvider";
import KakaoScriptLoader from "@/components/provider/KakaoScriptLoader";
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
        <QueryProviders>
          <ToastProvider>
            <ErrorProvider>
              <KakaoScriptLoader />
              {children}
            </ErrorProvider>
          </ToastProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
