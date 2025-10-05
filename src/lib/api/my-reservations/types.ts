import { z } from "zod";

import { ReservationStatusSchema } from "@/lib/api/activities/types";

// GET: 내 예약 리스트 조회 요청
export const GetMyResvsReqSchema = z.object({
  teamId: z.string(),
  cursorId: z.number().optional(),
  size: z.number().optional(),
  status: ReservationStatusSchema.optional(),
});
export type GetMyResvsReq = z.infer<typeof GetMyResvsReqSchema>;

// GET: 내 예약 리스트 조회 응답
export const MyReservationSchema = z.object({
  id: z.number(),
  teamId: z.string(),
  userId: z.number(),
  activity: z.object({
    id: z.number(),
    title: z.string(),
    bannerImageUrl: z.string(),
  }),
  scheduleId: z.number(),
  status: ReservationStatusSchema,
  reviewSubmitted: z.boolean(),
  totalPrice: z.number(),
  headCount: z.number(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type MyReservation = z.infer<typeof MyReservationSchema>;

export const GetMyResvsResSchema = z.object({
  cursorId: z.number(),
  reservations: z.array(MyReservationSchema),
  totalCount: z.number(),
});
export type GetMyResvsRes = z.infer<typeof GetMyResvsResSchema>;

// PATCH: 내 예약 수정 (취소) 요청
export const CancelResvReqSchema = z.object({
  teamId: z.string(),
  reservationId: z.number(),
  status: ReservationStatusSchema.extract(["canceled"]),
});
export type CancelResvReq = z.infer<typeof CancelResvReqSchema>;

// PATCH: 내 예약 수정 (취소) 응답
export const CancelResvResSchema = z.object({
  id: z.number(),
  teamId: z.string(),
  userId: z.number(),
  activityId: z.number(),
  scheduleId: z.number(),
  status: ReservationStatusSchema,
  reviewSubmitted: z.boolean(),
  totalPrice: z.number(),
  headCount: z.number(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type CancelResvRes = z.infer<typeof CancelResvResSchema>;

// POST: 내 예약 리뷰 작성 요청
export const CreateReviewReqSchema = z.object({
  teamId: z.string(),
  reservationId: z.number(),
  rating: z.number(),
  content: z.string(),
});
export type CreateReviewReq = z.infer<typeof CreateReviewReqSchema>;

// POST: 내 예약 리뷰 작성 응답
export const CreateReviewResSchema = z.object({
  id: z.number(),
  teamId: z.string(),
  userId: z.number(),
  activityId: z.number(),
  rating: z.number(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type CreateReviewRes = z.infer<typeof CreateReviewResSchema>;
