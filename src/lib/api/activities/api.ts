import { apiRequest } from "@/lib/apiRequest";
import { toQueryString } from "@/lib/utills/queryString";

import {
  GetActivitiesRequest,
  GetActivitiesResponse,
  CreateActivityRequest,
  CreateActivityResponse,
  ActivityDetail,
  AvailableSchedule,
  GetActivityReviewsResponse,
  CreateReservationRequest,
  CreateReservationResponse,
  UploadActivityImageResponse,
} from "./types";

// GET: 체험 리스트 조회
export function getActivities(params: GetActivitiesRequest) {
  const query = toQueryString(params);
  return apiRequest<GetActivitiesResponse>(`/activities?${query}`);
}

// POST: 체험 등록
export function createActivity(data: CreateActivityRequest) {
  return apiRequest<CreateActivityResponse>(`/activities`, {
    method: "POST",
    data,
  });
}

// GET: 체험 상세 조회
export function getActivityDetail(activityId: number) {
  return apiRequest<ActivityDetail>(`/activities/${activityId}`);
}

// GET: 예약 가능일 조회
export function getAvailableSchedule(activityId: number, year: string, month: string) {
  return apiRequest<AvailableSchedule>(
    `/activities/${activityId}/available-schedule?year=${year}&month=${month}`,
  );
}

// GET: 체험 리뷰 조회
export function getActivityReviews(activityId: number, page = 1, size = 3) {
  return apiRequest<GetActivityReviewsResponse>(
    `/activities/${activityId}/reviews?page=${page}&size=${size}`,
  );
}

// POST: 체험 예약 신청
export function createReservation(activityId: number, data: CreateReservationRequest) {
  return apiRequest<CreateReservationResponse>(`/activities/${activityId}/reservations`, {
    method: "POST",
    data,
  });
}

// POST: 체험 이미지 업로드
export function uploadActivityImage(formData: FormData) {
  return apiRequest<UploadActivityImageResponse>(`/activities/image`, {
    method: "POST",
    isFormData: true,
    data: formData,
  });
}
