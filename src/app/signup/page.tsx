"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import KaKaoLoginButton from "@/components/oauth/KaKaoAuthButton";
import Logo from "@/components/ui/brand/Logo";
import Button from "@/components/ui/button/Button";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import { useOAuthSignUp } from "@/lib/api/oauth/hooks";
import { useSignUp } from "@/lib/api/users/hooks";

import KakaoSignupBridge from "./KakaoSignupBridge";

interface FormValues {
  email: string;
  nickname: string;
  password: string;
  confirm: string;
}

export default function Signup() {
  const router = useRouter();
  const [kakaoToken, setKakaoToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields, dirtyFields },
    setError,
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

  //일반 회원가입
  const emailSignup = useSignUp(false, {
    onSuccess: () => {
      router.push("/login");
    },
    onError: (e: unknown) => {
      const msg = (e as { message?: string })?.message ?? "";
      if (/이메일/i.test(msg) || /email/i.test(msg)) {
        setError("email", { type: "server", message: msg || "이메일을 입력해 주세요" });
      } else if (/닉네임/i.test(msg) || /nickname/i.test(msg)) {
        setError("nickname", { type: "server", message: msg || "닉네임을 입력해 주세요" });
      } else if (/비밀번호/i.test(msg) || /password/i.test(msg)) {
        setError("password", {
          type: "server",
          message: msg || "비밀번호는 8자리 이상이어야 합니다.",
        });
      } else {
        setError("email", { type: "server", message: msg || "회원가입에 실패했습니다." });
      }
    },
  });

  //카카오 회원가입
  const kakaoSignup = useOAuthSignUp(false, {
    onSuccess: (res) => {
      if (res.accessToken || res.refreshToken) router.push("/");
      else router.push("/login");
    },
    onError: (e: unknown) => {
      const msg = (e as { message?: string })?.message ?? "";
      setError("nickname", { type: "server", message: msg || "간편회원가입에 실패했습니다." });
    },
  });

  const REQUIRED_LITERAL = "http://localhost:3000/oauth/kakao" as const;

  const ACTUAL_REDIRECT_URI =
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ??
    "https://global-nomad-henna.vercel.app/oauth/kakao/callback";

  if (ACTUAL_REDIRECT_URI !== REQUIRED_LITERAL && process.env.NODE_ENV !== "production") {
    console.warn("[KAKAO_REDIRECT_URI] 타입 리터럴과 ENV 값이 다릅니다:", ACTUAL_REDIRECT_URI);
  }

  const REDIRECT_URI_FOR_TYPE = ACTUAL_REDIRECT_URI as unknown as typeof REQUIRED_LITERAL;

  const onSubmit = async (values: FormValues) => {
    if (kakaoToken) {
      await kakaoSignup.mutateAsync({
        nickname: values.nickname.trim(),
        redirectUri: REDIRECT_URI_FOR_TYPE,
        token: kakaoToken,
      });
    } else {
      await emailSignup.mutateAsync({
        email: values.email.trim(),
        nickname: values.nickname.trim(),
        password: values.password,
      });
    }
  };

  const isPending = isSubmitting || emailSignup.isPending || kakaoSignup.isPending;

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
          isDisabled={!isValid || isPending}
          className="h-12 w-full text-lg"
        >
          {isPending ? "가입 중..." : "회원가입"}
        </Button>

        <div className="mx-auto mt-8 flex w-fit gap-3">
          <span className="text-brand-gray-900 text-lg whitespace-nowrap">회원이신가요?</span>
          <Link
            href="/login"
            className="text-brand-deep-green-500 text-lg underline decoration-solid"
          >
            로그인하기
          </Link>
        </div>

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
