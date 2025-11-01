// hooks/useMyPendingDatesForActivity.ts
import { format } from "date-fns";
import { useMemo } from "react";

import { useMyReservations } from "@/lib/api/my-reservations/hooks";

export function useMyPendingDatesForActivity(activityId: number) {
  // 서버가 status 필터를 지원해도 실패 대비 전체를 불러와서 클라 필터링
  const { data } = useMyReservations({ size: 200 });
  console.log("useData:", data);
  const today = format(new Date(), "yyyy-MM-dd");

  const pendingDates = useMemo(() => {
    const list =
      data?.reservations
        ?.filter(
          (r) =>
            r?.activity?.id === activityId &&
            r?.status === "pending" &&
            typeof r?.date === "string" &&
            r.date >= today,
        )
        .map((r) => r.date) ?? [];
    return Array.from(new Set(list));
  }, [data?.reservations, activityId, today]);

  return { pendingDates };
}
