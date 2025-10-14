"use client";

import { useState, useMemo } from "react";

import BestActivitiesList from "@/app/components/features/best/BestACtivitiesList";
import BestPagination from "@/app/components/features/best/BestPagination";
import { getActivities } from "@/lib/api/activities/api";
import { useActivities } from "@/lib/api/activities/hooks";
import type { Activity, GetActivitiesReq, GetActivitiesRes } from "@/lib/api/activities/types";
import { cn } from "@/lib/cn";
import { useDevice } from "@/lib/hooks/useDevice";
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";

export default function BestActivities() {
  const { isPc } = useDevice();
  const [page, setPage] = useState(1);

  const PC_Size = 3;
  const NOT_PC_Size = 5;
  const isSize = isPc ? PC_Size : NOT_PC_Size;

  const baseParams: GetActivitiesReq = useMemo(
    () => ({
      method: isPc ? "offset" : "cursor",
      sort: "most_reviewed",
      size: isSize,
      page: isPc ? page : undefined,
    }),
    [isPc, isSize, page],
  );

  const { data: infiniteData, targetRef } = useInfiniteScroll<
    GetActivitiesRes,
    GetActivitiesRes["activities"][0],
    GetActivitiesReq
  >({
    fetchFn: async (params) => {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== null),
      ) as GetActivitiesReq;
      return getActivities(cleanParams);
    },
    selectItems: (res) => res.activities,
    initialParams: baseParams,
    enabled: !isPc,
    size: NOT_PC_Size,
  });

  const { data: offsetData, isLoading } = useActivities(baseParams);

  const dedupedActivities = useMemo(() => {
    if (isPc) return offsetData?.activities ?? [];
    const map = new Map<number, Activity>();
    (infiniteData ?? []).forEach((a) => map.set(a.id, a));
    return Array.from(map.values());
  }, [isPc, offsetData, infiniteData]);

  const totalCount = offsetData?.totalCount ?? 0;

  return (
    <div>
      <div className="mt-[34px] mb-8 flex justify-between">
        <h2 className={cn("text-4xl font-bold", "mobile:text-2lg")}>🔥 인기 체험</h2>

        {isPc && <BestPagination totalCount={totalCount} page={page} setPage={setPage} />}
      </div>

      <BestActivitiesList
        activities={dedupedActivities}
        isLoading={isLoading}
        targetRef={!isPc ? targetRef : undefined}
      />
    </div>
  );
}
