import { z } from "zod";

import {
  ActivityCategorySchema,
  ActivitySchema,
  CreateActivityResSchema,
  ReservationStatusSchema,
  ScheduleTimeSchema,
} from "@/lib/api/activities/types";

// GET: 내 체험 리스트 조회 요청
export const GetMyActivitiesReqSchema = z.object({
  cursorId: z.number().optional(),
  size: z.number().optional(),
});
export type GetMyActivitiesReq = z.infer<typeof GetMyActivitiesReqSchema>;

// GET: 내 체험 리스트 조회 응답
export const GetMyActivitiesResSchema = z.object({
  cursorId: z.number().nullable(),
  totalCount: z.number(),
  activities: z.array(ActivitySchema),
});
export type GetMyActivitiesRes = z.infer<typeof GetMyActivitiesResSchema>;

// GET: 월별 예약 현황 요청
export const GetDashboardReqSchema = z.object({
  activityId: z.number(),
  year: z.string(),
  month: z.string(),
});
export type GetDashboardReq = z.infer<typeof GetDashboardReqSchema>;

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

export const GetDashboardResSchema = z.array(ReservationDashboardItemSchema);
export type GetDashboardRes = z.infer<typeof GetDashboardResSchema>;

// GET: 날짜별 예약 스케줄 요청
export const GetReservedScheduleReqSchema = z.object({
  activityId: z.number(),
  date: z.string(),
});
export type GetReservedScheduleReq = z.infer<typeof GetReservedScheduleReqSchema>;

// 날짜별 예약 스케줄 응답
export const ReservedScheduleItemSchema = z.object({
  scheduleId: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  count: ReservationStatusCountSchema,
});
export type ReservedScheduleItem = z.infer<typeof ReservedScheduleItemSchema>;

export const GetReservedScheduleResSchema = z.array(ReservedScheduleItemSchema);
export type GetReservedScheduleRes = z.infer<typeof GetReservedScheduleResSchema>;

// GET: 예약 내역 조회 요청
export const MyReservationStatusSchema = ReservationStatusSchema.extract([
  "pending",
  "confirmed",
  "declined",
]);
export type MyReservationStatus = z.infer<typeof MyReservationStatusSchema>;

export const GetReservationsReqSchema = z.object({
  activityId: z.number(),
  cursorId: z.number().optional(),
  size: z.number().optional(),
  scheduleId: z.number(),
  status: MyReservationStatusSchema,
});
export type GetReservationsReq = z.infer<typeof GetReservationsReqSchema>;

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

export const GetReservationsResSchema = z.object({
  cursorId: z.number().nullable(),
  totalCount: z.number(),
  reservations: z.array(ReservationSchema),
});
export type GetReservationsRes = z.infer<typeof GetReservationsResSchema>;

// PATCH: 예약 상태 변경 요청
export const UpdateResvStatusReqSchema = z.object({
  activityId: z.number(),
  reservationId: z.number(),
  status: ReservationStatusSchema,
});
export type UpdateResvStatusReq = z.infer<typeof UpdateResvStatusReqSchema>;

// PATCH: 예약 상태 변경 응답
export const UpdateResvStatusResSchema = z.object({
  id: z.number().optional(),
  activityId: z.number().optional(),
  scheduleId: z.number().optional(),
  status: MyReservationStatusSchema.optional(),
});
export type UpdateResvStatusRes = z.infer<typeof UpdateResvStatusResSchema>;

// DELETE: 내 체험 삭제 요청
export const DeleteActivityReqSchema = z.object({
  activityId: z.number(),
});
export type DeleteActivityReq = z.infer<typeof DeleteActivityReqSchema>;

// PATCH: 내 체험 수정 요청
export const UpdateActivityReqSchema = z.object({
  activityId: z.number(),
  title: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  address: z.string().optional(),
  bannerImageUrl: z.string().optional(),
  subImageIdsToRemove: z.array(z.number()).optional(),
  subImageUrlsToAdd: z.array(z.union([z.string(), z.instanceof(File)])).optional(),
  scheduleIdsToRemove: z.array(z.number()).optional(),
  schedulesToAdd: z.array(ScheduleTimeSchema).optional(),
});
export type UpdateActivityReq = z.infer<typeof UpdateActivityReqSchema>;

// PATCH: 내 체험 수정 응답
export const UpdateActivityResSchema = CreateActivityResSchema;
export type UpdateActivityRes = z.infer<typeof UpdateActivityResSchema>;
