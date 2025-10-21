// # 체험 등록 (/me/activities/register)
"use client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { ActivityImageUploader } from "@/components/ui/image-uploader";
import { useFileInput } from "@/components/ui/image-uploader/hooks/useFileInput";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import TimeSlotPicker from "@/components/ui/timeSlot/TimeSlotPicker";
import { createActivity, uploadActivityImage } from "@/lib/api/activities/api";
import type { CreateActivityReq, UploadImageRes } from "@/lib/api/activities/types";
import { formatKRW, parseKRW } from "@/lib/utills/currency";

import ProfileSidebar from "../../components/ProfileSidebar";

interface FormValues {
  title: string;
  description: string;
  price: number;
  address: string;
  category: string;
}
export default function Register() {
  const [parentSelectedDate, setParentSelectedDate] = useState<Date | null>(null);
  const handleSelectedDateChange = (date: Date | null) => setParentSelectedDate(date);

  // 🔵 업로드 컴포넌트에서 넘어오는 값 보관
  const [bannerItems, setBannerItems] = useState<(File | string)[]>([]);
  const [subItems, setSubItems] = useState<(File | string)[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields, dirtyFields },
    control,
    trigger,
    getValues,
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      price: undefined as unknown as number,
      address: "",
      category: "",
    },
  });

  type UploadImageResVariants =
    | { imageUrl: string }
    | { url: string }
    | { data: { imageUrl: string } }
    | { data: { url: string } };

  function hasProp<T extends object, K extends PropertyKey>(
    obj: T,
    key: K,
  ): obj is T & Record<K, unknown> {
    return obj != null && typeof obj === "object" && key in obj;
  }

  function extractUploadUrl(res: UploadImageRes & Partial<UploadImageResVariants>): string {
    if (hasProp(res, "imageUrl") && typeof res.imageUrl === "string") return res.imageUrl;
    if (hasProp(res, "url") && typeof res.url === "string") return res.url;
    if (hasProp(res, "data") && res.data && typeof res.data === "object") {
      const d = res.data as unknown as Partial<{ imageUrl: string; url: string }>;
      if (typeof d.imageUrl === "string") return d.imageUrl;
      if (typeof d.url === "string") return d.url;
    }
    throw new Error("업로드 응답 형식이 예상과 다릅니다.");
  }

  async function resolveToUrls(items: (File | string)[]) {
    const urls = await Promise.all(
      items.map(async (it) => {
        if (typeof it === "string") return it; // 이미 업로드된 URL
        const fd = new FormData();
        // 🔴 서버 필드명 확인: 보통 "file" 또는 "image"
        fd.append("file", it);
        const res = await uploadActivityImage(fd); // 타입: Promise<UploadImageRes>
        return extractUploadUrl(res);
      }),
    );
    return urls;
  }

  const onSubmit = async (data: FormValues) => {
    try {
      // 이미지 업로드(파일만) 후 URL 확보
      const [bannerUrls, subUrls] = await Promise.all([
        resolveToUrls(bannerItems),
        resolveToUrls(subItems),
      ]);

      const bannerImageUrl = bannerUrls[0] ?? null;
      // Replace with real submit logic (API call, navigation, etc.)
      // const priceNumber = Number(data.price.replaceAll(",", "").trim());
      if (typeof data.price !== "number" || !Number.isFinite(data.price)) {
        throw new Error("가격이 올바르지 않습니다.");
      }

      // 2) API 페이로드 구성
      // (CreateActivityReq의 실제 스키마에 맞춰 필드를 더 추가하세요.)
      const payload /*: CreateActivityReq*/ = {
        title: data.title,
        description: data.description,
        price: data.price,
        address: data.address,
        category: data.category, // 셀렉트 값이 있다면 여기에
        // 🔵 백엔드 스키마에 맞게 조정
        bannerImageUrl: bannerImageUrl ?? undefined,
        // backend expects an array of image URLs under `subImageUrls`
        subImageUrls: subUrls,
        schedules: [], // CreateActivityReq의 필수 항목이므로 기본값으로 빈 배열을 전달합니다.
      };

      console.log("Submitting activity:", data);

      // 4) 체험 등록 API 호출
      const res = await createActivity(payload);

      // 5) 성공 후 처리 (알림/이동 등)
      console.log("등록 성공:", res);
      alert("체험이 등록되었습니다!");
      // router.push(`/activities/${res.data.id}`) // 필요시 이동
    } catch (err: unknown) {
      // Narrow unknown to provide a useful message and avoid using `any`
      let message = "등록 중 오류가 발생했습니다.";
      if (err instanceof Error) {
        console.error("등록 실패:", err);
        message = err.message;
      } else {
        // Non-Error throwables (string, number, etc.)
        console.error("등록 실패:", err);
        try {
          message = String(err);
        } catch {
          // keep default message
        }
      }
      alert(message);
    }
  };
  return (
    <>
      <main className="bg-[#FAFAFA] py-18">
        <div className="mx-auto flex max-w-[1320px] gap-5">
          <ProfileSidebar selectedActivityId="" />
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
            <div className="flex w-[792px] flex-col gap-6">
              <div className="flex w-[800px] justify-between text-3xl font-bold">
                내 체험 등록
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-4 bg-brand-nomad-black text-brand-gray-100 h-12 w-30 px-4 py-2 text-lg"
                >
                  {isSubmitting ? "등록 중..." : "등록하기"}
                </button>
              </div>
              <div className="flex flex-col gap-6">
                <Field id="title" error={errors.title?.message} className="h-[80px]">
                  <Input
                    id="title"
                    type="text"
                    placeholder="제목"
                    className="rounded-4 border border-gray-400 bg-white px-4 py-2"
                    aria-invalid={!!errors.title}
                    {...register("title", {
                      setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
                      required: "제목을 입력해주세요.",
                      validate: (v) => (v?.length ?? 0) > 0 || "제목을 입력해 주세요.",
                    })}
                  />
                </Field>
                <Field id="category" error={errors.category?.message} className="h-[80px]">
                  <Input
                    as="select"
                    id="category"
                    required
                    defaultValue=""
                    className="rounded-4 invalid:text-brand-gray-500 border border-gray-400 bg-white px-4 py-2"
                    aria-invalid={!!errors.category}
                    placeholderOption="카테고리"
                    options={[
                      { value: "culture", label: "문화 체험" },
                      { value: "sports", label: "스포츠" },
                      { value: "music", label: "음악" },
                      { value: "cooking", label: "요리" },
                    ]}
                    // react-hook-form 연결
                    {...register("category", {
                      setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
                      required: "카테고리를 선택해주세요.",
                      validate: (v) => (v?.length ?? 0) > 0 || "카테고리를 선택해 주세요.",
                    })}
                  />
                </Field>
                <Field id="description" error={errors.description?.message}>
                  <Input
                    id="description"
                    as="textarea"
                    placeholder="설명"
                    className="rounded-4 border border-gray-400 bg-white px-4 py-2"
                    aria-invalid={!!errors.description}
                    {...register("description", {
                      setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
                      required: "설명을 입력해주세요.",
                      validate: (v) => (v?.length ?? 0) > 0 || "설명을 입력해 주세요.",
                    })}
                  />
                </Field>

                <div className="flex flex-col">
                  <Field
                    id="price"
                    label="가격"
                    error={errors.price?.message}
                    className="ext-brand-black h-[110px] text-2xl font-bold"
                  >
                    <Controller
                      name="price"
                      control={control}
                      rules={{
                        required: "가격을 입력해주세요.",
                        validate: (v) =>
                          (typeof v === "number" && Number.isFinite(v) && v >= 0) ||
                          "0원 이상 올바른 값을 입력해 주세요.",
                      }}
                      render={({ field, fieldState }) => {
                        const displayValue = formatKRW(field.value); // number → "1,234"
                        return (
                          <Input
                            id="price"
                            as="input"
                            type="text" // 표시용 text
                            inputMode="numeric" // 모바일 숫자 키패드
                            placeholder="가격"
                            className="rounded-4 border border-gray-400 bg-white px-4 py-2"
                            aria-invalid={!!fieldState.error}
                            value={displayValue}
                            onChange={(e) => {
                              const next = parseKRW(e.target.value);
                              if (Number.isNaN(next)) {
                                // 입력 전체를 지운 상태 — 화면엔 빈값 보이게 두고, 내부는 undefined로 잠시 유지
                                field.onChange(undefined);
                              } else {
                                field.onChange(next); // 내부 값은 number
                              }
                            }}
                            onBlur={(e) => {
                              // 빈값 허용 X → blur 시 자동 0으로 복구
                              if (field.value === undefined || field.value === null) {
                                field.onChange(0);
                                // 화면 표시도 즉시 "0"으로
                                e.currentTarget.value = "0";
                              }
                              field.onBlur();
                            }}
                          />
                        );
                      }}
                    />
                  </Field>
                </div>
                <div className="flex flex-col">
                  <Field
                    id="address"
                    label="주소"
                    error={errors.address?.message}
                    className="text-brand-black h-[80px] text-2xl font-bold"
                  >
                    <Input
                      id="address"
                      type="text"
                      placeholder="주소를 입력해주세요"
                      className="rounded-4 border border-gray-400 bg-white px-4 py-2"
                      aria-invalid={!!errors.address}
                      {...register("address", {
                        setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
                        required: "주소를 입력해주세요.",
                        validate: (v) => (v?.length ?? 0) > 0 || "주소를 입력해 주세요.",
                      })}
                    />
                  </Field>
                </div>
              </div>
              <div className="flex w-[800px] pt-4 text-2xl font-bold">예약 가능한 시간대</div>
              <TimeSlotPicker
                selectDate={parentSelectedDate}
                onSelectedDateChange={handleSelectedDateChange}
              />
              <div className="flex flex-col gap-6">
                <span className="text-2xl font-bold">배너 이미지</span>
                <ActivityImageUploader type="banner" />
              </div>
              <div className="flex flex-col gap-6">
                <span className="text-2xl font-bold">소개 이미지</span>
                <ActivityImageUploader type="sub" />
                <span className="text-2lg pl-2">*이미지는 최대 4개까지 등록 가능합니다.</span>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
