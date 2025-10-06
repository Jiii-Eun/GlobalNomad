import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const redirectLogin = () => NextResponse.redirect(new URL("/login", req.url));

  if (!accessToken && !refreshToken) {
    return redirectLogin();
  }

  if (!accessToken && refreshToken) {
    try {
      const res = await fetch(new URL("/api/auth/refresh", req.url), {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return redirectLogin();
      return NextResponse.next();
    } catch {
      return redirectLogin();
    }
  }

  if (accessToken && !refreshToken) {
    return redirectLogin();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
