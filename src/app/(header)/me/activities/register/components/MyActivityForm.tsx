"use client";

import { MutateOptions, UseMutateFunction } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DefaultValues, FieldValues, FormProvider, useForm } from "react-hook-form";

import DateField from "@/app/(header)/me/activities/register/components/DateField";
import {
  diffMainImages,
  diffSubImages,
} from "@/app/(header)/me/activities/register/components/DiffImage";
import ImageField from "@/app/(header)/me/activities/register/components/ImageField";
import InputField from "@/app/(header)/me/activities/register/components/InputField";
import { uploadFiles } from "@/app/(header)/me/activities/register/components/uploadFiles";
import Button from "@/components/ui/button/Button";
import { useUploadActivityImage } from "@/lib/api/activities/hooks";
import type { CreateActivityReq, ScheduleTime } from "@/lib/api/activities/types";
import type { UpdateActivityReq } from "@/lib/api/my-activities/types";

interface ActivityFormProps<TReq, TRes> {
  defaultValues?: DefaultValues<TReq>;
  isEdit?: boolean;
  apiActivity: UseMutateFunction<TRes, Error, TReq>;
  onAfterSubmit?: () => void;
}

export const subTitleClass = "block text-2xl font-bold mb-6";

function mapSchedulesToSlots(schedules: ScheduleTime[] = []) {
  const toDate = (date: string, hhmm: string) => {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = hhmm.split(":").map(Number);
    const dt = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
    if (hh === 24) dt.setDate(dt.getDate() + 1);
    return dt;
  };

  return schedules
    .map((s) => ({ start: toDate(s.date, s.startTime), end: toDate(s.date, s.endTime) }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

export default function MyActivityForm<TReq extends FieldValues, TRes>({
  defaultValues,
  isEdit = false,
  apiActivity,
  onAfterSubmit,
}: ActivityFormProps<TReq, TRes>) {
  const { mutateAsync: uploadImage } = useUploadActivityImage();

  const [bannerItems, setBannerItems] = useState<(File | string)[]>([]);
  const [subItems, setSubItems] = useState<(File | string)[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<{ start: Date; end: Date }[]>([]);

  const dv = (defaultValues ?? {}) as Partial<
    UpdateActivityReq &
      CreateActivityReq & {
        __initialScheduleRows?: { id: number; date: string; startTime: string; endTime: string }[];
      }
  >;

  const initialActivityId = (defaultValues as UpdateActivityReq)?.activityId ?? 0;
  const initialMainUrls = defaultValues?.bannerImageUrl ?? "";
  const initialSubUrls = defaultValues?.subImageUrls ?? [];
  const initialSubIds = defaultValues?.subImageIds ?? [];

  const propsMainImages = isEdit ? [initialMainUrls] : [];
  const propsSubImages = isEdit ? initialSubUrls : [];

  const methods = useForm<TReq>({
    mode: "all",
    defaultValues,
    delayError: 300,
  });
  const {
    handleSubmit,
    formState: { isValid, isSubmitting, isDirty },
  } = methods;

  useEffect(() => {
    if (!defaultValues) return;
    methods.reset(defaultValues);
    if (isEdit) {
      setBannerItems(initialMainUrls ? [initialMainUrls] : []);
      setSubItems(initialSubUrls ?? []);
    }

    const seed = (isEdit ? dv.schedulesToAdd : dv.schedules) as ScheduleTime[] | undefined;

    if (seed && seed.length > 0) {
      const filled = mapSchedulesToSlots(seed);
      setSlots(filled);
      setSelectedDate(filled[0]?.start ?? null);
    } else {
      setSlots([]);
      setSelectedDate(null);
    }
  }, [isEdit, defaultValues, methods, initialMainUrls, initialSubUrls]);

  const initialScheduleRows =
    (dv.__initialScheduleRows as
      | { id: number; date: string; startTime: string; endTime: string }[]
      | undefined) ?? [];

  const toKey = (date: string, start: string, end: string) => `${date}|${start}-${end}`;

  const onSubmit = async (data: TReq) => {
    const toDateStr = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const toHHMM = (d: Date) =>
      `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

    const schedules: ScheduleTime[] = slots.map((slot) => ({
      date: toDateStr(slot.start),
      startTime: toHHMM(slot.start),
      endTime: toHHMM(slot.end),
    }));

    if (isEdit) {
      const bannerImageUrl = await diffMainImages(initialMainUrls, bannerItems, uploadImage);
      const { subImageUrlsToAdd, subImageIdsToRemove } = await diffSubImages(
        initialSubUrls,
        initialSubIds,
        subItems,
        uploadImage,
      );

      const initialKeys = new Map(
        initialScheduleRows.map((r) => [toKey(r.date, r.startTime, r.endTime), r.id]),
      );
      const currentKeys = new Set(schedules.map((s) => toKey(s.date, s.startTime, s.endTime)));
      const scheduleIdsToRemove: number[] = [];
      for (const [k, id] of initialKeys.entries()) {
        if (!currentKeys.has(k)) scheduleIdsToRemove.push(id);
      }
      const filteredSchedulesToAdd = schedules.filter(
        (s) => !initialKeys.has(toKey(s.date, s.startTime, s.endTime)),
      );

      const payload: UpdateActivityReq = {
        ...(data as unknown as UpdateActivityReq),
        activityId: initialActivityId,
        ...(bannerImageUrl && { bannerImageUrl }),
        ...(subImageUrlsToAdd.length > 0 && { subImageUrlsToAdd }),
        ...(subImageIdsToRemove.length > 0 && { subImageIdsToRemove }),
        schedulesToAdd: filteredSchedulesToAdd,
        scheduleIdsToRemove,
      };

      const options: MutateOptions<TRes, Error, TReq> = {
        onSuccess: () => onAfterSubmit?.(),
      };

      apiActivity(payload as unknown as TReq, options);
    } else {
      const [bannerUrls, subUrls] = await Promise.all([
        uploadFiles(bannerItems, uploadImage),
        uploadFiles(subItems, uploadImage),
      ]);

      const payload: CreateActivityReq = {
        ...(data as unknown as CreateActivityReq),
        bannerImageUrl: bannerUrls[0],
        subImageUrls: subUrls,
        schedules,
      };

      const options: MutateOptions<TRes, Error, TReq> = {
        onSuccess: () => onAfterSubmit?.(),
      };

      apiActivity(payload as unknown as TReq, options);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-black">내 체험 {isEdit ? "수정" : "등록"}</h2>
              <Button
                type="submit"
                isDisabled={!isValid || isSubmitting || !isDirty}
                className="rounded-4 h-12 w-30 px-4 py-2 text-lg"
              >
                {isSubmitting
                  ? isEdit
                    ? "수정 중..."
                    : "등록 중..."
                  : isEdit
                    ? "수정하기"
                    : "등록하기"}
              </Button>
            </div>

            <InputField<TReq> />

            <DateField
              isEdit={isEdit}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              slots={slots}
              setSlots={setSlots}
            />

            <ImageField
              onMainChange={setBannerItems}
              onSubChange={setSubItems}
              initialMainImages={propsMainImages}
              initialSubImages={propsSubImages}
            />
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
