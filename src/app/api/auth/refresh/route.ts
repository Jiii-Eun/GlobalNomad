import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST() {
  const refreshToken = (await cookies()).get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "리프레시 토큰이 없습니다. 다시 로그인하세요." },
      { status: 401 },
    );
  }

  const res = await fetch(`${BASE_URL}/auth/tokens`, {
    method: "POST",
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    return NextResponse.json({ message: "토큰 갱신 실패. 다시 로그인하세요." }, { status: 401 });
  }

  const data = await res.json();

  const response = NextResponse.json({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  response.cookies.set("accessToken", data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
  response.cookies.set("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return response;
}
