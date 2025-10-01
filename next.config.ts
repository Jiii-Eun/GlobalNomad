import type { NextConfig } from "next";
import withSvgr from "next-plugin-svgr";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withSvgr({
  ...nextConfig,
  svgrOptions: {
    dimensions: false,
    svgProps: {
      className: "svg-override",
    },
  },
});
