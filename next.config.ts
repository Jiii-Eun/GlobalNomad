import type { NextConfig } from "next";
import withSvgr from "next-plugin-svgr";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // ✅ Next 15 권장: domains → remotePatterns
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      // 필요하다면 다른 S3 버킷이나 CDN 호스트도 여기에 추가
      // 예) { protocol: "https", hostname: "**.s3.ap-northeast-2.amazonaws.com" },
      {
        protocol: "https",
        hostname: "sprint-fe-project.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**", // 모든 경로 허용
      },
    ],
  },
};

export default withSvgr({
  ...nextConfig,
  svgrOptions: {
    dimensions: false, // width/height 제거 (Tailwind size로 제어)
  },
});
