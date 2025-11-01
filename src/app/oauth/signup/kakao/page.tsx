"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

import Button from "@/components/ui/button/Button";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function hasTokens(v: unknown): v is { accessToken: string; refreshToken: string } {
  return isRecord(v) && typeof v.accessToken === "string" && typeof v.refreshToken === "string";
}
function hasMessage(v: unknown): v is { message: string } {
  return isRecord(v) && typeof v.message === "string";
}

export default function KakaoSignupCallback() {
  const router = useRouter();
  const sp = useSearchParams();
  const once = useRef(false);

  const code = sp.get("code");
  const redirectUri =
    (typeof window !== "undefined" ? window.location.origin : "") + "/oauth/signup/kakao";

  const [nickname, setNickname] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [autoFromSession, setAutoFromSession] = useState(false);

  useEffect(() => {
    if (!code) router.replace("/signup?error=missing_code");
  }, [code, router]);

  useEffect(() => {
    if (!code) return;
    const saved = typeof window !== "undefined" ? sessionStorage.getItem("kakao_nickname") : null;
    if (saved) {
      setNickname(saved);
      setAutoFromSession(true);
    }
  }, [code]);

  useEffect(() => {
    if (!code || !autoFromSession || !nickname.trim() || once.current) return;
    once.current = true;
    void submitSignup(nickname, code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, nickname, autoFromSession]);

  async function submitSignup(nick: string, kakaoCode: string) {
    try {
      setPending(true);
      setError("");

      const res = await fetch("/api/oauth/kakao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nick.trim(), redirectUri, code: kakaoCode }),
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
        setError(hasMessage(payload) ? payload.message : "간편회원가입에 실패했습니다.");
        once.current = false;
        return;
      }

      if (hasTokens(payload)) {
        sessionStorage.removeItem("kakao_nickname");
        router.replace("/");
      } else {
        setError("유효하지 않은 응답입니다.");
        once.current = false;
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      once.current = false;
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code) return;
    const n = nickname.trim();
    if (!n) return setError("닉네임을 입력해 주세요.");
    if (n.length > 10) return setError("닉네임은 10자 이하로 입력해 주세요.");

    setAutoFromSession(false);
    sessionStorage.setItem("kakao_nickname", n);
    void submitSignup(n, code);
  }

  if (!code) return null;

  return (
    <main className="mx-auto mt-28 w-full max-w-[560px] px-4">
      <h1 className="mb-6 text-2xl font-semibold">카카오 간편회원가입</h1>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <Field id="nickname" label="닉네임 (최대 10자)" error={error || undefined}>
          <Input
            id="nickname"
            type="text"
            maxLength={10}
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setAutoFromSession(false);
              if (error) setError("");
            }}
            aria-invalid={!!error}
            placeholder="닉네임을 입력해 주세요."
          />
        </Field>

        <Button
          type="submit"
          variant="b"
          isDisabled={!nickname.trim() || pending}
          className="h-12 w-full text-lg"
        >
          {pending ? "가입 처리 중..." : "카카오로 가입 완료"}
        </Button>

        <Button
          type="button"
          isDisabled={pending}
          onClick={() => router.replace("/signup")}
          className="h-11 w-full"
        >
          돌아가기
        </Button>
      </form>
    </main>
  );
}
