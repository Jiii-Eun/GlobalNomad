"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";

import ActivityCardBase from "@/app/components/features/ActivityCardBase";
import ActivitiesPagination from "@/app/components/features/all/ActivitiesPagination";
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
    setSize(LENGTH);
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
        {isLoading
          ? Array.from({ length: LENGTH }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "shimmer rounded-[20px]",
                  "tablet:mb-[184px] mobile:mb-[130px] mb-[200px]",
                  listClass,
                )}
              />
            ))
          : activities?.map((item) => (
              <div key={item.id} className={cn("relative", listClass)}>
                <ActivityCardBase
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  bannerImageUrl={"/images/street-dance-banner.png"}
                  rating={item.rating}
                  reviewCount={item.reviewCount}
                />
              </div>
            ))}
        {!isLoading && activities?.length === 0 && (
          <p className="col-span-full py-10 text-center text-gray-500">검색 결과가 없습니다.</p>
        )}
      </div>

      <ActivitiesPagination size={LENGTH} />
    </div>
  );
}
