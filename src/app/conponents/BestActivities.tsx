"use client";

import { Arrow } from "@/components/icons";
import { cn } from "@/lib/cn";
import { useDevice } from "@/lib/hooks/useDevice";

export default function BestActivities() {
  const { isPc } = useDevice();

  return (
    <div className="mt-[34px] flex justify-between">
      <h2 className={cn("text-4xl font-bold", "mobile:text-2lg")}>🔥 인기 체험</h2>
      {isPc && (
        <div className="flex">
          <Arrow.Left className="size-11" />
          <Arrow.Right className="size-11" />
        </div>
      )}
    </div>
  );
}
