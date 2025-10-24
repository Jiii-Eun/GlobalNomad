"use client";
import { MutateOptions, UseMutateFunction } from "@tanstack/react-query";
import { useState } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

import RegisterImageUpload from "@/app/me/activities/register/components/RegisterImageUpload";
import RegisterInput from "@/app/me/activities/register/components/RegisterInput";
import toFormData from "@/app/me/activities/register/components/toFormData";
import Button from "@/components/ui/button/Button";
import TimeSlotPicker from "@/components/ui/timeSlot/TimeSlotPicker";
import { useUploadActivityImage } from "@/lib/api/activities/hooks";
import type { CreateActivityReq } from "@/lib/api/activities/types";
import type { UpdateActivityReq } from "@/lib/api/my-activities/types";

interface ActivityFormProps<TReq, TRes> {
  defaultValues?: DefaultValues<TReq>;
  isEdit?: boolean;
  apiActivity: UseMutateFunction<TRes, Error, TReq>;
  onAfterSubmit?: () => void;
}

export default function MyActivityForm<TReq extends object, TRes>({
  defaultValues,
  isEdit = false,
  apiActivity,
  onAfterSubmit,
}: ActivityFormProps<TReq, TRes>) {
  const [bannerItems, setBannerItems] = useState<File[]>([]);
  const [subItems, setSubItems] = useState<File[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<{ start: Date; end: Date }[]>([]);

  const { mutateAsync: uploadImage } = useUploadActivityImage();

  const methods = useForm<TReq>({
    mode: "onBlur",
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit = async (data: TReq) => {
    const [bannerUrls, subUrls] = await Promise.all([
      Promise.all(bannerItems.map((file) => uploadImage(toFormData(file)))),
      Promise.all(subItems.map((file) => uploadImage(toFormData(file)))),
    ]);

    const schedules = slots.map((slot) => {
      const date = slot.start.toISOString().split("T")[0];
      const startTime = `${String(slot.start.getHours()).padStart(2, "0")}:${String(
        slot.start.getMinutes(),
      ).padStart(2, "0")}`;
      const endTime = `${String(slot.end.getHours()).padStart(2, "0")}:${String(
        slot.end.getMinutes(),
      ).padStart(2, "0")}`;
      return { date, startTime, endTime };
    });

    const payload: TReq = isEdit
      ? ({
          ...(data as UpdateActivityReq),
          activityId: (defaultValues as UpdateActivityReq)?.activityId ?? 0,
          bannerImageUrl: bannerUrls[0]?.activityImageUrl ?? "",
          subImageUrlsToAdd: subUrls.map((r) => r.activityImageUrl),
          subImageIdsToRemove: [],
          schedulesToAdd: schedules,
          scheduleIdsToRemove: [],
        } as TReq)
      : ({
          ...(data as CreateActivityReq),
          bannerImageUrl: bannerUrls[0]?.activityImageUrl ?? "",
          subImageUrls: subUrls.map((r) => r.activityImageUrl),
          schedules,
        } as TReq);

    const options: MutateOptions<TRes, Error, TReq> = {
      onSuccess: () => onAfterSubmit?.(),
    };

    apiActivity(payload, options);
  };

  return (
    <FormProvider {...methods}>
      <main className="bg-brand-gray-100 py-18">
        <div className="mx-auto flex max-w-[1320px] gap-5">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
            <div className="w-[792px] gap-6">
              <div className="flex w-[800px] justify-between text-3xl font-bold">
                내 체험 {isEdit ? "수정" : "등록"}
                <Button
                  type="submit"
                  isDisabled={!isValid || isSubmitting}
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

              <RegisterInput<TReq> />

              <div className="flex w-[800px] pt-4 text-2xl font-bold">예약 가능한 시간대</div>
              <TimeSlotPicker
                selectDate={selectedDate}
                onSelectedDateChange={setSelectedDate}
                slots={slots}
                onSlotsChange={setSlots}
              />

              <RegisterImageUpload onMainChange={setBannerItems} onSubChange={setSubItems} />
            </div>
          </form>
        </div>
      </main>
    </FormProvider>
  );
}
