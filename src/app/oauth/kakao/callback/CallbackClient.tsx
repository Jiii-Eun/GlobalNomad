"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type KakaoIntent = "signin" | "signup";

interface KakaoAuthSuccess {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: number | string;
    email?: string;
    nickname?: string;
    profileImageUrl?: string | null;
  };
}
interface ApiErrorBody {
  message?: string;
}

const CALLBACK_PATH = "/oauth/kakao/callback" as const;

const safeJson = <T,>(text: string): T | null => {
  try {
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
};
const hasMessage = (x: unknown): x is ApiErrorBody =>
  typeof (x as { message?: unknown })?.message === "string";

const getRedirectUri = () => new URL(CALLBACK_PATH, window.location.origin).toString();

const rememberState = (state: string | null) => {
  if (state) sessionStorage.setItem("kakao_oauth_state", state);
};
const verifyState = (returned: string | null) => {
  const saved = sessionStorage.getItem("kakao_oauth_state");
  return saved ? saved === (returned ?? "") : true;
};

export default function CallbackClient() {
  const router = useRouter();
  const qc = useQueryClient();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      const sp = new URLSearchParams(window.location.search);
      const code = sp.get("code");
      const state = sp.get("state");
      const redirectUri = getRedirectUri();

      rememberState(state);

      if (!code) {
        throw new Error("카카오 인가 코드가 없습니다.");
      }
      if (!verifyState(state)) {
        throw new Error("유효하지 않은 state 입니다.");
      }

      const apiUrl = new URL("/api/oauth/kakao", window.location.origin).toString();
      console.log("[KakaoCallback] POST →", apiUrl, { redirectUri });

      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, state, redirectUri }),
      });

      const text = await resp.text();
      if (!resp.ok) {
        const parsed = safeJson<ApiErrorBody>(text);
        const msg =
          (parsed && hasMessage(parsed) && parsed.message) || text || `HTTP ${resp.status}`;
        throw new Error(msg);
      }

      const ok = safeJson<KakaoAuthSuccess>(text);
      console.log("[KakaoCallback] success:", ok);

      await qc.invalidateQueries({ queryKey: ["me"] });

      router.replace("/");
    })().catch((err) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[KakaoCallback] 오류:", msg);
      setErrorMsg(msg);
    });
  }, [qc, router]);

  if (errorMsg) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-red-600">카카오 로그인 실패: {errorMsg}</p>
      </div>
    );
  }

  return <p className="p-6 text-center">카카오 로그인 처리 중…</p>;
}
