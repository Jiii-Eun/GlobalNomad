"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Arrow } from "@/components/icons";
import { ActivityImageUploader } from "@/components/ui/image-uploader";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import TimeSlotPicker from "@/components/ui/timeSlot/TimeSlotPicker";
import { getActivityDetail, uploadActivityImage } from "@/lib/api/activities/api";
import type { ActivityDetail, UploadImageRes } from "@/lib/api/activities/types";
import { ActivityCategory, ActivityCategorySchema } from "@/lib/api/activities/types";
import { useUpdateMyActivity } from "@/lib/api/my-activities/hooks";
import type { UpdateActivityReq } from "@/lib/api/my-activities/types";
import { formatKRW, parseKRW } from "@/lib/utills/currency";

interface FormValues {
  title: string;
  description: string;
  price: number;
  address: string;
  category: string;
}

const isActivityCategory = (v: unknown): v is ActivityCategory =>
  ActivityCategorySchema.safeParse(v).success;

function diffField<T>(orig: T, cur: T) {
  return Object.is(orig, cur) ? undefined : cur;
}

async function uploadOne(file: File) {
  const fd = new FormData();
  fd.append("image", file);
  const res: UploadImageRes = await uploadActivityImage(fd);
  return res.activityImageUrl;
}

async function diffBanner(originalUrl: string | undefined, current: (File | string)[]) {
  if (!current.length) return undefined;
  const curr0 = current[0];
  const currentUrl = typeof curr0 === "string" ? curr0 : await uploadOne(curr0);
  if (currentUrl === originalUrl) return undefined;
  return currentUrl;
}

function indexByUrl(subImages: { id: number; imageUrl: string }[]) {
  const map = new Map<string, number>();
  subImages.forEach((s) => map.set(s.imageUrl, s.id));
  return map;
}
async function diffSubImages(
  originalList: { id: number; imageUrl: string }[],
  current: (File | string)[],
) {
  const originalUrlToId = indexByUrl(originalList);

  const currentUrls = current.filter((it): it is string => typeof it === "string");

  const subImageIdsToRemove = originalList
    .filter((orig) => !currentUrls.includes(orig.imageUrl))
    .map((x) => x.id);

  const fileUrls = await Promise.all(
    current.filter((it): it is File => it instanceof File).map((f) => uploadOne(f)),
  );
  const newStringUrls = currentUrls.filter((url) => !originalUrlToId.has(url));

  const subImageUrlsToAdd = [...fileUrls, ...newStringUrls];

  return {
    subImageIdsToRemove: subImageIdsToRemove.length ? subImageIdsToRemove : undefined,
    subImageUrlsToAdd: subImageUrlsToAdd.length ? subImageUrlsToAdd : undefined,
  };
}

async function buildPatchPayload(
  original: ActivityDetail,
  data: FormValues,
  bannerImages: (File | string)[],
  introImages: (File | string)[],
  activityId: number,
): Promise<UpdateActivityReq> {
  const origCat = isActivityCategory(original.category) ? original.category : undefined;
  const curCat = isActivityCategory(data.category) ? data.category : undefined;

  const title = diffField(original.title, data.title);
  const description = diffField(original.description, data.description);
  const price = diffField(original.price, data.price);
  const address = diffField(original.address, data.address);
  const category = diffField<ActivityCategory | undefined>(origCat, curCat);

  const bannerImageUrl = await diffBanner(original.bannerImageUrl, bannerImages);

  const { subImageIdsToRemove, subImageUrlsToAdd } = await diffSubImages(
    original.subImages ?? [],
    introImages,
  );

  const payload: UpdateActivityReq = {
    activityId,
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(price !== undefined && { price }),
    ...(address !== undefined && { address }),
    ...(category !== undefined && { category }),
    ...(bannerImageUrl !== undefined && { bannerImageUrl }),
    ...(subImageIdsToRemove && { subImageIdsToRemove }),
    ...(subImageUrlsToAdd && { subImageUrlsToAdd }),
    // ...(scheduleIdsToRemove && { scheduleIdsToRemove }),
    // ...(schedulesToAdd && { schedulesToAdd }),
  };

  return payload;
}

