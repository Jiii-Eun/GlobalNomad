import { z } from "zod";

// POST: 회원가입
export const SignUpRequestSchema = z.object({
  email: z.string(),
  nickname: z.string(),
  password: z.string(),
});
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;

// <공통 응답> GET: 내 정보 조회, POST: 회원가입, PATCH: 내 정보 수정
export const UserResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;

//POST: 내 정보 수정
export const EditUserRequestSchema = z.object({
  nickname: z.string().optional(),
  profileImageUrl: z.union([z.string(), z.instanceof(File)]).optional(),
  newPassword: z.string().optional(),
});
export type EditUserRequest = z.infer<typeof EditUserRequestSchema>;

//POST: 프로필이미지 업로드
export const UploadProfileImageRequestSchema = z.object({
  image: z.instanceof(File),
});
export type UploadProfileImageRequest = z.infer<typeof UploadProfileImageRequestSchema>;

export const UploadProfileImageResponseSchema = z.object({
  profileImageUrl: z.string(),
});
export type UploadProfileImageResponse = z.infer<typeof UploadProfileImageResponseSchema>;
