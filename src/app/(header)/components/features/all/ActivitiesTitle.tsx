"use client";

import { useAtomValue } from "jotai";

import { activityCategoryAtom } from "@/lib/api/activities/atoms";
import { cn } from "@/lib/cn";

export default function ActivitiesTitle() {
  const categoryIcons: Record<string, string> = {
    관광: "🏯",
    "문화 · 예술": "🎪",
    식음료: "🍱",
    스포츠: "🏃",
    투어: "🚍",
    웰빙: "🌿",
  };

  const category = useAtomValue(activityCategoryAtom);

  const icon = category && categoryIcons[category];

  const title = category ? `${icon} ${category}` : `🛼 모든 체험`;

  return (
    <div className="mt-[35px] mb-8">
      <h2 className={cn("text-4xl font-bold", "mobile:text-2lg")}>{title}</h2>
    </div>
  );
}
