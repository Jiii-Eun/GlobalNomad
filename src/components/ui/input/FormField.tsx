"use client";

import { FieldError, useFormContext, UseFormRegisterReturn, useWatch } from "react-hook-form";

import Field from "@/components/ui/input/Field";
import Input, { Props as InputProps } from "@/components/ui/input/Input";

interface FormFieldBase {
  id: string;
  label?: string;
  labelNode?: React.ReactNode;
  error?: FieldError;
  register?: UseFormRegisterReturn;
  className?: string;
}

export type FormFieldProps = FormFieldBase & InputProps;

export default function FormField({
  id,
  label,
  labelNode,
  error,
  register,
  className,
  ...inputProps
}: FormFieldProps) {
  const { control } = useFormContext();
  const value = useWatch({ control, name: id });

  return (
    <Field id={id} label={label} labelNode={labelNode} error={error?.message} className={className}>
      <Input id={id} {...inputProps} isInvalid={!!error} value={value} {...register} />
    </Field>
  );
}
