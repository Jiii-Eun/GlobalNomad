"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function hasMessage(v: unknown): v is { message: string } {
  return isRecord(v) && typeof v.message === "string";
}
function hasTokens(v: unknown): v is { accessToken: string; refreshToken: string } {
  return isRecord(v) && typeof v.accessToken === "string" && typeof v.refreshToken === "string";
}

export default function KakaoSigninCallback() {
  const router = useRouter();
  const sp = useSearchParams();
  const once = useRef(false);

  useEffect(() => {
    const code = sp.get("code");
    if (!code || once.current) return;
    once.current = true;

    (async () => {
      const redirectUri = `${window.location.origin}/oauth/kakao`;

      const res = await fetch("/api/oauth/kakao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirectUri }),
      });

      const txt = await res.text();
      let payload: unknown;
      try {
        payload = JSON.parse(txt);
      } catch {
        payload = { message: txt };
      }

      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      window.history.replaceState(null, "", url.toString());

      if (!res.ok) {
        console.error("[/oauth/kakao] 실패:", hasMessage(payload) ? payload.message : payload);
        router.replace("/login?error=oauth_failed");
        return;
      }

      if (hasTokens(payload)) {
        router.replace("/");
      } else {
        router.replace("/login?error=invalid_oauth_response");
      }
    })();
  }, [sp, router]);

  return null;
}
