import { apiRequest } from "@/lib/apiRequest";

import { LoginRequest, LoginResponse, TokenResponse } from "./types";

// POST: 로그인
export function login(data: LoginRequest) {
  return apiRequest<LoginResponse>(`/auth/login`, {
    method: "POST",
    data,
  });
}

// POST: 토큰 재발급
export function refreshToken() {
  return apiRequest<TokenResponse>(`/auth/tokens`, { method: "POST" });
}
