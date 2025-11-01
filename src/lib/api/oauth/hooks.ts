import { useApiMutation, ApiMutationOptions } from "@/lib/hooks/useApiMutation";

import { registerOAuthApp, oauthSignUp, oauthSignIn } from "./api";
import {
  OAuthReq,
  OAuthRes,
  OAuthSignUpReq,
  OAuthSignUpRes,
  OAuthLoginRes,
  OAuthLoginReq,
} from "./types";

//POST: App 등록/수정
export function useRegisterOAuthApp(
  isMock = false,
  options?: ApiMutationOptions<OAuthRes, OAuthReq>,
) {
  return useApiMutation<OAuthRes, OAuthReq>(isMock ? undefined : (data) => registerOAuthApp(data), {
    mockResponse: isMock
      ? {
          id: 1,
          appKey: "mockAppKey",
          provider: "KAKAO",
          teamId: "mockTeam",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : undefined,
    ...options,
  });
}

//POST: 간편 회원가입
export function useOAuthSignUp(
  isMock = false,
  options?: ApiMutationOptions<OAuthSignUpRes, OAuthSignUpReq>,
) {
  return useApiMutation<OAuthSignUpRes, OAuthSignUpReq>(
    isMock ? undefined : (data) => oauthSignUp("kakao", data),
    {
      mockResponse: isMock
        ? {
            user: {
              id: 1,
              email: "mock@user.com",
              nickname: "MockUser",
              profileImageUrl: "/mock/user.png",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            refreshToken: "mock-refresh",
            accessToken: "mock-access",
          }
        : undefined,
      ...options,
    },
  );
}

//POST: 간편 로그인
export function useOAuthSignIn(
  isMock = false,
  options?: ApiMutationOptions<OAuthLoginRes, OAuthLoginReq>,
) {
  return useApiMutation<OAuthLoginRes, OAuthLoginReq>(
    isMock ? undefined : (data) => oauthSignIn("kakao", data),
    {
      mockResponse: isMock
        ? {
            redirectUri: "http://localhost:3000/oauth/kakao",
            token: "mock-token",
          }
        : undefined,
      ...options,
    },
  );
}
