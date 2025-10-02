// POST: 회원가입
export interface SignUpRequest {
  email: string;
  nickname: string;
  password: string;
}

// <공통 응답> GET: 내 정보 조회, POST: 회원가입, PATCH: 내 정보 수정
export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

//POST: 내 정보 수정
export interface EditUserRequest {
  nickname?: string;
  profileImageUrl?: string | File;
  newPassword?: string;
}

//POST: 프로필이미지 업로드
export interface UploadProfileImageRequest {
  image: File;
}

export interface UploadProfileImageResponse {
  profileImageUrl: string;
}
