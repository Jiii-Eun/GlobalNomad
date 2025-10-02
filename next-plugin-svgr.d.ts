declare module "next-plugin-svgr" {
  import type { NextConfig } from "next";

  interface SvgrOptions {
    dimensions?: boolean;
    svgProps?: Record<string, string>;
  }
  export default function withSvgr(config: NextConfig & { svgrOptions?: SvgrOptions }): NextConfig;
}
