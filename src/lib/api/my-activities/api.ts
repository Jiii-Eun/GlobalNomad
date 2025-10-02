import { apiRequest } from "@/lib/apiRequest";
import { toQueryString } from "@/lib/utills/queryString";

import {
  GetMyActivitiesRequest,
  GetMyActivitiesResponse,
  GetMyActivitiesResponseSchema,
  GetReservationDashboardResponse,
  GetReservationDashboardResponseSchema,
  GetReservedScheduleRequest,
  GetReservedScheduleResponse,
  GetReservedScheduleResponseSchema,
  GetReservationsRequest,
  GetReservationsResponse,
  GetReservationsResponseSchema,
  UpdateReservationStatusRequest,
  UpdateReservationStatusResponse,
  UpdateReservationStatusResponseSchema,
  DeleteMyActivityRequest,
  UpdateActivityRequest,
  UpdateActivityResponse,
  UpdateActivityResponseSchema,
} from "./types";

// GET: 내 체험 리스트 조회
export function getMyActivities(params: GetMyActivitiesRequest) {
  const query = toQueryString(params);
  return apiRequest<GetMyActivitiesResponse>(`/my-activities?${query}`, {
    schema: GetMyActivitiesResponseSchema,
  });
}

// GET: 월별 예약 현황
export function getReservationDashboard(activityId: number, year: string, month: string) {
  return apiRequest<GetReservationDashboardResponse>(
    `/my-activities/${activityId}/reservation-dashboard?year=${year}&month=${month}`,
    { schema: GetReservationDashboardResponseSchema },
  );
}

// GET: 날짜별 예약 스케줄
export function getReservedSchedule(params: GetReservedScheduleRequest) {
  const query = toQueryString(params);
  return apiRequest<GetReservedScheduleResponse>(
    `/my-activities/${params.activityId}/reserved-schedule?${query}`,
    { schema: GetReservedScheduleResponseSchema },
  );
}

// GET: 예약 내역 조회
export function getReservations(params: GetReservationsRequest) {
  const { activityId, ...rest } = params;
  const query = toQueryString(rest);
  return apiRequest<GetReservationsResponse>(`/my-activities/${activityId}/reservations?${query}`, {
    schema: GetReservationsResponseSchema,
  });
}

// PATCH: 예약 상태 변경
export function updateReservationStatus(data: UpdateReservationStatusRequest) {
  return apiRequest<UpdateReservationStatusResponse>(
    `/my-activities/${data.activityId}/reservations/${data.reservationId}`,
    { method: "PATCH", data, schema: UpdateReservationStatusResponseSchema },
  );
}

// DELETE: 내 체험 삭제
export function deleteMyActivity(data: DeleteMyActivityRequest) {
  return apiRequest<null>(`/my-activities/${data.activityId}`, {
    method: "DELETE",
  });
}

// PATCH: 내 체험 수정
export function updateMyActivity(data: UpdateActivityRequest) {
  return apiRequest<UpdateActivityResponse>(`/my-activities/${data.activityId}`, {
    method: "PATCH",
    data,
    schema: UpdateActivityResponseSchema,
  });
}
