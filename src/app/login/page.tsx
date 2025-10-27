"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";

import KaKaoLoginButton from "@/components/oauth/KaKaoAuthButton";
import Logo from "@/components/ui/brand/Logo";
import Button from "@/components/ui/button/Button";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import { useLogin } from "@/lib/api/auth/hooks";
import { getMe } from "@/lib/api/users/api";

import { baseProfileNeeded } from "./baseProfileNeeded";
import KakaoSigninHandler from "./KakaoSigninHandler";

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({ mode: "onBlur", defaultValues: { email: "", password: "" } });

  const loginMutation = useLogin(false, {
    onSuccess: () => {
      router.push("/");
    },
    onError: (e: unknown) => {
      const msg = (e as { message?: string })?.message ?? "";
      if (/비밀번호/i.test(msg) || /password/i.test(msg)) {
        alert("비밀번호가 일치하지 않습니다.");
        setError("password", { type: "server", message: "비밀번호가 일치하지 않습니다." });
      } else if (/이메일/i.test(msg) || /email/i.test(msg)) {
        setError("email", { type: "server", message: "이메일 형식으로 작성해 주세요." });
      } else {
        setError("email", { type: "server", message: msg || "로그인에 실패했습니다." });
      }
    },
  });

  const onSubmit = async (v: FormValues) => {
    await loginMutation.mutateAsync({ email: v.email.trim(), password: v.password });

    const me = await getMe();
    await baseProfileNeeded(me);
    await qc.invalidateQueries({ queryKey: ["me"] });
    router.push("/");
  };

  return (
    <main
      className={[
        "mx-auto mt-28 w-full max-w-[640px]",
        "tablet:px-[52px] tablet:max-w-[640px]",
        "mobile:mt-[110px] mobile:px-[13px] mobile:max-w-[350px]",
      ].join(" ")}
    >
      <Logo />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
        <Field id="email" label="이메일" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력해 주세요."
            aria-invalid={!!errors.email}
            {...register("email", {
              setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
              required: "이메일을 입력해 주세요.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "이메일을 입력해 주세요.",
              },
            })}
          />
        </Field>

        <Field id="password" label="비밀번호" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            aria-invalid={!!errors.password}
            {...register("password", {
              required: "비밀번호를 입력해 주세요.",
              minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." },
            })}
          />
        </Field>

        <Button
          type="submit"
          variant="b"
          isDisabled={!isValid || isSubmitting || loginMutation.isPending}
          className="h-12 w-full text-lg"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>

        <div className="mx-auto mt-8 flex w-fit gap-3">
          <span className="text-brand-gray-900 text-lg whitespace-nowrap">회원이 아니신가요?</span>
          <Link
            href="/signup"
            className="text-brand-deep-green-500 text-lg underline decoration-solid"
          >
            회원가입하기
          </Link>
        </div>

        <div className="mt-12 flex items-center gap-4 text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          <span className="text-lg">SNS 계정으로 로그인하기</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="mt-6 flex justify-center">
          <KaKaoLoginButton mode="signin" />
        </div>

        <Suspense fallback={null}>
          <KakaoSigninHandler />
        </Suspense>
      </form>
    </main>
  );
}
