import { z } from "zod";

// GET: 체험 리스트 조회 요청
export const ActivityCategorySchema = z.enum([
  "문화 · 예술",
  "식음료",
  "스포츠",
  "투어",
  "관광",
  "웰빙",
]);
export type ActivityCategory = z.infer<typeof ActivityCategorySchema>;

export const ActivitySortSchema = z.enum(["most_reviewed", "price_asc", "price_desc", "latest"]);
export type ActivitySort = z.infer<typeof ActivitySortSchema>;

export const GetActivitiesReqSchema = z.object({
  method: z.enum(["offset", "cursor"]),
  cursorId: z.number().optional(),
  category: ActivityCategorySchema.optional(),
  keyword: z.string().optional(),
  sort: ActivitySortSchema.optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});
export type GetActivitiesReq = z.infer<typeof GetActivitiesReqSchema>;

// GET: 체험 리스트 조회
export const ActivitySchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  address: z.string(),
  bannerImageUrl: z.string(),
  rating: z.number(),
  reviewCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Activity = z.infer<typeof ActivitySchema>;

export const GetActivitiesResSchema = z.object({
  cursorId: z.number(),
  totalCount: z.number(),
  activities: z.array(ActivitySchema),
});
export type GetActivitiesRes = z.infer<typeof GetActivitiesResSchema>;

// POST: 체험 등록
export const ScheduleTimeSchema = z.object({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});
export type ScheduleTime = z.infer<typeof ScheduleTimeSchema>;

export const CreateActivityReqSchema = z.object({
  title: z.string(),
  category: z.string(),
  description: z.string(),
  address: z.string(),
  price: z.number(),
  bannerImageUrl: z.union([z.string(), z.instanceof(File)]),
  subImageUrls: z.array(z.union([z.string(), z.instanceof(File)])),
  schedules: z.array(ScheduleTimeSchema),
});
export type CreateActivityReq = z.infer<typeof CreateActivityReqSchema>;

// POST: 체험 등록 응답
export const ScheduleSlotSchema = z.object({
  id: z.number(),
  startTime: z.string(),
  endTime: z.string(),
});
export type ScheduleSlot = z.infer<typeof ScheduleSlotSchema>;

export const ScheduleGroupSchema = z.object({
  date: z.string(),
  times: z.array(ScheduleSlotSchema),
});
export type ScheduleGroup = z.infer<typeof ScheduleGroupSchema>;

export const SubImageSchema = z.object({
  id: z.number(),
  imageUrl: z.string(),
});
export type SubImage = z.infer<typeof SubImageSchema>;

export const CreateActivityResSchema = ActivitySchema.extend({
  subImages: z.array(SubImageSchema),
  schedules: z.array(ScheduleGroupSchema),
});
export type CreateActivityRes = z.infer<typeof CreateActivityResSchema>;

// GET: 체험 상세 조회
export const ScheduleSchema = ScheduleTimeSchema.extend({
  id: z.number(),
});
export type Schedule = z.infer<typeof ScheduleSchema>;

export const ActivityDetailSchema = ActivitySchema.extend({
  subImages: z.array(SubImageSchema),
  schedules: z.array(ScheduleSchema),
});
export type ActivityDetail = z.infer<typeof ActivityDetailSchema>;

// GET: 체험 예약 가능일 조회
export const AvailableScheduleSchema = z.array(ScheduleGroupSchema);
export type AvailableSchedule = z.infer<typeof AvailableScheduleSchema>;

// GET: 체험 리뷰 조회 응답
export const UserSummarySchema = z.object({
  id: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
});
export type UserSummary = z.infer<typeof UserSummarySchema>;

export const ReviewSchema = z.object({
  id: z.number(),
  user: UserSummarySchema,
  activityId: z.number(),
  rating: z.number(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Review = z.infer<typeof ReviewSchema>;

export const GetReviewsResSchema = z.object({
  averageRating: z.number(),
  totalCount: z.number(),
  reviews: z.array(ReviewSchema),
});
export type GetReviewsRes = z.infer<typeof GetReviewsResSchema>;

// POST: 체험 예약 신청
export const CreateReservationReqSchema = z.object({
  scheduleId: z.number(),
  headCount: z.number(),
});
export type CreateReservationReq = z.infer<typeof CreateReservationReqSchema>;

// POST: 체험 예약 신청 응답
export const ReservationStatusSchema = z.enum([
  "pending",
  "confirmed",
  "declined",
  "canceled",
  "completed",
]);
export type ReservationStatus = z.infer<typeof ReservationStatusSchema>;

export const CreateReservationResSchema = z.object({
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
export type CreateReservationRes = z.infer<typeof CreateReservationResSchema>;

// POST: 체험 이미지 업로드 요청
export const UploadImageReqSchema = z.object({
  image: z.instanceof(File),
});
export type UploadImageReq = z.infer<typeof UploadImageReqSchema>;

// POST: 체험 이미지 업로드 응답
export const UploadImageResSchema = z.object({
  activityImageUrl: z.string(),
});
export type UploadImageRes = z.infer<typeof UploadImageResSchema>;
