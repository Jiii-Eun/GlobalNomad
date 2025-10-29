"use client";

import { Controller, FieldError, Path, useFormContext, FieldValues } from "react-hook-form";

import { subTitleClass } from "@/app/(header)/me/activities/register/components/MyActivityForm";
import Field from "@/components/ui/input/Field";
import TimeSlotPicker from "@/components/ui/timeSlot/TimeSlotPicker";

interface DateFieldProps<TReq extends FieldValues> {
  isEdit?: boolean;
  selectedDate: Date | null;
  slots: { start: Date; end: Date }[];
  setSelectedDate: (date: Date | null) => void;
  setSlots: (slots: { start: Date; end: Date }[]) => void;
}

export default function DateField<TReq extends FieldValues>({
  isEdit,
  selectedDate,
  setSelectedDate,
  slots,
  setSlots,
}: DateFieldProps<TReq>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TReq>();

  const fieldName = (isEdit ? "schedulesToAdd" : "schedules") as Path<TReq>;

  return (
    <div>
      <span className={subTitleClass}>예약 가능한 시간대</span>
      <Controller
        control={control}
        name={fieldName}
        rules={{ required: "예약 가능한 시간을 선택해주세요." }}
        render={({ field }) => (
          <Field id={fieldName} error={(errors[fieldName] as FieldError | undefined)?.message}>
            <TimeSlotPicker
              selectDate={selectedDate}
              onSelectedDateChange={(date) => {
                setSelectedDate(date);
                field.onChange({
                  date,
                  slots,
                });
              }}
              slots={slots}
              onSlotsChange={(newSlots) => {
                setSlots(newSlots);
                field.onChange({
                  date: selectedDate,
                  slots: newSlots,
                });
              }}
            />
          </Field>
        )}
      />
    </div>
  );
}
