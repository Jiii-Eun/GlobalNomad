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

const MOCK_REDIRECT = "http://localhost:3000/oauth/kakao" as const;

//POST: 간편 로그인
export function useOAuthSignIn(
  isMock = false,
  options?: ApiMutationOptions<OAuthLoginRes, OAuthLoginReq>,
) {
  const redirectUri =
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ?? "http://localhost:3000/oauth/kakao/callback";
  return useApiMutation<OAuthLoginRes, OAuthLoginReq>(
    isMock ? undefined : (data) => oauthSignIn("kakao", { ...data, redirectUri }),
    {
      mockResponse: isMock
        ? {
            redirectUri: MOCK_REDIRECT,
            token: "mock-token",
          }
        : undefined,
      ...options,
    },
  );
}
