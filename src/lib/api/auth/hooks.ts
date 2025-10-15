import { useQueryClient } from "node_modules/@tanstack/react-query/build/modern/QueryClientProvider";

import { useApiMutation, ApiMutationOptions } from "@/lib/hooks/useApiMutation";

import { login, logout, refreshToken } from "./api";
import { LoginReq, LoginRes, TokenRes } from "./types";

//POST: 로그인
export function useLogin(isMock = false, options?: ApiMutationOptions<LoginRes, LoginReq>) {
  return useApiMutation<LoginRes, LoginReq>(isMock ? undefined : (data) => login(data), {
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

//POST: 토큰 재발급
export function useRefreshToken(isMock = false, options?: ApiMutationOptions<TokenRes, undefined>) {
  return useApiMutation<TokenRes, undefined>(isMock ? undefined : () => refreshToken(), {
    mockResponse: isMock ? { refreshToken: "mock-refresh", accessToken: "mock-access" } : undefined,
    ...options,
  });
}

// POST: 로그아웃
export function useLogout(options?: ApiMutationOptions<undefined, undefined>) {
  const queryClient = useQueryClient();

  return useApiMutation<undefined, undefined>(() => logout(), {
    onSuccess: () => {
      queryClient.clear();
      window.location.reload();
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
    },
    ...options,
  });
}
