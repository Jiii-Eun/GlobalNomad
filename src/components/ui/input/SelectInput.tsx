"use client";

import { useEffect, useRef, useState } from "react";

import { Status } from "@/components/icons";
import {
  INPUT_BASE,
  padIfLeftIcon,
  padIfRightIcon,
  type InputSelectProps,
  type SelectOption,
} from "@/components/ui/input/Input";
import { cn } from "@/lib/cn";
import useClickOutside from "@/lib/hooks/useClickOutside";

export default function SelectInput(props: InputSelectProps) {
  const {
    id,
    options,
    placeholderOption,
    wrapperClass,
    leftIcon,
    rightIcon,
    className,
    onChange,
    value,
    isInvalid,
    ref: _ref,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectOption | null>(null);

  const wrapperRef = useClickOutside(() => setIsOpen(false));

  useEffect(() => {
    if (value === undefined || value === null) {
      return;
    }
    const matched = options.find((opt) => String(opt.value) === String(value)) ?? null;
    setSelected(matched);
  }, [value, options]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    setSelected(option);
    setIsOpen(false);
    onChange?.({
      target: { value: option.value, name: id },
      currentTarget: { value: option.value, name: id },
    } as unknown as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div ref={wrapperRef} className={cn("relative", wrapperClass)}>
      <button
        id={id}
        type="button"
        onClick={handleToggle}
        className={cn(
          INPUT_BASE,
          "text-left",
          padIfLeftIcon(Boolean(leftIcon)),
          padIfRightIcon(Boolean(rightIcon)),
          className,
        )}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
        aria-invalid={isInvalid || undefined}
      >
        <span className={cn("inline-block", !selected && "text-brand-gray-500/60")}>
          {selected ? selected.label : placeholderOption}
        </span>
      </button>

      {rightIcon && (
        <span
          className={cn(
            "text-brand-gray-400 pointer-events-none absolute inset-y-0 right-3 flex items-center",
            "transform transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0",
          )}
        >
          {rightIcon}
        </span>
      )}

      {isOpen && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className={cn(
            "absolute z-10 mt-2 w-full rounded-[6px] bg-white",
            "shadow-[0_10px_30px_3px_rgba(5,16,55,0.15)]",
          )}
        >
          {options.map((option) => {
            const { disabled, value, label } = option;
            const isValue = selected?.value === value;

            return (
              <li
                key={String(value)}
                role="option"
                aria-selected={isValue}
                onClick={() => handleSelect(option)}
                className={cn(
                  "m-2 cursor-pointer rounded-[6px] p-2",
                  "flex items-center gap-2 text-lg font-normal",
                  disabled && "cursor-not-allowed opacity-50",
                  !isValue && "hover:bg-brand-deep-green-50",
                  isValue && "bg-brand-deep-green-500 text-white",
                )}
              >
                {isValue && <Status.CheckMark className="size-5" />}
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
