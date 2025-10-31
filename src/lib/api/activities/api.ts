import { apiRequest } from "@/lib/apiRequest";
import { toQueryString } from "@/lib/utills/queryString";

import {
  GetActivitiesReq,
  GetActivitiesRes,
  GetActivitiesResSchema,
  CreateActivityReq,
  CreateActivityRes,
  CreateActivityResSchema,
  ActivityDetail,
  ActivityDetailSchema,
  AvailableSchedule,
  AvailableScheduleSchema,
  GetReviewsRes,
  GetReviewsResSchema,
  CreateReservationReq,
  CreateReservationRes,
  CreateReservationResSchema,
  UploadImageRes,
  UploadImageResSchema,
} from "./types";

// GET: 체험 리스트 조회
export function getActivities(params: GetActivitiesReq) {
  const query = toQueryString(params);
  return apiRequest<GetActivitiesRes>(`/activities?${query}`, {
    schema: GetActivitiesResSchema,
    next: { revalidate: 60 },
  });
}

// POST: 체험 등록
export function createActivity(data: CreateActivityReq) {
  return apiRequest<CreateActivityRes>(`/activities`, {
    method: "POST",
    data,
    schema: CreateActivityResSchema,
  });
}

// GET: 체험 상세 조회
export function getActivityDetail(activityId: number) {
  return apiRequest<ActivityDetail>(`/activities/${activityId}`, {
    schema: ActivityDetailSchema,
  });
}

// GET: 예약 가능일 조회
export function getAvailableSchedule(activityId: number, year: string, month: string) {
  return apiRequest<AvailableSchedule>(
    `/activities/${activityId}/available-schedule?year=${year}&month=${month}`,
    { schema: AvailableScheduleSchema },
  );
}

// GET: 체험 리뷰 조회
export function getActivityReviews(activityId: number, page = 1, size = 3) {
  return apiRequest<GetReviewsRes>(`/activities/${activityId}/reviews?page=${page}&size=${size}`, {
    schema: GetReviewsResSchema,
  });
}

// POST: 체험 예약 신청
export function createReservation(activityId: number, data: CreateReservationReq) {
  return apiRequest<CreateReservationRes>(`/activities/${activityId}/reservations`, {
    method: "POST",
    data,
    schema: CreateReservationResSchema,
  });
}

//POST: 체험 이미지 URL생성
export function uploadActivityImage(formData: FormData) {
  return apiRequest<UploadImageRes>(`/activities/image`, {
    method: "POST",
    isFormData: true,
    data: formData,
    schema: UploadImageResSchema,
  });
}
