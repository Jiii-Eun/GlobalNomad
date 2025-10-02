import { apiRequest } from "@/lib/apiRequest";

import {
  OAuthRequest,
  OAuthResponse,
  OAuthResponseSchema,
  OAuthSignUpRequest,
  OAuthSignUpResponse,
  OAuthSignUpResponseSchema,
  OAuthLoginResponse,
  OAuthLoginResponseSchema,
} from "./types";

// POST: App 등록/수정
export function registerOAuthApp(data: OAuthRequest) {
  return apiRequest<OAuthResponse>(`/oauth/apps`, {
    method: "POST",
    data,
    schema: OAuthResponseSchema,
  });
}

// POST: 간편 회원가입
export function oauthSignUp(provider: "kakao", data: OAuthSignUpRequest) {
  return apiRequest<OAuthSignUpResponse>(`/oauth/sign-up/${provider}`, {
    method: "POST",
    data,
    schema: OAuthSignUpResponseSchema,
  });
}

// POST: 간편 로그인
export function oauthSignIn(provider: "kakao", data: OAuthSignUpRequest) {
  return apiRequest<OAuthLoginResponse>(`/oauth/sign-in/${provider}`, {
    method: "POST",
    data,
    schema: OAuthLoginResponseSchema,
  });
}