export default function Edit() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: updateActivity, isPending: isUpdating } = useUpdateMyActivity();
  const params = useParams<{ id: string }>();
  const activityId = Number(params?.id);
  const [parentSelectedDate, setParentSelectedDate] = useState<Date | null>(null);
  const handleSelectedDateChange = (date: Date | null) => setParentSelectedDate(date);

  const [bannerImages, setBannerImages] = useState<(File | string)[]>([]);
  const [introImages, setIntroImages] = useState<(File | string)[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setError,
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      address: "",
      category: "",
    },
  });

  const [detail, setDetail] = useState<ActivityDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingDetail(true);
        if (!Number.isFinite(activityId)) throw new Error("잘못된 체험 ID입니다.");

        const res = await getActivityDetail(activityId);
        if (!mounted) return;

        setDetail(res);

        reset({
          title: res.title ?? "",
          description: res.description ?? "",
          price: Number.isFinite(res.price) ? res.price : 0,
          address: res.address ?? "",
          category: isActivityCategory(res.category) ? res.category : "",
        });

        setBannerImages(res.bannerImageUrl ? [res.bannerImageUrl] : []);
        setIntroImages(Array.isArray(res.subImages) ? res.subImages.map((s) => s.imageUrl) : []);
      } catch (e) {
        console.error(e);
        setDetailError("체험 정보를 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoadingDetail(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [activityId, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!detail) {
      alert("원본 데이터를 불러오지 못했습니다.");
      return;
    }

    try {
      const payload = await buildPatchPayload(detail, data, bannerImages, introImages, activityId);

      await updateActivity(payload);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-activities"] }),
        queryClient.invalidateQueries({ queryKey: ["activity-detail", payload.activityId] }),
      ]);

      router.replace("/me/activities");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "수정에 실패했습니다. 다시 시도해주세요.");
    }
  };
  return (
    <>
      <form
        id="edit-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <div className="flex w-[800px] justify-between text-3xl font-bold">
          내 체험 수정
          <button
            type="submit"
            form="edit-form"
            className="rounded-4 bg-brand-nomad-black text-brand-gray-100 h-12 w-30 px-4 py-2 text-lg"
          >
            수정하기
          </button>
        </div>
        <div className="flex flex-col gap-6">
          <Field id="title" className="h-[80px]">
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
          <Field id="category" className="h-[80px]">
            <Input
              as="select"
              id="category"
              required
              defaultValue=""
              className="rounded-4 invalid:text-brand-gray-500 appearance-none border border-gray-400 bg-white py-2 pr-[44px] pl-4"
              rightIcon={<Arrow.Down className="pointer-events-none h-6 w-6" />}
              aria-invalid={!!errors.category}
              placeholderOption="카테고리"
              options={[
                { value: "문화 · 예술", label: "문화 · 예술" },
                { value: "식음료", label: "식음료" },
                { value: "스포츠", label: "스포츠" },
                { value: "투어", label: "투어" },
                { value: "관광", label: "관광" },
                { value: "웰빙", label: "웰빙" },
              ]}
              {...register("category", {
                setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
                required: "카테고리를 선택해주세요.",
                validate: (v) => (v?.length ?? 0) > 0 || "카테고리를 선택해 주세요.",
              })}
            />
          </Field>
          <Field id="description">
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
                  const displayValue = formatKRW(field.value);
                  return (
                    <Input
                      id="price"
                      as="input"
                      type="text"
                      inputMode="numeric"
                      placeholder="가격"
                      className="rounded-4 border border-gray-400 bg-white px-4 py-2 font-normal"
                      aria-invalid={!!fieldState.error}
                      value={displayValue}
                      onChange={(e) => {
                        const next = parseKRW(e.target.value);
                        if (Number.isNaN(next)) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(next);
                        }
                      }}
                      onBlur={(e) => {
                        if (field.value === undefined || field.value === null) {
                          field.onChange(0);
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
          <Field id="address" label="주소" className="text-brand-black h-[80px] text-2xl font-bold">
            <Input
              id="address"
              type="text"
              placeholder="주소를 입력해주세요"
              className="rounded-4 border border-gray-400 bg-white px-4 py-2 font-normal"
              aria-invalid={!!errors.address}
              {...register("address", {
                setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
                required: "주소를 입력해주세요.",
                validate: (v) => (v?.length ?? 0) > 0 || "주소를 입력해 주세요.",
              })}
            />
          </Field>
        </div>
        <TimeSlotPicker
          selectDate={parentSelectedDate}
          onSelectedDateChange={handleSelectedDateChange}
        />
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold">배너 이미지</h2>
          <div className="flex">
            {!loadingDetail && (
              <ActivityImageUploader
                type="banner"
                initialImages={bannerImages.filter((v): v is string => typeof v === "string")}
                onChange={setBannerImages}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold">소개 이미지</h2>
          <div className="flex gap-6">
            {!loadingDetail && (
              <ActivityImageUploader
                type="sub"
                initialImages={introImages.filter((v): v is string => typeof v === "string")}
                onChange={setIntroImages}
              />
            )}
          </div>
          <span className="text-2lg text-brand-gray-800 pl-2">
            *이미지는 최대 4개까지 등록 가능합니다.
          </span>
        </div>
      </form>
    </>
  );
}
