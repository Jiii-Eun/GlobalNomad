import { apiRequest } from "@/lib/apiRequest";
import { toQueryString } from "@/lib/utills/queryString";

import {
  GetMyActivitiesReq,
  GetMyActivitiesRes,
  GetMyActivitiesResSchema,
  GetDashboardRes,
  GetDashboardResSchema,
  GetReservedScheduleReq,
  GetReservedScheduleRes,
  GetReservedScheduleResSchema,
  GetReservationsReq,
  GetReservationsRes,
  GetReservationsResSchema,
  UpdateResvStatusReq,
  UpdateResvStatusRes,
  UpdateResvStatusResSchema,
  DeleteActivityReq,
  UpdateActivityReq,
  UpdateActivityRes,
  UpdateActivityResSchema,
} from "./types";

// GET: 내 체험 리스트 조회
export function getMyActivities(params: GetMyActivitiesReq) {
  const query = toQueryString(params);
  return apiRequest<GetMyActivitiesRes>(`/my-activities?${query}`, {
    schema: GetMyActivitiesResSchema,
  });
}

// GET: 월별 예약 현황
export function getReservationDashboard(activityId: number, year: string, month: string) {
  return apiRequest<GetDashboardRes>(
    `/my-activities/${activityId}/reservation-dashboard?year=${year}&month=${month}`,
    { schema: GetDashboardResSchema },
  );
}

// GET: 날짜별 예약 스케줄
export function getReservedSchedule(params: GetReservedScheduleReq) {
  const query = toQueryString(params);
  return apiRequest<GetReservedScheduleRes>(
    `/my-activities/${params.activityId}/reserved-schedule?${query}`,
    { schema: GetReservedScheduleResSchema },
  );
}

// GET: 예약 내역 조회
export function getReservations(params: GetReservationsReq) {
  const { activityId, ...rest } = params;
  const query = toQueryString(rest);
  return apiRequest<GetReservationsRes>(`/my-activities/${activityId}/reservations?${query}`, {
    schema: GetReservationsResSchema,
  });
}

// PATCH: 예약 상태 변경
export function updateReservationStatus(data: UpdateResvStatusReq) {
  return apiRequest<unknown>(
    `/my-activities/${data.activityId}/reservations/${data.reservationId}`,
    {
      method: "PATCH",
      data,
    },
  );
}

// DELETE: 내 체험 삭제
export function deleteMyActivity(data: DeleteActivityReq) {
  return apiRequest<null>(`/my-activities/${data.activityId}`, {
    method: "DELETE",
  });
}

// PATCH: 내 체험 수정
export function updateMyActivity(data: UpdateActivityReq) {
  return apiRequest<UpdateActivityRes>(`/my-activities/${data.activityId}`, {
    method: "PATCH",
    data,
    schema: UpdateActivityResSchema,
  });
}
