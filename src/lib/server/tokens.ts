import { NextResponse } from "next/server";

export function setAuthCookies(
  res: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookies.set("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });

  res.cookies.set("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
