"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";

import ActivityCardBase from "@/app/components/features/ActivityCardBase";
import ActivitiesPagination from "@/app/components/features/all/ActivitiesPagination";
import SkeletonList from "@/app/components/features/SkeletonList";
import { useActivityParams } from "@/app/components/useActivityParams";
import { activitySizeAtom } from "@/lib/api/activities/atoms";
import { useActivities } from "@/lib/api/activities/hooks";
import { cn } from "@/lib/cn";
import { useDevice } from "@/lib/hooks/useDevice";

export default function AllActivitiesList() {
  const setSize = useSetAtom(activitySizeAtom);
  const { isTablet, isPc } = useDevice();

  const LENGTH = isPc ? 8 : isTablet ? 9 : 4;

  useEffect(() => {
    setSize((prev) => (prev !== LENGTH ? LENGTH : prev));
  }, [LENGTH, setSize]);

  const params = useActivityParams();
  const { data, isLoading } = useActivities(params);

  const activities = data?.activities;

  const listClass = "w-full max-w-[384px] aspect-square";

  return (
    <div>
      <div
        className={cn(
          "mobile:gap-4 grid gap-6 pb-2",
          "tablet:grid-cols-3 mobile:grid-cols-2 grid-cols-4",
        )}
      >
        {isLoading ? (
          <>
            <SkeletonList
              length={LENGTH}
              className={cn("tablet:mb-[184px] mobile:mb-[130px] mb-[200px]", listClass)}
            />
          </>
        ) : (
          activities?.map((item) => (
            <div key={item.id} className={cn("relative", listClass)}>
              <ActivityCardBase {...item} />
            </div>
          ))
        )}
        {!isLoading && activities?.length === 0 && (
          <p className="text-brand-gray-500 col-span-full py-10 text-center">
            진행중인 체험이 없습니다.
          </p>
        )}
      </div>

      <ActivitiesPagination size={LENGTH} data={data} />
    </div>
  );
}
