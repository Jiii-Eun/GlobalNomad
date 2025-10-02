import { z } from "zod";

import { UserResSchema } from "@/lib/api/users/types";

// OAuth 등록/수정
export const OAuthReqSchema = z.object({
  appKey: z.string(),
  provider: z.literal("KAKAO"),
});
export type OAuthReq = z.infer<typeof OAuthReqSchema>;

export const OAuthResSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  appKey: z.string(),
  provider: z.string(),
  teamId: z.string(),
  id: z.number(),
});
export type OAuthRes = z.infer<typeof OAuthResSchema>;

// <공통 응답> Post: 간편 회원가입, Post: 간편 로그인
export const OAuthSignUpResSchema = z.object({
  user: UserResSchema,
  refreshToken: z.string(),
  accessToken: z.string(),
});
export type OAuthSignUpRes = z.infer<typeof OAuthSignUpResSchema>;

// Post: 간편 회원가입
export const OAuthSignUpReqSchema = z.object({
  nickname: z.string(),
  redirectUri: z.literal("http://localhost:3000/oauth/kakao"),
  token: z.string(),
});
export type OAuthSignUpReq = z.infer<typeof OAuthSignUpReqSchema>;

// Post: 간편 로그인
export const OAuthLoginReqSchema = z.object({
  redirectUri: z.string(),
  token: z.string(),
});
export type OAuthLoginReq = z.infer<typeof OAuthLoginReqSchema>;

export const OAuthLoginResSchema = z.object({
  redirectUri: z.literal("http://localhost:3000/oauth/kakao"),
  token: z.string(),
});
export type OAuthLoginRes = z.infer<typeof OAuthLoginResSchema>;
