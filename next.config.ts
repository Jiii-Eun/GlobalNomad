import type { NextConfig } from "next";
import withSvgr from "next-plugin-svgr";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withSvgr({
  ...nextConfig,
  svgrOptions: {
    dimensions: false, // width/height 제거 (Tailwind size로 제어)
  },
});
