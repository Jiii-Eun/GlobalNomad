"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import Button from "@/components/ui/button/Button";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";

interface FormValues {
  nickname: string;
  email: string;
  password: string;
  confirm: string;
}

export default function Mypage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields, dirtyFields },
    control,
    trigger,
    getValues,
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { nickname: "", email: "", password: "", confirm: "" },
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

  const onSubmit = async () => {
    // 추후 api 연동
  };

  return (
    <main className="mx-auto mt-20 w-full max-w-[792px]">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
        <div className="flex justify-between">
          <h1>내정보</h1>
          <Button
            type="submit"
            variant="b"
            isDisabled={!isValid || isSubmitting}
            className="h-12 w-[120px] text-lg"
          >
            {isSubmitting ? "저장 중..." : "저장하기"}
          </Button>
        </div>

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
      </form>
    </main>
  );
}
