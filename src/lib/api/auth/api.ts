import { apiRequest } from "@/lib/apiRequest";

import {
  LoginRequest,
  LoginResponse,
  TokenResponse,
  LoginResponseSchema,
  TokenResponseSchema,
} from "./types";

// POST: 로그인
export function login(data: LoginRequest) {
  return apiRequest<LoginResponse>(`/auth/login`, {
    method: "POST",
    data,
    schema: LoginResponseSchema,
  });
}

// POST: 토큰 재발급
export function refreshToken() {
  return apiRequest<TokenResponse>(`/auth/tokens`, {
    method: "POST",
    schema: TokenResponseSchema,
  });
}
