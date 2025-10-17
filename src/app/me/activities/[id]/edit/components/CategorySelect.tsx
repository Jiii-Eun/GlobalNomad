"use client";

import { useState, useMemo } from "react";

import { Arrow } from "@/components/icons";
import DropDown from "@/components/ui/DropDown/Dropdown";
import { cn } from "@/lib/cn";

const CATEGORIES = [
  { value: "", label: "카테고리" },
  { value: "culture", label: "문화 예술" },
  { value: "sports", label: "스포츠" },
  { value: "food", label: "삭음료" },
  { value: "tour", label: "투어" },
  { value: "travel", label: "관광" },
  { value: "wellbeing", label: "웰빙" },
];

interface CategorySelectProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (next: string) => void;
  menuPositionClassName?: string;
}

export default function CategorySelect({
  name = "category",
  value,
  defaultValue = "",
  onChange,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [innerValue, setInnerValue] = useState(defaultValue);

  const current = value ?? innerValue;

  const currentLabel = useMemo(
    () => CATEGORIES.find((c) => c.value === current)?.label ?? "카테고리",
    [current],
  );

  const select = (next: string) => {
    if (onChange) onChange(next);
    else setInnerValue(next);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <DropDown handleClose={() => setOpen(false)}>
        <DropDown.Trigger onClick={() => setOpen((o) => !o)} className="block w-full text-left">
          <div
            aria-haspopup="listbox"
            aria-expanded={open}
            className={cn(
              "rounded-4 border border-gray-400 bg-white px-4 py-2",
              "flex w-full items-center justify-between gap-2",
            )}
          >
            <span
              className={cn("block truncate", current ? "text-gray-900" : "text-brand-gray-500")}
            >
              {currentLabel}
            </span>
            <Arrow.Down className="h-4 w-4" />
          </div>
        </DropDown.Trigger>

        <DropDown.Menu isOpen={open} position="right-4 top-full mt-1">
          {CATEGORIES.filter((c) => c.value !== "").map((c) => (
            <DropDown.Item key={c.value} onClick={() => select(c.value)}>
              {c.label}
            </DropDown.Item>
          ))}
        </DropDown.Menu>
        <input type="hidden" name={name} value={current} />
      </DropDown>
    </div>
  );
}
