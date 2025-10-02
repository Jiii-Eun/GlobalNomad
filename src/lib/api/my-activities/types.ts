import { z } from "zod";

import {
  ActivityCategorySchema,
  ActivitySchema,
  CreateActivityResponseSchema,
  ReservationStatusSchema,
  ScheduleTimeSchema,
} from "@/lib/api/activities/types";

// GET: 내 체험 리스트 조회 요청
export const GetMyActivitiesRequestSchema = z.object({
  teamId: z.string(),
  cursorId: z.number().optional(),
  size: z.number().optional(),
});
export type GetMyActivitiesRequest = z.infer<typeof GetMyActivitiesRequestSchema>;

// GET: 내 체험 리스트 조회 응답
export const GetMyActivitiesResponseSchema = z.object({
  cursorId: z.number(),
  totalCount: z.number(),
  activities: z.array(ActivitySchema),
});
export type GetMyActivitiesResponse = z.infer<typeof GetMyActivitiesResponseSchema>;

// GET: 월별 예약 현황 요청
export const GetReservationDashboardRequestSchema = z.object({
  teamId: z.string(),
  activityId: z.number(),
  year: z.string(),
  month: z.string(),
});
export type GetReservationDashboardRequest = z.infer<typeof GetReservationDashboardRequestSchema>;

// 월별 예약 현황 응답
export const ReservationStatusCountSchema = z.object({
  confirmed: z.number(),
  pending: z.number(),
  declined: z.number().optional(),
  completed: z.number().optional(),
});
export type ReservationStatusCount = z.infer<typeof ReservationStatusCountSchema>;

export const ReservationDashboardItemSchema = z.object({
  date: z.string(),
  reservations: ReservationStatusCountSchema,
});
export type ReservationDashboardItem = z.infer<typeof ReservationDashboardItemSchema>;

export const GetReservationDashboardResponseSchema = z.array(ReservationDashboardItemSchema);
export type GetReservationDashboardResponse = z.infer<typeof GetReservationDashboardResponseSchema>;

// GET: 날짜별 예약 스케줄 요청
export const GetReservedScheduleRequestSchema = z.object({
  teamId: z.string(),
  activityId: z.number(),
  date: z.string(),
});
export type GetReservedScheduleRequest = z.infer<typeof GetReservedScheduleRequestSchema>;

// 날짜별 예약 스케줄 응답
export const ReservedScheduleItemSchema = z.object({
  scheduleId: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  count: ReservationStatusCountSchema,
});
export type ReservedScheduleItem = z.infer<typeof ReservedScheduleItemSchema>;

export const GetReservedScheduleResponseSchema = z.array(ReservedScheduleItemSchema);
export type GetReservedScheduleResponse = z.infer<typeof GetReservedScheduleResponseSchema>;

// GET: 예약 내역 조회 요청
export const MyReservationStatusSchema = ReservationStatusSchema.extract([
  "pending",
  "confirmed",
  "declined",
]);
export type MyReservationStatus = z.infer<typeof MyReservationStatusSchema>;

export const GetReservationsRequestSchema = z.object({
  teamId: z.string(),
  activityId: z.number(),
  cursorId: z.number().optional(),
  size: z.number().optional(),
  scheduleId: z.number(),
  status: MyReservationStatusSchema,
});
export type GetReservationsRequest = z.infer<typeof GetReservationsRequestSchema>;

// GET: 예약 내역 조회 응답
export const ReservationSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  userId: z.number(),
  teamId: z.string(),
  activityId: z.number(),
  scheduleId: z.number(),
  status: MyReservationStatusSchema,
  reviewSubmitted: z.boolean(),
  totalPrice: z.number(),
  headCount: z.number(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Reservation = z.infer<typeof ReservationSchema>;

export const GetReservationsResponseSchema = z.object({
  cursorId: z.number(),
  totalCount: z.number(),
  reservations: z.array(ReservationSchema),
});
export type GetReservationsResponse = z.infer<typeof GetReservationsResponseSchema>;

// PATCH: 예약 상태 변경 요청
export const UpdateReservationStatusRequestSchema = z.object({
  teamId: z.string(),
  activityId: z.number(),
  reservationId: z.number(),
  status: ReservationStatusSchema,
});
export type UpdateReservationStatusRequest = z.infer<typeof UpdateReservationStatusRequestSchema>;

// PATCH: 예약 상태 변경 응답
export const UpdateReservationStatusResponseSchema = ReservationSchema;
export type UpdateReservationStatusResponse = z.infer<typeof UpdateReservationStatusResponseSchema>;

// DELETE: 내 체험 삭제 요청
export const DeleteMyActivityRequestSchema = z.object({
  teamId: z.string(),
  activityId: z.number(),
});
export type DeleteMyActivityRequest = z.infer<typeof DeleteMyActivityRequestSchema>;

// PATCH: 내 체험 수정 요청
export const UpdateActivityRequestSchema = z.object({
  teamId: z.string(),
  activityId: z.number(),
  title: z.string().optional(),
  category: ActivityCategorySchema.optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  address: z.string().optional(),
  bannerImageUrl: z.string().optional(),
  subImageIdsToRemove: z.array(z.number()).optional(),
  subImageUrlsToAdd: z.array(z.union([z.string(), z.instanceof(File)])).optional(),
  scheduleIdsToRemove: z.array(z.number()).optional(),
  schedulesToAdd: z.array(ScheduleTimeSchema).optional(),
});
export type UpdateActivityRequest = z.infer<typeof UpdateActivityRequestSchema>;

// PATCH: 내 체험 수정 응답
export const UpdateActivityResponseSchema = CreateActivityResponseSchema;
export type UpdateActivityResponse = z.infer<typeof UpdateActivityResponseSchema>;
