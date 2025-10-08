"use client";

import { ComponentPropsWithoutRef, Ref, useState } from "react";

type NativeInputProps = ComponentPropsWithoutRef<"input">;
type NativeSelectProps = ComponentPropsWithoutRef<"select">;

export interface BaseProps<TRef extends Element = Element> {
  id: string;
  isInvalid?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ref?: Ref<TRef>;
}

export interface InputTextProps extends Omit<NativeInputProps, "size" | "id">, BaseProps {
  as?: "input";
  type?: "text" | "email" | "password" | "number";
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
export interface InputSelectProps extends Omit<NativeSelectProps, "size" | "id">, BaseProps {
  as: "select";
  options: SelectOption[];
  placeholderOption?: string;
}

export type Props = InputTextProps | InputSelectProps;
function isSelectProps(p: Props): p is InputSelectProps {
  return (p as InputSelectProps).as === "select";
}

export default function Input(props: Props) {
  const [showPw, setShowPw] = useState(false);

  if (isSelectProps(props)) {
    const {
      id,
      isInvalid,
      className,
      leftIcon,
      rightIcon,
      options,
      placeholderOption,
      ref,
      as: _as,
      ...rest
    } = props;
    return (
      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            {leftIcon}
          </span>
        )}
        <select
          id={id}
          ref={ref as Ref<HTMLSelectElement>}
          className={className}
          aria-invalid={isInvalid || undefined}
          {...rest}
        >
          {placeholderOption && (
            <option value="" disabled hidden>
              {placeholderOption}
            </option>
          )}
          {options.map((op) => (
            <option key={String(op.value)} value={op.value} disabled={op.disabled}>
              {op.label}
            </option>
          ))}
        </select>
        {rightIcon && (
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }

  const {
    id,
    isInvalid,
    className,
    leftIcon,
    rightIcon,
    type,
    ref,
    as: _as,
    ...inputDomProps
  } = props as InputTextProps;

  const isPassword = (type ?? "text") === "password";
  const resolvedType = isPassword ? (showPw ? "text" : "password") : type;

  return (
    <div className="relative">
      {leftIcon}
      <input
        id={id}
        ref={ref as Ref<HTMLInputElement>}
        className={className}
        type={resolvedType}
        aria-invalid={isInvalid || undefined}
        {...inputDomProps}
      />
      {isPassword ? (
        <button
          type="button"
          onClick={() => setShowPw((v) => !v)}
          aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 표시"}
          className="absolute inset-y-0 right-2 flex items-center px-2 text-sm text-gray-500"
        >
          {showPw ? "숨기기" : "표시"}
        </button>
      ) : (
        rightIcon && (
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            {rightIcon}
          </span>
        )
      )}
    </div>
  );
}
