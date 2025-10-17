"use client";

import { Suspense, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import KaKaoLoginButton from "@/components/oauth/KaKaoAuthButton";
import Logo from "@/components/ui/brand/Logo";
import Button from "@/components/ui/button/Button";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";

import KakaoSignupBridge from "./KakaoSignupBridge";

interface FormValues {
  email: string;
  nickname: string;
  password: string;
  confirm: string;
}

export default function Signup() {
  const [kakaoToken, setKakaoToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields, dirtyFields },
    control,
    trigger,
    getValues,
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { email: "", nickname: "", password: "", confirm: "" },
  });

  const pw = useWatch({ control, name: "password" });
  useEffect(() => {
    const hasPw = !!pw;
    const confirmPw = getValues("confirm");
    const confirmTouched = touchedFields.confirm || dirtyFields.confirm;
    if (hasPw && (confirmPw || confirmTouched)) {
      void trigger("confirm");
    }
  }, [pw, trigger, getValues, touchedFields.confirm, dirtyFields.confirm]);

  const onSubmit = async (values: FormValues) => {
    // 추후 api 연동
    if (kakaoToken) {
      console.log("[KAKAO SIGNUP]", { nickname: values.nickname, token: kakaoToken });
      alert(`간편회원가입 (모의): 닉네임="${values.nickname}"\n토큰=${kakaoToken?.slice(0, 8)}...`);
    } else {
      console.log("[EMAIL SIGNUP]", values);
      alert(`일반 회원가입 (모의): ${values.email} / ${values.nickname}`);
    }
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

        <Field id="nickname" label="닉네임" error={errors.nickname?.message}>
          <Input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력해 주세요."
            maxLength={10}
            aria-invalid={!!errors.nickname}
            {...register("nickname", {
              setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
              required: "닉네임을 입력해주세요.",
              validate: (v) => (v?.length ?? 0) > 0 || "닉네임을 입력해 주세요.",
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

        <Field id="confirm" label="비밀번호 확인" error={errors.confirm?.message}>
          <Input
            id="confirm"
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요."
            aria-invalid={!!errors.confirm}
            {...register("confirm", {
              required: "비밀번호를 다시 입력해 주세요.",
              validate: (v) => v === getValues("password") || "비밀번호가 일치하지 않습니다.",
            })}
          />
        </Field>

        <Button
          type="submit"
          variant="b"
          isDisabled={!isValid || isSubmitting}
          className="h-12 w-full text-lg"
        >
          {isSubmitting ? "가입 중..." : "회원가입"}
        </Button>

        <div className="mt-12 flex items-center gap-4 text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          <span className="text-lg">SNS 계정으로 회원가입하기</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="mt-6 flex justify-center">
          <KaKaoLoginButton mode="signup" />
        </div>

        <Suspense fallback={null}>
          <KakaoSignupBridge onToken={setKakaoToken} />
        </Suspense>
      </form>
    </main>
  );
}
