import {
  Activity,
  ActivityCategory,
  CreateActivityResponse,
  ReservationStatus,
  ScheduleTime,
} from "@/lib/api/activities/types";

// GET: 내 체험 리스트 조회 요청
export interface GetMyActivitiesRequest {
  teamId: string;
  cursorId?: number;
  size?: number; // 기본값 20
}

// GET: 내 체험 리스트 조회 응답
export interface GetMyActivitiesResponse {
  cursorId: number;
  totalCount: number;
  activities: Activity[];
}

// GET: 월별 예약 현황 조회 요청
export interface GetReservationDashboardRequest {
  teamId: string;
  activityId: number;
  year: string;
  month: string;
}

// GET: 월별 예약 현황 조회 응답
export interface ReservationStatusCount {
  confirmed: number;
  pending: number;
  declined?: number;
  completed?: number;
}

export interface ReservationDashboardItem {
  date: string;
  reservations: ReservationStatusCount;
}

export type GetReservationDashboardResponse = ReservationDashboardItem[];

// GET: 날짜별 예약 스케줄 요청
export interface GetReservedScheduleRequest {
  teamId: string;
  activityId: number;
  date: string;
}

// GET: 날짜별 예약 스케줄 응답
export interface ReservedScheduleItem {
  scheduleId: number;
  startTime: string;
  endTime: string;
  count: ReservationStatusCount;
}

export type GetReservedScheduleResponse = ReservedScheduleItem[];

// GET: 예약 내역 조회 요청
export type MyReservationStatus = Extract<ReservationStatus, "pending" | "confirmed" | "declined">;
export interface GetReservationsRequest {
  teamId: string;
  activityId: number;
  cursorId?: number;
  size?: number; // 기본값 10
  scheduleId: number;
  status: MyReservationStatus;
}

// GET: 예약 내역 조회 응답
export interface Reservation {
  id: number;
  nickname: string;
  userId: number;
  teamId: string;
  activityId: number;
  scheduleId: number;
  status: MyReservationStatus;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetReservationsResponse {
  cursorId: number;
  totalCount: number;
  reservations: Reservation[];
}

// PATCH: 예약 상태 변경 요청
export interface UpdateReservationStatusRequest {
  teamId: string;
  activityId: number;
  reservationId: number;
  status: ReservationStatus;
}

// PATCH: 예약 상태 변경 응답
export type UpdateReservationStatusResponse = Reservation;

// DELETE: 내 체험 삭제 요청
export interface DeleteMyActivityRequest {
  teamId: string;
  activityId: number;
}

// PATCH: 내 체험 수정 요청
export interface UpdateActivityRequest {
  teamId: string;
  activityId: number;
  title?: string;
  category?: ActivityCategory;
  description?: string;
  price?: number;
  address?: string;
  bannerImageUrl?: string;
  subImageIdsToRemove?: number[];
  subImageUrlsToAdd?: (string | File)[];
  scheduleIdsToRemove?: number[];
  schedulesToAdd?: ScheduleTime[];
}

// PATCH: 내 체험 수정 응답
export type UpdateActivityResponse = CreateActivityResponse;
