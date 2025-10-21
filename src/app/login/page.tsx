"use client";

import { Suspense } from "react";
import { useForm } from "react-hook-form";

import KaKaoLoginButton from "@/components/oauth/KaKaoAuthButton";
import Logo from "@/components/ui/brand/Logo";
import Button from "@/components/ui/button/Button";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";

import KakaoSigninHandler from "./KakaoSigninHandler";
import TestLoginPage from "../components/TestLogin";

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({ mode: "onBlur", defaultValues: { email: "", password: "" } });

  const onSubmit = async () => {
    // 추후 api 연동
  };

  return (
    <main className="mx-auto mt-28 w-full max-w-[640px]">
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
          isDisabled={!isValid || isSubmitting}
          className="h-12 w-full text-lg"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>

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
      <TestLoginPage />
    </main>
  );
}
