import { UserResponse } from "@/lib/api/users/types";

// POST: 로그인
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  user: UserResponse;
  refreshToken: string;
  accessToken: string;
}

// POST: 토큰 재발급
export interface TokenResponse {
  refreshToken: string;
  accessToken: string;
}
