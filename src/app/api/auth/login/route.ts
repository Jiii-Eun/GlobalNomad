import { NextRequest, NextResponse } from "next/server";

import { BASE_URL } from "@/lib/server/constants";
import { setAuthCookies } from "@/lib/server/tokens";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    let nextRes = NextResponse.json(data, { status: res.status });

    if (data.accessToken && data.refreshToken) {
      nextRes = setAuthCookies(nextRes, {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    }

    return nextRes;
  } catch (error) {
    console.error("[/api/auth/login] Error:", error);
    return NextResponse.json({ message: "로그인 실패", error: String(error) }, { status: 500 });
  }
}
