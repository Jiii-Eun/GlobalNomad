import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // const accessToken = request.cookies.get("accessToken")?.value;
  // const refreshToken = request.cookies.get("refreshToken")?.value;

  if (pathname.startsWith("/undefined")) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // if (!accessToken && !refreshToken) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  const protectedPaths = ["/me"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) return NextResponse.next();

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
