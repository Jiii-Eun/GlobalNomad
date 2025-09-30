import "@/styles/globals.css";
import Providers from "../components/provider/providers";

export const metadata = {
  title: "GlobalNomad",
  description: "일상을 벗어나 특별한 순간을 예약하세요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
