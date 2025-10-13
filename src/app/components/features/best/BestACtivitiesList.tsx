"use client";

import ActivityCardBase from "@/app/components/features/ActivityCardBase";
import { Activity } from "@/lib/api/activities/types";
import { cn } from "@/lib/cn";

interface BestProps {
  activities: Activity[];
  isLoading: boolean;
}

export default function BestACtivitiesList({ activities, isLoading }: BestProps) {
  const listClass = "w-full max-w-[384px] aspect-square";

  return (
    <div className="no-scrollbar mobile:gap-4 flex gap-6 pb-2">
      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={cn("shimmer rounded-[20px]", listClass)} />
          ))
        : activities?.map((item) => (
            <div
              key={item.id}
              className={cn("mobile:min-w-[186px] relative min-w-[384px]", listClass)}
            >
              <ActivityCardBase
                id={item.id}
                title={item.title}
                price={item.price}
                bannerImageUrl={"/images/street-dance-banner.png"}
                rating={item.rating}
                reviewCount={item.reviewCount}
                variant="best"
              />
            </div>
          ))}
    </div>
  );
}
