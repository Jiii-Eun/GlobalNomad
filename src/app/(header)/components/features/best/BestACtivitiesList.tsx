import ActivityCardBase from "@/app/(header)/components/features/ActivityCardBase";
import SkeletonList from "@/app/(header)/components/features/SkeletonList";
import type { Activity } from "@/lib/api/activities/types";
import { cn } from "@/lib/cn";

interface Props {
  activities: Activity[];
  isLoading?: boolean;
  targetRef?: (node?: Element | null) => void;
}

export default function BestActivitiesList({ activities, isLoading, targetRef }: Props) {
  const listClass = "w-full max-w-[384px] aspect-square mobile:min-w-[186px] min-w-[384px]";

  return (
    <div className="mobile:gap-4 tablet:overflow-x-scroll flex gap-6 py-4">
      {activities.map((activity, index) => {
        const isLast = index === activities.length - 1;
        return (
          <div
            key={activity.id}
            ref={isLast ? targetRef : undefined}
            className={cn("relative", listClass)}
          >
            <ActivityCardBase {...activity} variant="best" />
          </div>
        );
      })}

      {isLoading && <SkeletonList length={3} className={listClass} />}
    </div>
  );
}
