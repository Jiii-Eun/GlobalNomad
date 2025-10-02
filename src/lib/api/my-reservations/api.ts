import { apiRequest } from "@/lib/apiRequest";
import { toQueryString } from "@/lib/utills/queryString";

import {
  GetMyReservationsRequest,
  GetMyReservationsResponse,
  GetMyReservationsResponseSchema,
  CancelMyReservationRequest,
  CancelMyReservationResponse,
  CancelMyReservationResponseSchema,
  CreateMyReservationReviewRequest,
  CreateMyReservationReviewResponse,
  CreateMyReservationReviewResponseSchema,
} from "./types";

// GET: 내 예약 리스트 조회
export function getMyReservations(params: GetMyReservationsRequest) {
  const query = toQueryString(params);
  return apiRequest<GetMyReservationsResponse>(`/my-reservations?${query}`, {
    schema: GetMyReservationsResponseSchema,
  });
}

// PATCH: 내 예약 취소
export function cancelMyReservation(data: CancelMyReservationRequest) {
  return apiRequest<CancelMyReservationResponse>(`/my-reservations/${data.reservationId}`, {
    method: "PATCH",
    data,
    schema: CancelMyReservationResponseSchema,
  });
}

// POST: 내 예약 리뷰 작성
export function createMyReservationReview(data: CreateMyReservationReviewRequest) {
  return apiRequest<CreateMyReservationReviewResponse>(
    `/my-reservations/${data.reservationId}/reviews`,
    { method: "POST", data, schema: CreateMyReservationReviewResponseSchema },
  );
}
