import { apiRequest } from "@/lib/apiRequest";

import {
  SignUpReq,
  UserRes,
  UserResSchema,
  EditUserReq,
  UploadProfileImageRes,
  UploadProfileImageResSchema,
} from "./types";

// POST: 회원가입
export function signUp(data: SignUpReq) {
  return apiRequest<UserRes>(`/users`, {
    method: "POST",
    data,
    schema: UserResSchema,
  });
}

// GET: 내 정보 조회
export function getMe() {
  return apiRequest<UserRes>(`/users/me`, {
    schema: UserResSchema,
  });
}

// PATCH: 내 정보 수정
export function editMe(data: EditUserReq) {
  return apiRequest<UserRes>(`/users/me`, {
    method: "PATCH",
    data,
    schema: UserResSchema,
  });
}

// POST: 프로필 이미지 업로드
export function uploadProfileImage(formData: FormData) {
  return apiRequest<UploadProfileImageRes>(`/users/me/image`, {
    method: "POST",
    isFormData: true,
    data: formData,
    schema: UploadProfileImageResSchema,
  });
}
