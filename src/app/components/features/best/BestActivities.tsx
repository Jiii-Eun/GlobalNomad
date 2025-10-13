"use client";

import { useState } from "react";

import BestACtivitiesList from "@/app/components/features/best/BestACtivitiesList";
import BestPagination from "@/app/components/features/best/BestPagination";
import { useActivities } from "@/lib/api/activities/hooks";
import { cn } from "@/lib/cn";
import { useDevice } from "@/lib/hooks/useDevice";

export default function BestActivities() {
  const { isPc, isTablet } = useDevice();

  const [page, setPage] = useState(1);

  const { data, isLoading } = useActivities({
    method: isTablet ? "cursor" : "offset",
    sort: "most_reviewed",
    page,
    size: 3,
  });

  const activities = data?.activities ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <div>
      <div className="mt-[34px] mb-8 flex justify-between">
        <h2 className={cn("text-4xl font-bold", "mobile:text-2lg")}>🔥 인기 체험</h2>
        {isPc && <BestPagination totalCount={totalCount} page={page} setPage={setPage} />}
      </div>
      <BestACtivitiesList activities={activities} isLoading={isLoading} />
    </div>
  );
}
