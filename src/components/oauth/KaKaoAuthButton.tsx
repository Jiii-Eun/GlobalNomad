"use client";
import KaKaoLogin from "@/assets/brand/logo-kakao.svg";

type Mode = "signin" | "signup";
const REST_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_KEY ?? "";

function getRedirectUri(mode: Mode): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}${mode === "signin" ? "/oauth/kakao" : "/oauth/signup/kakao"}`;
}

export default function KaKaoAuthButton({ mode }: { mode: Mode }) {
  const onClick = () => {
    if (!REST_KEY) {
      alert("NEXT_PUBLIC_KAKAO_REST_KEY 누락");
      return;
    }
    const redirectUri = getRedirectUri(mode);

    const params = new URLSearchParams({
      client_id: REST_KEY,
      redirect_uri: redirectUri,
      response_type: "code",
      state: mode,
    });

    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
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
