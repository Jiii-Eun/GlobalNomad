import { useApiMutation, ApiMutationOptions } from "@/lib/hooks/useApiMutation";
import { useFetchQuery, FetchQueryOptions } from "@/lib/hooks/useFetchQuery";

import { getMyReservations, cancelMyReservation, createMyReservationReview } from "./api";
import {
  GetMyReservationsRequest,
  GetMyReservationsResponse,
  CancelMyReservationRequest,
  CancelMyReservationResponse,
  CreateMyReservationReviewRequest,
  CreateMyReservationReviewResponse,
} from "./types";

/** GET: 내 예약 리스트 조회 */
export function useMyReservations(
  params: GetMyReservationsRequest,
  isMock = false,
  options?: FetchQueryOptions<GetMyReservationsResponse>,
) {
  return useFetchQuery<GetMyReservationsResponse>(
    ["myReservations", params],
    isMock ? undefined : () => getMyReservations(params),
    {
      mockData: isMock ? { cursorId: 0, totalCount: 1, reservations: [] } : undefined,
      ...options,
    },
  );
}

/** PATCH: 내 예약 취소 */
export function useCancelMyReservation(
  isMock = false,
  options?: ApiMutationOptions<CancelMyReservationResponse, CancelMyReservationRequest>,
) {
  return useApiMutation<CancelMyReservationResponse, CancelMyReservationRequest>(
    isMock ? undefined : (data) => cancelMyReservation(data),
    {
      mockResponse: isMock
        ? {
            id: 1,
            teamId: "mockTeam",
            userId: 1,
            activityId: 1,
            scheduleId: 1,
            status: "canceled",
            reviewSubmitted: false,
            totalPrice: 10000,
            headCount: 1,
            date: "2025-10-03",
            startTime: "09:00",
            endTime: "11:00",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : undefined,
      ...options,
    },
  );
}

/** POST: 내 예약 리뷰 작성 */
export function useCreateMyReservationReview(
  isMock = false,
  options?: ApiMutationOptions<CreateMyReservationReviewResponse, CreateMyReservationReviewRequest>,
) {
  return useApiMutation<CreateMyReservationReviewResponse, CreateMyReservationReviewRequest>(
    isMock ? undefined : (data) => createMyReservationReview(data),
    {
      mockResponse: isMock
        ? {
            id: 1,
            teamId: "mockTeam",
            userId: 1,
            activityId: 1,
            rating: 5,
            content: "Mock 리뷰",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : undefined,
      ...options,
    },
  );
}
