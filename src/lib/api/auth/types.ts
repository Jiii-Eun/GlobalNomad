import { z } from "zod";

import { UserResSchema } from "@/lib/api/users/types";

// POST: 로그인
export const LoginReqSchema = z.object({
  email: z.string(),
  password: z.string(),
});
export type LoginReq = z.infer<typeof LoginReqSchema>;

export const LoginResSchema = z.object({
  user: UserResSchema,
  refreshToken: z.string(),
  accessToken: z.string(),
});
export type LoginRes = z.infer<typeof LoginResSchema>;

// POST: 토큰 재발급
export const TokenResSchema = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
});
export type TokenRes = z.infer<typeof TokenResSchema>;
