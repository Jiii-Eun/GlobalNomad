"use client";

import { cloneElement, isValidElement, ReactElement } from "react";

const cn = (...xs: (string | false | null | undefined)[]) =>
  xs.filter((v): v is string => Boolean(v)).join(" ");

const invalidField = "is-error";

interface FieldChildProps {
  id?: string;
  className?: string;
  isInvalid?: boolean;
  "aria-describedby"?: string;
}
interface FieldProps {
  id: string;
  label?: string;
  error?: string;
  className?: string;
  children: ReactElement<FieldChildProps>;
}

export default function Field({ id, label, error, className, children }: FieldProps) {
  if (!isValidElement(children)) return null;

  const isInvalid = Boolean(error);
  const errorId = `${id}-error`;

  const child = cloneElement(children, {
    id,
    isInvalid,
    "aria-describedby": isInvalid ? errorId : children.props["aria-describedby"],
    className: cn(isInvalid && invalidField, children.props.className),
  });

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="text-brand-black mb-2 block text-lg">
          {label}
        </label>
      )}
      {child}
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="text-brand-red-500 mt-2 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
