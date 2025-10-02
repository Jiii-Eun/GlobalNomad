import { z } from "zod";

import { UserResponseSchema } from "@/lib/api/users/types";

// OAuth 등록/수정
export const OAuthRequestSchema = z.object({
  appKey: z.string(),
  provider: z.literal("KAKAO"),
});
export type OAuthRequest = z.infer<typeof OAuthRequestSchema>;

export const OAuthResponseSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  appKey: z.string(),
  provider: z.string(),
  teamId: z.string(),
  id: z.number(),
});
export type OAuthResponse = z.infer<typeof OAuthResponseSchema>;

// <공통 응답> Post: 간편 회원가입, Post: 간편 로그인
export const OAuthSignUpResponseSchema = z.object({
  user: UserResponseSchema,
  refreshToken: z.string(),
  accessToken: z.string(),
});
export type OAuthSignUpResponse = z.infer<typeof OAuthSignUpResponseSchema>;

// Post: 간편 회원가입
export const OAuthSignUpRequestSchema = z.object({
  nickname: z.string(),
  redirectUri: z.literal("http://localhost:3000/oauth/kakao"),
  token: z.string(),
});
export type OAuthSignUpRequest = z.infer<typeof OAuthSignUpRequestSchema>;

// Post: 간편 로그인
export const OAuthLoginResponseSchema = z.object({
  redirectUri: z.literal("http://localhost:3000/oauth/kakao"),
  token: z.string(),
});
export type OAuthLoginResponse = z.infer<typeof OAuthLoginResponseSchema>;
