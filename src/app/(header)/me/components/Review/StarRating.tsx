"use client";

import { KeyboardEvent, useMemo, useState } from "react";

import EmptyStar from "@/assets/icons/status/star-empty.svg";
import FilledStar from "@/assets/icons/status/star-fill.svg";

interface Props {
  value?: number;
  onChange?: (v: number) => void;
  max?: number;
  gap?: string;
}

export default function StarRating({ value = 0, onChange, max = 5 }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const nums = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max]);
  const current = hover ?? value ?? 0;

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onChange) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onChange(Math.min((value || 0) + 1, max));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onChange(Math.max((value || 0) - 1, 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange(1);
    } else if (e.key === "End") {
      e.preventDefault();
      onChange(max);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="별점"
      tabIndex={0}
      onKeyDown={handleKey}
      className="flex justify-center gap-2"
    >
      {nums.map((v) => {
        const active = v <= current;
        const checked = value === v;
        const Icon = active ? FilledStar : EmptyStar;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={checked}
            onMouseEnter={() => setHover(v)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(v)}
            onBlur={() => setHover(null)}
            onClick={() => onChange?.(v)}
            className="leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
          >
            <Icon style={{ width: 56, height: 56 }} />
            <span className="sr-only">{v}점</span>
          </button>
        );
      })}
    </div>
  );
}
