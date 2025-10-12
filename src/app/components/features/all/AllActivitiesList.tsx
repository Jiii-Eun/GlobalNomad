"use client";

import ActivityCardBase from "@/app/components/features/ActivityCardBase";
import { useActivityParams } from "@/app/components/useActivityParams";
import { useActivities } from "@/lib/api/activities/hooks";
import { cn } from "@/lib/cn";

export default function AllActivitiesList() {
  const params = useActivityParams();
  const { data, isLoading } = useActivities(params, true);

  const activities = data?.activities;

  const listClass = "w-full max-w-[384px] aspect-square";

  return (
    <div
      className={cn(
        "mobile:gap-4 grid gap-6 pb-2",
        "tablet:grid-cols-3 mobile:grid-cols-2 grid-cols-4",
      )}
    >
      {isLoading
        ? Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={cn("shimmer rounded-[20px]", listClass)} />
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
    </div>
  );
}
