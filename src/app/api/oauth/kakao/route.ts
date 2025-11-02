import { NextRequest, NextResponse } from "next/server";

import { BASE_URL } from "@/lib/server/constants";
import { setAuthCookies } from "@/lib/server/tokens";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { code, redirectUri, nickname } = body;
    if (!code || !redirectUri) {
      return NextResponse.json({ message: "code 또는 redirectUri 누락" }, { status: 400 });
    }

    const payload: Record<string, unknown> = { token: code, redirectUri };
    if (nickname) payload.nickname = nickname; // 회원가입일 경우 닉네임 포함

    const endpoint = nickname ? "sign-up" : "sign-in";

    const res = await fetch(`${BASE_URL}/oauth/${endpoint}/kakao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.accessToken && data.refreshToken) {
      const nextRes = setAuthCookies(NextResponse.json(data, { status: res.status }), {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return nextRes;
    }

    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("[/api/oauth/kakao] Error:", e);
    return NextResponse.json({ message: "OAuth 요청 실패", error: String(e) }, { status: 500 });
  }
}
