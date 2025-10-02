import { UserResponse } from "@/lib/api/users/types";

// OAuth 등록/수정
export interface OAuthRequest {
  appKey: string;
  provider: "KAKAO";
}

export interface OAuthResponse {
  createdAt: string;
  updatedAt: string;
  appKey: string;
  provider: string;
  teamId: string;
  id: number;
}

// <공통 응답> Post: 간편 회원가입, Post: 간편 로그인
export interface OAuthSignUpResponse {
  user: UserResponse;
  refreshToken: string;
  accessToken: string;
}

// Post: 간편 회원가입
export interface OAuthSignUpRequest {
  nickname: string;
  redirectUri: "http://localhost:3000/oauth/kakao";
  token: string;
}

// Post: 간편 로그인
export interface OAuthLoginResponse {
  redirectUri: "http://localhost:3000/oauth/kakao";
  token: string;
}
