import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "GlobalNomad",
  description: "체험의 모든것을 즐겨봐요~",
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
