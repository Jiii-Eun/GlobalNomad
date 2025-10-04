import { apiRequest } from "@/lib/apiRequest";

import {
  OAuthReq,
  OAuthRes,
  OAuthResSchema,
  OAuthSignUpReq,
  OAuthSignUpRes,
  OAuthSignUpResSchema,
  OAuthLoginRes,
  OAuthLoginResSchema,
  OAuthLoginReq,
} from "./types";

// POST: App 등록/수정
export function registerOAuthApp(data: OAuthReq) {
  return apiRequest<OAuthRes>(`/oauth/apps`, {
    method: "POST",
    data,
    schema: OAuthResSchema,
  });
}

// POST: 간편 회원가입
export function oauthSignUp(provider: "kakao", data: OAuthSignUpReq) {
  return apiRequest<OAuthSignUpRes>(`/oauth/sign-up/${provider}`, {
    method: "POST",
    data,
    schema: OAuthSignUpResSchema,
  });
}

// POST: 간편 로그인
export function oauthSignIn(provider: "kakao", data: OAuthLoginReq) {
  return apiRequest<OAuthLoginRes>(`/oauth/sign-in/${provider}`, {
    method: "POST",
    data,
    schema: OAuthLoginResSchema,
  });
}
