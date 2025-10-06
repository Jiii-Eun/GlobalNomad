import { apiRequest } from "@/lib/apiRequest";
import { toQueryString } from "@/lib/utills/queryString";

import {
  GetMyResvsReq,
  GetMyResvsRes,
  GetMyResvsResSchema,
  CancelResvReq,
  CancelResvRes,
  CancelResvResSchema,
  CreateReviewReq,
  CreateReviewRes,
  CreateReviewResSchema,
} from "./types";

// GET: 내 예약 리스트 조회
export function getMyReservations(params: GetMyResvsReq) {
  const query = toQueryString(params);
  return apiRequest<GetMyResvsRes>(`/my-reservations?${query}`, {
    schema: GetMyResvsResSchema,
  });
}

// PATCH: 내 예약 취소
export function cancelMyReservation(data: CancelResvReq) {
  return apiRequest<CancelResvRes>(`/my-reservations/${data.reservationId}`, {
    method: "PATCH",
    data,
    schema: CancelResvResSchema,
  });
}

// POST: 내 예약 리뷰 작성
export function createMyReservationReview(data: CreateReviewReq) {
  return apiRequest<CreateReviewRes>(`/my-reservations/${data.reservationId}/reviews`, {
    method: "POST",
    data,
    schema: CreateReviewResSchema,
  });
}
