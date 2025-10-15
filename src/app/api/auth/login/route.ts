import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    const nextRes = NextResponse.json(data, { status: res.status });

    const isProd = process.env.NODE_ENV === "production";

    if (data.refreshToken) {
      nextRes.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
      });
    }

    if (data.accessToken) {
      nextRes.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
      });
    }

    return nextRes;
  } catch (error) {
    console.error("[/api/auth/login] Error:", error);
    return NextResponse.json(
      { message: "로그인 요청 실패", error: String(error) },
      { status: 500 },
    );
  }
}
