import { headers } from "next/headers";

export default async function getServerDevice() {
  const userAgent = (await headers()).get("user-agent") || "";
  const isPc =
    /Windows|Macintosh|Linux/i.test(userAgent) && !/Mobile|Android|iPhone/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent) && !/iPad/i.test(userAgent);

  return { isPc, isTablet, isMobile };
}
