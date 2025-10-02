import { ReservationStatus } from "@/lib/api/activities/types";

// GET: 내 예약 리스트 조회 요청
export interface GetMyReservationsRequest {
  teamId: string;
  cursorId?: number;
  size?: number; // 기본값 10
  status?: ReservationStatus;
}

// GET: 내 예약 리스트 조회 응답
export interface MyReservation {
  id: number;
  teamId: string;
  userId: number;
  activity: {
    id: number;
    title: string;
    bannerImageUrl: string;
  };
  scheduleId: number;
  status: ReservationStatus;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetMyReservationsResponse {
  cursorId: number;
  reservations: MyReservation[];
  totalCount: number;
}

// PATCH: 내 예약 수정 (취소) 요청
export interface CancelMyReservationRequest {
  teamId: string;
  reservationId: number;
  status: Extract<ReservationStatus, "canceled">;
}

// PATCH: 내 예약 수정 (취소) 응답
export interface CancelMyReservationResponse {
  id: number;
  teamId: string;
  userId: number;
  activityId: number;
  scheduleId: number;
  status: ReservationStatus;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

// POST: 내 예약 리뷰 작성 요청
export interface CreateMyReservationReviewRequest {
  teamId: string;
  reservationId: number;
  rating: number;
  content: string;
}

// POST: 내 예약 리뷰 작성 응답
export interface CreateMyReservationReviewResponse {
  id: number;
  teamId: string;
  userId: number;
  activityId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}
