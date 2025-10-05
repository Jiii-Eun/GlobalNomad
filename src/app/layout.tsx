import "@/styles/globals.css";
import QueryProviders from "@/components/provider/QueryProviders";

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
        <QueryProviders>{children}</QueryProviders>
      </body>
    </html>
  );
}
