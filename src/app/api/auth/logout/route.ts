import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "로그아웃 완료" });

  res.cookies.delete("accessToken");
  res.cookies.delete("refreshToken");

  return res;
}
