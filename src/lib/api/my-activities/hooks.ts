import { useApiMutation, ApiMutationOptions } from "@/lib/hooks/useApiMutation";
import { useFetchQuery, FetchQueryOptions } from "@/lib/hooks/useFetchQuery";

import {
  getMyActivities,
  getReservationDashboard,
  getReservedSchedule,
  getReservations,
  updateReservationStatus,
  deleteMyActivity,
  updateMyActivity,
} from "./api";
import {
  GetMyActivitiesReq,
  GetMyActivitiesRes,
  GetDashboardRes,
  GetReservedScheduleReq,
  GetReservedScheduleRes,
  GetReservationsReq,
  GetReservationsRes,
  UpdateResvStatusReq,
  UpdateResvStatusRes,
  DeleteActivityReq,
  UpdateActivityReq,
  UpdateActivityRes,
} from "./types";

/** GET: 내 체험 리스트 조회 */
export function useMyActivities(
  params: GetMyActivitiesReq,
  isMock = false,
  options?: FetchQueryOptions<GetMyActivitiesRes>,
) {
  return useFetchQuery<GetMyActivitiesRes>(
    ["myActivities", params],
    isMock ? undefined : () => getMyActivities(params),
    {
      mockData: isMock ? { cursorId: 0, totalCount: 1, activities: [] } : undefined,
      ...options,
    },
  );
}

/** GET: 월별 예약 현황 */
export function useReservationDashboard(
  activityId: number,
  year: string,
  month: string,
  isMock = false,
  options?: FetchQueryOptions<GetDashboardRes>,
) {
  return useFetchQuery<GetDashboardRes>(
    ["reservationDashboard", activityId, year, month],
    isMock ? undefined : () => getReservationDashboard(activityId, year, month),
    {
      mockData: isMock
        ? [{ date: "2025-10-03", reservations: { confirmed: 1, pending: 0 } }]
        : undefined,
      ...options,
    },
  );
}

/** GET: 날짜별 예약 스케줄 */
export function useReservedSchedule(
  params: GetReservedScheduleReq,
  isMock = false,
  options?: FetchQueryOptions<GetReservedScheduleRes>,
) {
  return useFetchQuery<GetReservedScheduleRes>(
    ["reservedSchedule", params],
    isMock ? undefined : () => getReservedSchedule(params),
    {
      mockData: isMock
        ? [
            {
              scheduleId: 1,
              startTime: "09:00",
              endTime: "11:00",
              count: { confirmed: 1, pending: 0 },
            },
          ]
        : undefined,
      ...options,
    },
  );
}

/** GET: 예약 내역 조회 */
export function useReservations(
  params: GetReservationsReq,
  isMock = false,
  options?: FetchQueryOptions<GetReservationsRes>,
) {
  return useFetchQuery<GetReservationsRes>(
    ["reservations", params],
    isMock ? undefined : () => getReservations(params),
    {
      mockData: isMock ? { cursorId: 0, totalCount: 1, reservations: [] } : undefined,
      ...options,
    },
  );
}

/** PATCH: 예약 상태 변경 */
export function useUpdateReservationStatus(
  isMock = false,
  options?: ApiMutationOptions<UpdateResvStatusRes, UpdateResvStatusReq>,
) {
  return useApiMutation<UpdateResvStatusRes, UpdateResvStatusReq>(
    isMock ? undefined : (data) => updateReservationStatus(data),
    {
      mockResponse: isMock
        ? {
            id: 1,
            nickname: "MockUser",
            userId: 1,
            teamId: "mockTeam",
            activityId: 1,
            scheduleId: 1,
            status: "confirmed",
            reviewSubmitted: false,
            totalPrice: 10000,
            headCount: 2,
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

/** DELETE: 내 체험 삭제 */
export function useDeleteMyActivity(
  isMock = false,
  options?: ApiMutationOptions<null, DeleteActivityReq>,
) {
  return useApiMutation<null, DeleteActivityReq>(
    isMock ? undefined : (data) => deleteMyActivity(data),
    {
      mockResponse: isMock ? null : undefined,
      ...options,
    },
  );
}

/** PATCH: 내 체험 수정 */
export function useUpdateMyActivity(
  isMock = false,
  options?: ApiMutationOptions<UpdateActivityRes, UpdateActivityReq>,
) {
  return useApiMutation<UpdateActivityRes, UpdateActivityReq>(
    isMock ? undefined : (data) => updateMyActivity(data),
    {
      mockResponse: isMock
        ? {
            id: 1,
            userId: 1,
            title: "Mock 수정 체험",
            description: "Mock 수정 설명",
            category: "스포츠",
            price: 20000,
            address: "서울",
            bannerImageUrl: "/mock/edit.jpg",
            rating: 5,
            reviewCount: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            subImages: [],
            schedules: [],
          }
        : undefined,
      ...options,
    },
  );
}
