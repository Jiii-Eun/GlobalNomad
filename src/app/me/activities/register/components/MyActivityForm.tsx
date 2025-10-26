"use client";

import { MutateOptions, UseMutateFunction } from "@tanstack/react-query";
import { useState } from "react";
import {
  Controller,
  DefaultValues,
  FieldError,
  FieldValues,
  FormProvider,
  Path,
  useForm,
} from "react-hook-form";

import RegisterImageUpload from "@/app/me/activities/register/components/RegisterImageUpload";
import RegisterInput from "@/app/me/activities/register/components/RegisterInput";
import { uploadFiles } from "@/app/me/activities/register/components/uploadFiles";
import Button from "@/components/ui/button/Button";
import Field from "@/components/ui/input/Field";
import TimeSlotPicker from "@/components/ui/timeSlot/TimeSlotPicker";
import { useUploadActivityImage } from "@/lib/api/activities/hooks";
import type { CreateActivityReq, ScheduleTime } from "@/lib/api/activities/types";
import type { UpdateActivityReq } from "@/lib/api/my-activities/types";

interface ActivityFormProps<TReq, TRes> {
  defaultValues?: DefaultValues<TReq>;
  isEdit?: boolean;
  apiActivity: UseMutateFunction<TRes, Error, TReq>;
  onAfterSubmit?: () => void;
}

export default function MyActivityForm<TReq extends FieldValues, TRes>({
  defaultValues,
  isEdit = false,
  apiActivity,
  onAfterSubmit,
}: ActivityFormProps<TReq, TRes>) {
  const [bannerItems, setBannerItems] = useState<(File | string)[]>([]);
  const [subItems, setSubItems] = useState<(File | string)[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<{ start: Date; end: Date }[]>([]);
  const [errorStateFromUploader, setErrorStateFromUploader] = useState<string | null>(null);

  const { mutateAsync: uploadImage } = useUploadActivityImage();

  const methods = useForm<TReq>({
    mode: "all",
    defaultValues,
    delayError: 300,
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = methods;

  const onSubmit = async (data: TReq) => {
    const [bannerUrls, subUrls] = await Promise.all([
      uploadFiles(bannerItems, uploadImage),
      uploadFiles(subItems, uploadImage),
    ]);

    const schedules: ScheduleTime[] = slots.map((slot) => ({
      date: slot.start.toISOString().split("T")[0],
      startTime: slot.start.toTimeString().slice(0, 5),
      endTime: slot.end.toTimeString().slice(0, 5),
    }));

    const payload = isEdit
      ? ({
          ...(data as unknown as UpdateActivityReq),
          activityId: (defaultValues as UpdateActivityReq)?.activityId,
          bannerImageUrl: bannerUrls[0],
          subImageUrlsToAdd: subUrls,
          subImageIdsToRemove: [],
          schedulesToAdd: schedules,
          scheduleIdsToRemove: [],
        } as UpdateActivityReq)
      : ({
          ...(data as unknown as CreateActivityReq),
          bannerImageUrl: bannerUrls[0],
          subImageUrls: subUrls,
          schedules,
        } as CreateActivityReq);

    const options: MutateOptions<TRes, Error, TReq> = {
      onSuccess: () => onAfterSubmit?.(),
    };

    // 삭제해야한다
    console.log("payload,", payload);

    apiActivity(payload as unknown as TReq, options);
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
                  isDisabled={!isValid || isSubmitting || !!errorStateFromUploader}
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
              <Controller
                name={(isEdit ? "schedulesToAdd" : "schedules") as Path<TReq>}
                control={control}
                rules={{ required: "예약 가능한 시간을 선택해주세요." }}
                render={({ field }) => (
                  <Field
                    id="schedules"
                    label="예약 가능한 시간대"
                    error={
                      isEdit
                        ? (errors.schedulesToAdd as FieldError | undefined)?.message
                        : (errors.schedules as FieldError | undefined)?.message
                    }
                  >
                    <TimeSlotPicker
                      selectDate={selectedDate}
                      onSelectedDateChange={(date) => {
                        setSelectedDate(date);
                        field.onChange({ ...field.value, selectDate: date });
                      }}
                      slots={slots}
                      onSlotsChange={(newSlots) => {
                        setSlots(newSlots);
                        field.onChange({ ...field.value, slots: newSlots });
                      }}
                    />
                  </Field>
                )}
              />

              <RegisterImageUpload
                onMainChange={setBannerItems}
                onSubChange={setSubItems}
                onError={setErrorStateFromUploader}
              />
            </div>
          </form>
        </div>
      </main>
    </FormProvider>
  );
}
