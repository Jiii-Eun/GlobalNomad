import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // SVG 파일을 React 컴포넌트로 import 가능하게 설정
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/, // tsx, jsx 안에서만 적용
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
