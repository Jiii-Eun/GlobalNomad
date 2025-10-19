"use client";

import KaKaoLogin from "@/assets/brand/logo-kakao.svg";
import { buildKakaoAuthUrl, rememberKakaoStateFromUrl } from "@/lib/utills/kakao";

export default function KaKaoLoginButton({ mode }: { mode: "signin" | "signup" }) {
  const onClick = () => {
    const url = buildKakaoAuthUrl(mode); // kauth로 보낼 url 생성
    rememberKakaoStateFromUrl(url); // state 세션 저장
    window.location.href = url; // 인가 페이지로 이동
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-24 w-24 items-center justify-center"
      aira-label={`SNS 계정으로 ${mode === "signin" ? "로그인하기" : "회원가입하기"}`}
    >
      <KaKaoLogin aria-hidden="true" className="h-16 w-16" />
    </button>
  );
}
