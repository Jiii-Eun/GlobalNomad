import { z } from "zod";

// POST: 회원가입
export const SignUpReqSchema = z.object({
  email: z.string(),
  nickname: z.string(),
  password: z.string(),
});
export type SignUpReq = z.infer<typeof SignUpReqSchema>;

// <공통 응답> GET: 내 정보 조회, POST: 회원가입, PATCH: 내 정보 수정
export const UserResSchema = z.object({
  id: z.number(),
  email: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type UserRes = z.infer<typeof UserResSchema>;

//POST: 내 정보 수정
export const EditUserReqSchema = z.object({
  nickname: z.string().optional(),
  profileImageUrl: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
  newPassword: z.string().optional(),
});
export type EditUserReq = z.infer<typeof EditUserReqSchema>;

//POST: 프로필 이미지 URL 생성
export const UploadProfileImageReqSchema = z.object({
  image: z.instanceof(File),
});
export type UploadProfileImageReq = z.infer<typeof UploadProfileImageReqSchema>;

export const UploadProfileImageResSchema = z.object({
  profileImageUrl: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
});
export type UploadProfileImageRes = z.infer<typeof UploadProfileImageResSchema>;
