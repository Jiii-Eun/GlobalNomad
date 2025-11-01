import { Controller, useFormContext, FieldError, Path, FieldValues } from "react-hook-form";

import { subTitleClass } from "@/app/(header)/me/activities/register/components/MyActivityForm";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import { cn } from "@/lib/cn";
import { formatKRW, parseKRW } from "@/lib/utills/currency";

export default function PriceField<TReq extends FieldValues>() {
  const {
    formState: { errors },
  } = useFormContext<TReq>();

  const fieldError = (errors.price as FieldError | undefined)?.message;
  const keyId = "price";

  return (
    <div>
      <span className={cn(subTitleClass, "mb-4")}>가격</span>
      <Field id={keyId} error={fieldError}>
        <Controller
          name={keyId as Path<TReq>}
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
                id={keyId}
                as="input"
                type="text"
                inputMode="numeric"
                placeholder="가격"
                className="rounded-4 border-brand-gray-400 border bg-white px-4 py-2"
                aria-invalid={!!fieldState.error}
                value={displayValue}
                maxLength={8}
                onChange={(e) => {
                  const next = parseKRW(e.target.value);
                  field.onChange(Number.isNaN(next) ? undefined : next);
                }}
                onBlur={(e) => {
                  if (field.value == null) {
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
  );
}
