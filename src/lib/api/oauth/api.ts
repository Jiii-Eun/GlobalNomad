import { apiRequest } from "@/lib/apiRequest";

import {
  OAuthRequest,
  OAuthResponse,
  OAuthSignUpRequest,
  OAuthSignUpResponse,
  OAuthLoginResponse,
} from "./types";

// POST: App 등록/수정
export function registerOAuthApp(data: OAuthRequest) {
  return apiRequest<OAuthResponse>(`/oauth/apps`, { method: "POST", data });
}

// POST: 간편 회원가입
export function oauthSignUp(provider: "google" | "kakao", data: OAuthSignUpRequest) {
  return apiRequest<OAuthSignUpResponse>(`/oauth/sign-up/${provider}`, {
    method: "POST",
    data,
  });
}

// POST: 간편 로그인
export function oauthSignIn(provider: "google" | "kakao", data: OAuthSignUpRequest) {
  return apiRequest<OAuthLoginResponse>(`/oauth/sign-in/${provider}`, {
    method: "POST",
    data,
  });
}
