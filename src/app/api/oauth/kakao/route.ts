import { NextRequest, NextResponse } from "next/server";

import { BASE_URL } from "@/lib/server/constants";
import { setAuthCookies } from "@/lib/server/tokens";

interface KakaoAuthRequestBody {
  code: string;
  state?: string | null;
  redirectUri: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as KakaoAuthRequestBody;

    if (!body.code || !body.redirectUri) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }

    const res = await fetch(`${BASE_URL}/oauth/sign-in/kakao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: body.code,
        redirectUri: body.redirectUri,
        state: body.state,
      }),
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      console.warn("[/api/oauth/kakao] JSON parse 실패:", text);
    }

    if (!res.ok) {
      const msg = (data as { message?: string })?.message || text || "카카오 로그인 실패";
      return NextResponse.json({ message: msg }, { status: res.status });
    }

    let nextRes = NextResponse.json(data, { status: 200 });

    const tokens = data as {
      accessToken?: string;
      refreshToken?: string;
    };

    if (tokens.accessToken && tokens.refreshToken) {
      nextRes = setAuthCookies(nextRes, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    }

    return nextRes;
  } catch (err) {
    console.error("[/api/oauth/kakao] Error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
