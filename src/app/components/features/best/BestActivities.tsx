"use client";

import BestACtivitiesList from "@/app/components/features/best/BestACtivitiesList";
import BestPagination from "@/app/components/features/best/BestPagination";
import { useActivities } from "@/lib/api/activities/hooks";
import { cn } from "@/lib/cn";
import { useDevice } from "@/lib/hooks/useDevice";

export default function BestActivities() {
  const { isPc, isTablet } = useDevice();

  const { data, isLoading } = useActivities(
    {
      method: isTablet ? "cursor" : "offset",
      sort: "most_reviewed",
      page: 1,
      size: 3,
    },
    true,
  );

  const activities = data?.activities ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <div>
      <div className="mt-[34px] mb-8 flex justify-between">
        <h2 className={cn("text-4xl font-bold", "mobile:text-2lg")}>🔥 인기 체험</h2>
        {isPc && <BestPagination totalCount={totalCount} />}
      </div>
      <BestACtivitiesList activities={activities} isLoading={isLoading} />
    </div>
  );
}
