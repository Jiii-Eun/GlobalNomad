import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const jar = await cookies();
  const token = jar.get("accessToken")?.value;

  // 토큰 존재만으로 로그인 간주 (만료 검증은 실제 API 호출 시 401로 처리)
  return NextResponse.json({ loggedIn: Boolean(token) }, { status: 200 });
}
