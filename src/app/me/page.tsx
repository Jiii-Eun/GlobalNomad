"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import Button from "@/components/ui/button/Button";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import { useEditMe, useGetMe } from "@/lib/api/users/hooks";

interface FormValues {
  nickname: string;
  email: string;
  password?: string;
  confirm?: string;
}

export default function Mypage() {
  const { data: me, isLoading: isMeLoading, refetch: refetchMe } = useGetMe(false);
  const pathname = usePathname();
  const selectedActivityId = pathname.match(/\/me\/activities\/([^/]+)/)?.[1] ?? "mock-activity-id"; // TODO: 실제 값으로 교체

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields, dirtyFields },
    control,
    trigger,
    getValues,
    reset,
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { nickname: "", email: "", password: "", confirm: "" },
  });

  useEffect(() => {
    if (me) {
      reset({
        nickname: me.nickname ?? "",
        email: me.email ?? "",
        password: "",
        confirm: "",
      });
    }
  }, [me, reset]);

  const pw = useWatch({ control, name: "password" });
  useEffect(() => {
    const hasPw = !!pw;
    const confirmPw = getValues("confirm");
    const confirmTouched = touchedFields.confirm || dirtyFields.confirm;
    if (hasPw && (confirmPw || confirmTouched)) {
      void trigger("confirm");
    }
  }, [pw, trigger, getValues, touchedFields.confirm, dirtyFields.confirm]);

  const editMe = useEditMe(false, {
    onSuccess: async () => {
      await refetchMe();
    },
    onError: (e) => {
      const msg = (e as { message?: string })?.message ?? "저장에 실패했습니다.";
      alert(msg);
    },
  });

  const onSubmit = async (v: FormValues) => {
    const payload: { nickname?: string; newPassword?: string } = {};
    const nickChanged =
      typeof v.nickname === "string" && v.nickname.trim() !== (me?.nickname ?? "").trim();

    if (nickChanged) payload.nickname = v.nickname.trim();

    const willChangePw = typeof v.password === "string" && v.password.length > 0;

    if (willChangePw) {
      if (v.password !== v.confirm) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }
      if (typeof v.password === "string" && v.password.length > 0) {
        payload.newPassword = v.password;
      }
    }

    if (!payload.nickname && !payload.newPassword) {
      alert("변경사항이 없습니다.");
      return;
    }

    await editMe.mutateAsync(payload);
    reset(
      { nickname: v.nickname, email: v.email, password: "", confirm: "" },
      { keepDirty: false, keepTouched: false },
    );
    alert("저장되었습니다.");
  };

  return (
    <main className="mx-auto mt-20 mb-[88px] flex w-full max-w-[1200px]">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-[792px] space-y-8">
        <div className="flex justify-between">
          <h1 className="text-brand-black text-3xl font-bold">내정보</h1>
          <Button
            type="submit"
            variant="b"
            isDisabled={!isValid || isSubmitting || isMeLoading}
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
          <Input id="email" type="email" placeholder="이메일" readOnly {...register("email")} />
        </Field>

        <Field id="password" label="비밀번호" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            placeholder="8자 이상 입력해 주세요."
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
            placeholder="비밀번호를 한번 더 입력해 주세요."
            aria-invalid={!!errors.confirm}
            {...register("confirm", {
              validate: (v) => {
                const p = getValues("password");
                if (!p && !v) return true;
                return v === p || "비밀번호가 일치하지 않습니다.";
              },
            })}
          />
        </Field>
      </form>
    </main>
  );
}
