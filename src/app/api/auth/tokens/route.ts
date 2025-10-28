import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { BASE_URL } from "@/lib/server/constants";
import { setAuthCookies } from "@/lib/server/tokens";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "refreshToken 없음" }, { status: 401 });
    }

    const res = await fetch(`${BASE_URL}/auth/tokens`, {
      method: "POST",
      headers: { Cookie: `refreshToken=${refreshToken}` },
      credentials: "include",
    });

    const text = await res.text();

    if (!res.ok) {
      const nextRes = new NextResponse(text, { status: res.status });
      nextRes.cookies.delete("accessToken");
      nextRes.cookies.delete("refreshToken");
      return nextRes;
    }

    const tokens = JSON.parse(text);
    const nextRes = NextResponse.json(tokens, { status: 200 });

    return setAuthCookies(nextRes, tokens);
  } catch (error) {
    console.error("[/api/auth/tokens] Error:", error);
    return NextResponse.json({ message: "토큰 갱신 실패", error: String(error) }, { status: 500 });
  }
}
