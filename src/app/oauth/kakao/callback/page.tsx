"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import CallbackClient from "./CallbackClient";

export default function Page() {
  const sp = useSearchParams();

  useEffect(() => {
    const code = sp.get("code");
    const state = sp.get("state");
    console.log("[CB] code:", code, " state:", state);
  }, [sp]);

  return (
    <Suspense fallback={null}>
      <CallbackClient />
    </Suspense>
  );
}
