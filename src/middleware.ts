import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // const accessToken = req.cookies.get("accessToken")?.value;
  // const refreshToken = req.cookies.get("refreshToken")?.value;

  const protectedPaths = ["/me", "/dashboard", "/profile"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) return NextResponse.next();

  // if (!accessToken && !refreshToken) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
