"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useOAuthSignIn } from "@/lib/api/oauth/hooks";

const OAUTH_LOGIN_REDIRECT = "http://localhost:3000/oauth";

export default function KakaoSigninHandler() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get("kakao_token");
  const signIn = useOAuthSignIn();

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        await signIn.mutateAsync({ redirectUri: OAUTH_LOGIN_REDIRECT, token });
        router.replace("/");
      } catch {
        const qs = new URLSearchParams({ kakao_token: token }).toString();
        router.replace(`/signup?${qs}`);
      }
    })();
  }, [token, signIn, router]);

  return null;
}
