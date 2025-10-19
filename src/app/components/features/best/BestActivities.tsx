"use client";

import { useState, useMemo } from "react";

import BestActivitiesList from "@/app/components/features/best/BestACtivitiesList";
import BestPagination from "@/app/components/features/best/BestPagination";
import { getActivities } from "@/lib/api/activities/api";
import { useActivities } from "@/lib/api/activities/hooks";
import type { GetActivitiesReq, GetActivitiesRes } from "@/lib/api/activities/types";
import { cn } from "@/lib/cn";
import { useDevice } from "@/lib/hooks/useDevice";
import { useInfiniteScrollQuery } from "@/lib/hooks/useInfiniteScroll";
import { flattenPages } from "@/lib/utills/flattenPages";

export default function BestActivities() {
  const { isPc } = useDevice();
  const [page, setPage] = useState(1);

  const PC_SIZE = 3;
  const MOBILE_SIZE = 5;
  const size = isPc ? PC_SIZE : MOBILE_SIZE;

  const baseParams: GetActivitiesReq = useMemo(
    () => ({
      method: isPc ? "offset" : "cursor",
      sort: "most_reviewed",
      size,
      page: isPc ? page : undefined,
    }),
    [isPc, size, page],
  );

  const { data: offsetData, isLoading } = useActivities(baseParams);

  const { data: cursorData, targetRef } = useInfiniteScrollQuery<
    GetActivitiesRes,
    GetActivitiesReq
  >({
    queryKey: ["bestActivities", baseParams],
    fetchFn: getActivities,
    initialParams: baseParams,
    enabled: !isPc,
    size: MOBILE_SIZE,
  });

  const activities = isPc
    ? (offsetData?.activities ?? [])
    : flattenPages(cursorData, (page) => page.activities);

  const totalCount = offsetData?.totalCount ?? 0;

  return (
    <div>
      <div className="mt-[34px] mb-8 flex justify-between">
        <h2 className={cn("text-4xl font-bold", "mobile:text-2lg")}>🔥 인기 체험</h2>
        {isPc && <BestPagination totalCount={totalCount} page={page} setPage={setPage} />}
      </div>

      <BestActivitiesList
        activities={activities}
        isLoading={isLoading}
        targetRef={!isPc ? targetRef : undefined}
      />
    </div>
  );
}
