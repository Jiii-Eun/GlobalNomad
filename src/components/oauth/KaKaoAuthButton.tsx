"use client";
import KaKaoLogin from "@/assets/brand/logo-kakao.svg";

type Mode = "signin" | "signup";

function getRedirectUri(mode: Mode): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}${mode === "signin" ? "/oauth/kakao" : "/oauth/signup/kakao"}`;
}

export default function KaKaoAuthButton({ mode }: { mode: Mode }) {
  const onClick = () => {
    const K = typeof window !== "undefined" ? window.Kakao : undefined;

    if (!K) return alert("카카오 SDK가 아직 로드되지 않았습니다.");
    if (!K.isInitialized()) return alert("카카오 SDK 초기화 전입니다.");

    const redirectUri = getRedirectUri(mode);
    K.Auth.authorize({ redirectUri, state: mode });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-24 w-24 items-center justify-center"
      aria-label={`SNS 계정으로 ${mode === "signin" ? "로그인하기" : "회원가입하기"}`}
    >
      <KaKaoLogin aria-hidden className="h-16 w-16" />
    </button>
  );
}
