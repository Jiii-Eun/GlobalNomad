"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import MainLogo from "@/assets/brand/logo-big.svg";
import Button from "@/components/ui/button/Button";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";

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
      <Link href="/" aria-label="홈으로 이동" className="inline-block">
        <MainLogo
          className="mx-auto mb-14"
          role="img"
          aria-label="GlobalNomad"
          width={340}
          height={192}
        />
      </Link>
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
              validate: (v) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "이메일 형식이 올바르지 않습니다.",
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
          className="w-full text-lg"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </main>
  );
}
