"use client";

import BestACtivitiesList from "@/app/components/features/best/BestACtivitiesList";
import BestPagination from "@/app/components/features/best/BestPagination";
import { cn } from "@/lib/cn";
import { useDevice } from "@/lib/hooks/useDevice";

export default function BestActivities() {
  const { isPc } = useDevice();

  return (
    <div>
      <div className="mt-[34px] mb-8 flex justify-between">
        <h2 className={cn("text-4xl font-bold", "mobile:text-2lg")}>🔥 인기 체험</h2>
        {isPc && <BestPagination />}
      </div>
      <BestACtivitiesList />
    </div>
  );
}
