import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const protectedPaths = ["/me"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isProtected && (accessToken || refreshToken) && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|api).*)"],
};
