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
export function refreshToken() {
  return apiRequest<TokenRes>(`/auth/tokens`, {
    method: "POST",
    schema: TokenResSchema,
  });
}
