import { useApiMutation, ApiMutationOptions } from "@/lib/hooks/useApiMutation";
import { useFetchQuery, FetchQueryOptions } from "@/lib/hooks/useFetchQuery";

import { signUp, getMe, editMe, uploadProfileImage } from "./api";
import { SignUpRequest, UserResponse, EditUserRequest, UploadProfileImageResponse } from "./types";

/** POST: 회원가입 */
export function useSignUp(
  isMock = false,
  options?: ApiMutationOptions<UserResponse, SignUpRequest>,
) {
  return useApiMutation<UserResponse, SignUpRequest>(isMock ? undefined : (data) => signUp(data), {
    mockResponse: isMock
      ? {
          id: 1,
          email: "mock@user.com",
          nickname: "MockUser",
          profileImageUrl: "/mock/user.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : undefined,
    ...options,
  });
}

/** GET: 내 정보 조회 */
export function useGetMe(isMock = false, options?: FetchQueryOptions<UserResponse>) {
  return useFetchQuery<UserResponse>(["me"], isMock ? undefined : () => getMe(), {
    mockData: isMock
      ? {
          id: 1,
          email: "mock@user.com",
          nickname: "MockUser",
          profileImageUrl: "/mock/user.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : undefined,
    ...options,
  });
}

/** PATCH: 내 정보 수정 */
export function useEditMe(
  isMock = false,
  options?: ApiMutationOptions<UserResponse, EditUserRequest>,
) {
  return useApiMutation<UserResponse, EditUserRequest>(
    isMock ? undefined : (data) => editMe(data),
    {
      mockResponse: isMock
        ? {
            id: 1,
            email: "mock@user.com",
            nickname: "UpdatedMockUser",
            profileImageUrl: "/mock/user.png",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : undefined,
      ...options,
    },
  );
}

/** POST: 프로필 이미지 업로드 */
export function useUploadProfileImage(
  isMock = false,
  options?: ApiMutationOptions<UploadProfileImageResponse, FormData>,
) {
  return useApiMutation<UploadProfileImageResponse, FormData>(
    isMock ? undefined : (formData) => uploadProfileImage(formData),
    {
      mockResponse: isMock ? { profileImageUrl: "/mock/uploaded.png" } : undefined,
      ...options,
    },
  );
}
