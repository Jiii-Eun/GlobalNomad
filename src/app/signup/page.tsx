"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import KaKaoLoginButton from "@/components/oauth/KaKaoAuthButton";
import Logo from "@/components/ui/brand/Logo";
import Button from "@/components/ui/button/Button";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import { useSignUp } from "@/lib/api/users/hooks";

interface FormValues {
  email: string;
  nickname: string;
  password: string;
  confirm: string;
}
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export default function Signup() {
  const router = useRouter();
  const sp = useSearchParams();
  const code = sp.get("code");
  const state = sp.get("state");
  const isKakaoSignup = !!code && (state === null || state === "signup");
  const redirectUri =
    (typeof window !== "undefined" ? window.location.origin : "") + "/oauth/signup/kakao";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields, dirtyFields },
    setError,
    control,
    trigger,
    getValues,
    watch,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { email: "", nickname: "", password: "", confirm: "" },
  });

  const pw = useWatch({ control, name: "password" });
  useEffect(() => {
    if (!isKakaoSignup) {
      const hasPw = !!pw;
      const confirmPw = getValues("confirm");
      const confirmTouched = touchedFields.confirm || dirtyFields.confirm;
      if (hasPw && (confirmPw || confirmTouched)) {
        void trigger("confirm");
      }
    }
  }, [isKakaoSignup, pw, trigger, getValues, touchedFields.confirm, dirtyFields.confirm]);

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

  const onSubmit = async (values: FormValues) => {
    if (isKakaoSignup && code) {
      try {
        const res = await fetch("/api/oauth/kakao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            state: "signup",
            redirectUri,
            nickname: values.nickname.trim(),
          }),
        });

        const txt = await res.text();
        let payload: unknown;
        try {
          payload = JSON.parse(txt);
        } catch {
          payload = { message: txt };
        }

        if (res.status === 409) {
          setError("nickname", { type: "server", message: "이미 사용중인 닉네임입니다." });
          return;
        }
        if (!res.ok) {
          const msg =
            isRecord(payload) && typeof payload.message === "string"
              ? payload.message
              : "간편회원가입에 실패했습니다.";
          setError("nickname", { type: "server", message: msg });
          return;
        }

        router.replace("/");
        return;
      } catch {
        setError("nickname", { type: "server", message: "간편회원가입에 실패했습니다." });
        return;
      }
    }

    await emailSignup.mutateAsync({
      email: values.email.trim(),
      nickname: values.nickname.trim(),
      password: values.password,
    });
  };

  const emailRules = isKakaoSignup
    ? {}
    : {
        setValueAs: (v: unknown) => (typeof v === "string" ? v.trim() : v),
        required: "이메일을 입력해 주세요.",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "이메일을 입력해 주세요.",
        },
      };

  const nicknameRules = {
    setValueAs: (v: unknown) => (typeof v === "string" ? v.trim() : v),
    required: "닉네임을 입력해주세요.",
    validate: (v: string) => (v?.length ?? 0) > 0 || "닉네임을 입력해 주세요.",
  } as const;

  const passwordRules = isKakaoSignup
    ? {}
    : {
        required: "비밀번호를 입력해 주세요.",
        minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." },
      };

  const confirmRules = isKakaoSignup
    ? {}
    : {
        required: "비밀번호를 다시 입력해 주세요.",
        validate: (v: string) => v === getValues("password") || "비밀번호가 일치하지 않습니다.",
      };

  // 카카오 가입 시에는 닉네임만 유효하면 버튼 활성화
  const nickname = watch("nickname");
  const isPending =
    isSubmitting || (isKakaoSignup ? !(nickname && nickname.trim().length > 0) : !isValid);
  const submitDisabled =
    isPending || (isKakaoSignup ? !(nickname && nickname.trim().length > 0) : !isValid);

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
            disabled={isKakaoSignup}
            {...register("email", emailRules)}
          />
        </Field>

        <Field id="nickname" label="닉네임" error={errors.nickname?.message}>
          <Input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력해 주세요."
            maxLength={10}
            aria-invalid={!!errors.nickname}
            {...register("nickname", nicknameRules)}
          />
        </Field>

        <Field id="password" label="비밀번호" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            aria-invalid={!!errors.password}
            disabled={isKakaoSignup}
            {...register("password", passwordRules)}
          />
        </Field>

        <Field id="confirm" label="비밀번호 확인" error={errors.confirm?.message}>
          <Input
            id="confirm"
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요."
            aria-invalid={!!errors.confirm}
            disabled={isKakaoSignup}
            {...register("confirm", confirmRules)}
          />
        </Field>

        <Button
          type="submit"
          variant="b"
          isDisabled={submitDisabled}
          className="h-12 w-full text-lg"
        >
          {isPending ? "가입 중..." : isKakaoSignup ? "카카오로 가입 완료" : "회원가입"}
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
      </form>
    </main>
  );
}
