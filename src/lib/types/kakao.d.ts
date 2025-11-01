// src/lib/types/oauth.ts
export type OAuthState = "signin" | "signup";

export interface OAuthSuccess {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: number;
    email?: string;
    nickname?: string;
    profileImageUrl?: string | null;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export interface OAuthError {
  message: string;
  [k: string]: unknown;
}

export interface OAuthProxyReq {
  code: string;
  redirectUri?: string;
  state?: OAuthState;
}

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function hasTokens(v: unknown): v is OAuthSuccess {
  if (!isRecord(v)) return false;
  return typeof v.accessToken === "string" && typeof v.refreshToken === "string";
}

export function hasMessage(v: unknown): v is OAuthError {
  return isRecord(v) && typeof v.message === "string";
}
