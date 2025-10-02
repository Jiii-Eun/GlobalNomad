import { apiRequest } from "@/lib/apiRequest";

import { SignUpRequest, UserResponse, EditUserRequest, UploadProfileImageResponse } from "./types";

// POST: 회원가입
export function signUp(data: SignUpRequest) {
  return apiRequest<UserResponse>(`/users`, { method: "POST", data });
}

// GET: 내 정보 조회
export function getMe() {
  return apiRequest<UserResponse>(`/users/me`);
}

// PATCH: 내 정보 수정
export function editMe(data: EditUserRequest) {
  return apiRequest<UserResponse>(`/users/me`, { method: "PATCH", data });
}

// POST: 프로필 이미지 업로드
export function uploadProfileImage(formData: FormData) {
  return apiRequest<UploadProfileImageResponse>(`/users/me/image`, {
    method: "POST",
    isFormData: true,
    data: formData,
  });
}
