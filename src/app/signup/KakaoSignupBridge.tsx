"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function KakaoSignupBridge({ onToken }: { onToken: (t: string) => void }) {
  const sp = useSearchParams();
  const token = sp.get("kakao_token");
  useEffect(() => {
    if (token) onToken(token);
  }, [token, onToken]);
  return null;
}
