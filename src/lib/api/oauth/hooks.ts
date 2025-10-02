import { useApiMutation, ApiMutationOptions } from "@/lib/hooks/useApiMutation";

import { registerOAuthApp, oauthSignUp, oauthSignIn } from "./api";
import {
  OAuthRequest,
  OAuthResponse,
  OAuthSignUpRequest,
  OAuthSignUpResponse,
  OAuthLoginResponse,
} from "./types";

/** POST: App 등록/수정 */
export function useRegisterOAuthApp(
  isMock = false,
  options?: ApiMutationOptions<OAuthResponse, OAuthRequest>,
) {
  return useApiMutation<OAuthResponse, OAuthRequest>(
    isMock ? undefined : (data) => registerOAuthApp(data),
    {
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
    },
  );
}

/** POST: 간편 회원가입 */
export function useOAuthSignUp(
  isMock = false,
  options?: ApiMutationOptions<OAuthSignUpResponse, OAuthSignUpRequest>,
) {
  return useApiMutation<OAuthSignUpResponse, OAuthSignUpRequest>(
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

/** POST: 간편 로그인 */
export function useOAuthSignIn(
  isMock = false,
  options?: ApiMutationOptions<OAuthLoginResponse, OAuthSignUpRequest>,
) {
  return useApiMutation<OAuthLoginResponse, OAuthSignUpRequest>(
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
