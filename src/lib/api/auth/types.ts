import { z } from "zod";

import { UserResponseSchema } from "@/lib/api/users/types";

// POST: 로그인
export const LoginRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  user: UserResponseSchema,
  refreshToken: z.string(),
  accessToken: z.string(),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// POST: 토큰 재발급
export const TokenResponseSchema = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
});
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
