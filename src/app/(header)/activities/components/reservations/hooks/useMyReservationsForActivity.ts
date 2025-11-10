import { useMemo } from "react";

import { useMyReservations } from "@/lib/api/my-reservations/hooks";
import type { MyReservation } from "@/lib/api/my-reservations/types";

/**
 * 특정 체험(activityId)에 대한 내 예약 내역을 필터링하는 훅
 * @param activityId 체험 ID
 */
export function useMyReservationsForActivity(activityId: number) {
  // 전체 예약 내역 조회 (필요에 따라 pagination param 추가 가능)
  const { data, isLoading, isError } = useMyReservations({ size: 50 }, false);

  // ✅ 해당 체험(activityId)만 필터링
  const activityReservations = useMemo(() => {
    if (!data?.reservations) return [];
    return data.reservations.filter((r: MyReservation) => r.activity.id === activityId);
  }, [data?.reservations, activityId]);

  // ✅ 총 인원수 및 총 금액 합계 계산
  const totalMembers = useMemo(
    () => activityReservations.reduce((sum, r) => sum + r.headCount, 0),
    [activityReservations],
  );

  const totalPrice = useMemo(
    () => activityReservations.reduce((sum, r) => sum + r.totalPrice, 0),
    [activityReservations],
  );

  return {
    reservations: activityReservations,
    totalMembers,
    totalPrice,
    isLoading,
    isError,
  };
}
