"use client";

import { FieldError, FieldValues, Path, useFormContext } from "react-hook-form";

import AddressField from "@/app/(header)/me/activities/register/components/AddressField";
import PriceField from "@/app/(header)/me/activities/register/components/PriceField";
import FormField from "@/components/ui/input/FormField";
import { ActivityCategorySchema } from "@/lib/api/activities/types";

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormConfig<TReq extends FieldValues> {
  id: Path<TReq>;
  label?: string;
  as?: "input" | "select" | "textarea";
  placeholder?: string;
  options?: SelectOption[];
  required: string;
  maxLength?: number;
}

type FieldItem<TReq extends FieldValues> =
  | { type: "form"; config: FormConfig<TReq> }
  | { type: "custom"; element: React.ReactElement };

const CATEGORY_OPTIONS: SelectOption[] = ActivityCategorySchema.options.map(
  (category: (typeof ActivityCategorySchema)["options"][number]) => ({
    value: category,
    label: category,
  }),
);

export default function InputField<TReq extends FieldValues>() {
  const {
    register,
    formState: { errors },
  } = useFormContext<TReq>();

  const FIELD_STRUCTURE: readonly FieldItem<TReq>[] = [
    {
      type: "form",
      config: {
        id: "title" as Path<TReq>,
        as: "input",
        placeholder: "제목",
        required: "제목을 입력해주세요.",
        maxLength: 20,
      },
    },
    {
      type: "form",
      config: {
        id: "category" as Path<TReq>,
        as: "select",
        placeholder: "카테고리를 선택해주세요",
        options: CATEGORY_OPTIONS,
        required: "카테고리를 선택해주세요.",
      },
    },
    {
      type: "form",
      config: {
        id: "description" as Path<TReq>,
        as: "textarea",
        placeholder: "설명",
        required: "설명을 입력해주세요.",
        maxLength: 1800,
      },
    },
    { type: "custom", element: <PriceField key="price" /> },
    {
      type: "custom",
      element: <AddressField key="address" />,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      {FIELD_STRUCTURE.map((item) => {
        if (item.type === "custom") return item.element;

        const { id, label, as, placeholder, options, required, maxLength } = item.config;
        const fieldError: FieldError | undefined = errors[id]?.message
          ? (errors[id] as FieldError)
          : undefined;

        return (
          <FormField
            key={id}
            id={id}
            label={label}
            as={as ?? "input"}
            placeholder={placeholder}
            options={as === "select" ? (options ?? []) : []}
            error={fieldError}
            maxLength={maxLength}
            register={register(id, {
              setValueAs: (v: string) => v.trim(),
              required,
              validate: (v: string) => v.trim().length > 0 || required,
              ...(maxLength && {
                maxLength: {
                  value: maxLength,
                  message: `최대 ${maxLength}자까지 입력 가능합니다.`,
                },
              }),
            })}
          />
        );
      })}
    </div>
  );
}
