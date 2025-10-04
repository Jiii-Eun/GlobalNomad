import { useApiMutation, ApiMutationOptions } from "@/lib/hooks/useApiMutation";
import { useFetchQuery, FetchQueryOptions } from "@/lib/hooks/useFetchQuery";

import { getMyReservations, cancelMyReservation, createMyReservationReview } from "./api";
import {
  GetMyResvsReq,
  GetMyResvsRes,
  CancelResvReq,
  CancelResvRes,
  CreateReviewReq,
  CreateReviewRes,
} from "./types";

//GET: 내 예약 리스트 조회
export function useMyReservations(
  params: GetMyResvsReq,
  isMock = false,
  options?: FetchQueryOptions<GetMyResvsRes>,
) {
  return useFetchQuery<GetMyResvsRes>(
    ["myReservations", params],
    isMock ? undefined : () => getMyReservations(params),
    {
      mockData: isMock
        ? {
            cursorId: 0,
            totalCount: 1,
            reservations: [
              {
                id: 1,
                teamId: "mockTeam",
                userId: 1,
                activity: {
                  id: 1,
                  title: "모의 체험",
                  bannerImageUrl: "/mock/activity.jpg",
                },
                scheduleId: 1,
                status: "pending",
                reviewSubmitted: false,
                totalPrice: 10000,
                headCount: 1,
                date: "2025-10-05",
                startTime: "14:00",
                endTime: "16:00",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          }
        : undefined,
      ...options,
    },
  );
}

//PATCH: 내 예약 취소
export function useCancelMyReservation(
  isMock = false,
  options?: ApiMutationOptions<CancelResvRes, CancelResvReq>,
) {
  return useApiMutation<CancelResvRes, CancelResvReq>(
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

//POST: 내 예약 리뷰 작성
export function useCreateMyReservationReview(
  isMock = false,
  options?: ApiMutationOptions<CreateReviewRes, CreateReviewReq>,
) {
  return useApiMutation<CreateReviewRes, CreateReviewReq>(
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
