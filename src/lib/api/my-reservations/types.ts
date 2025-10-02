import { z } from "zod";

import { ReservationStatusSchema } from "@/lib/api/activities/types";

// GET: 내 예약 리스트 조회 요청
export const GetMyReservationsRequestSchema = z.object({
  teamId: z.string(),
  cursorId: z.number().optional(),
  size: z.number().optional(),
  status: ReservationStatusSchema.optional(),
});
export type GetMyReservationsRequest = z.infer<typeof GetMyReservationsRequestSchema>;

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

export const GetMyReservationsResponseSchema = z.object({
  cursorId: z.number(),
  reservations: z.array(MyReservationSchema),
  totalCount: z.number(),
});
export type GetMyReservationsResponse = z.infer<typeof GetMyReservationsResponseSchema>;

// PATCH: 내 예약 수정 (취소) 요청
export const CancelMyReservationRequestSchema = z.object({
  teamId: z.string(),
  reservationId: z.number(),
  status: ReservationStatusSchema.extract(["canceled"]),
});
export type CancelMyReservationRequest = z.infer<typeof CancelMyReservationRequestSchema>;

// PATCH: 내 예약 수정 (취소) 응답
export const CancelMyReservationResponseSchema = z.object({
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
export type CancelMyReservationResponse = z.infer<typeof CancelMyReservationResponseSchema>;

// POST: 내 예약 리뷰 작성 요청
export const CreateMyReservationReviewRequestSchema = z.object({
  teamId: z.string(),
  reservationId: z.number(),
  rating: z.number(),
  content: z.string(),
});
export type CreateMyReservationReviewRequest = z.infer<
  typeof CreateMyReservationReviewRequestSchema
>;

// POST: 내 예약 리뷰 작성 응답
export const CreateMyReservationReviewResponseSchema = z.object({
  id: z.number(),
  teamId: z.string(),
  userId: z.number(),
  activityId: z.number(),
  rating: z.number(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type CreateMyReservationReviewResponse = z.infer<
  typeof CreateMyReservationReviewResponseSchema
>;
