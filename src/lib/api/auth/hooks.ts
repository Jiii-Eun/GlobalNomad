import { useApiMutation, ApiMutationOptions } from "@/lib/hooks/useApiMutation";

import { login, refreshToken } from "./api";
import { LoginRequest, LoginResponse, TokenResponse } from "./types";

/** POST: 로그인 */
export function useLogin(
  isMock = false,
  options?: ApiMutationOptions<LoginResponse, LoginRequest>,
) {
  return useApiMutation<LoginResponse, LoginRequest>(isMock ? undefined : (data) => login(data), {
    mockResponse: isMock
      ? {
          user: {
            id: 1,
            email: "mock@test.com",
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
  });
}

/** POST: 토큰 재발급 */
export function useRefreshToken(
  isMock = false,
  options?: ApiMutationOptions<TokenResponse, undefined>,
) {
  return useApiMutation<TokenResponse, undefined>(isMock ? undefined : () => refreshToken(), {
    mockResponse: isMock ? { refreshToken: "mock-refresh", accessToken: "mock-access" } : undefined,
    ...options,
  });
}
