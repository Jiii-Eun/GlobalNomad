import { apiRequest } from "@/lib/apiRequest";

import { LoginReq, LoginRes, TokenRes, LoginResSchema, TokenResSchema } from "./types";

// POST: 로그인
export function login(data: LoginReq) {
  return apiRequest<LoginRes>(`/auth/login`, {
    method: "POST",
    data,
    schema: LoginResSchema,
  });
}

// POST: 토큰 재발급
export function PostToken() {
  return apiRequest<TokenRes>(`/auth/tokens`, {
    method: "POST",
    schema: TokenResSchema,
  });
}

// POST: 로그아웃
export async function logout() {
  const res = await fetch("/api/auth/logout", { method: "POST" });

  if (!res.ok) {
    throw new Error("로그아웃 실패");
  }

  return res.json();
}
