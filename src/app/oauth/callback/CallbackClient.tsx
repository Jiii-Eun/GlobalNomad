"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { verifyKakaoState } from "@/lib/utills/kakao";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const code = sp.get("code");
    const state = sp.get("state") ?? "";
    if (!code) return;

    if (!verifyKakaoState(state)) {
      router.replace("/login?error=state-mismatch");
      return;
    }
    const intent = state.split(":")[0] as "signin" | "signup";

    (async () => {
      try {
        const res = await fetch("/api/oauth/kakao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            state,
            redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "카카오 코드 교환 실패");

        const token: string = data?.accessToken ?? data?.token;
        if (!token || (intent !== "signin" && intent !== "signup"))
          throw new Error("토큰/intent 누락");

        const qs = new URLSearchParams({ kakao_token: token }).toString();
        router.replace(`/${intent}?${qs}`);
      } catch (e) {
        console.error(e);
        router.replace("/login?error=kakao");
      }
    })();
  }, [sp, router]);

  return <main className="mx-auto mt-24 max-w-40 p-6">카카오 로그인 처리 중...</main>;
}
