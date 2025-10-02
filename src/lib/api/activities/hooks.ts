import { useApiMutation, ApiMutationOptions } from "@/lib/hooks/useApiMutation";
import { useFetchQuery, FetchQueryOptions } from "@/lib/hooks/useFetchQuery";

import {
  getActivities,
  getActivityDetail,
  createActivity,
  getAvailableSchedule,
  getActivityReviews,
  createReservation,
  uploadActivityImage,
} from "./api";
import {
  GetActivitiesReq,
  GetActivitiesRes,
  ActivityDetail,
  CreateActivityReq,
  CreateActivityRes,
  AvailableSchedule,
  GetReviewsRes,
  CreateReservationReq,
  CreateReservationRes,
  UploadImageRes,
} from "./types";

/** GET: 체험 리스트 조회 */
export function useActivities(
  params: GetActivitiesReq,
  isMock = false,
  options?: FetchQueryOptions<GetActivitiesRes>,
) {
  return useFetchQuery<GetActivitiesRes>(
    ["activities", params],
    isMock ? undefined : () => getActivities(params),
    {
      mockData: isMock
        ? {
            cursorId: 0,
            totalCount: 1,
            activities: [
              {
                id: 1,
                userId: 1,
                title: "Mock 체험",
                description: "목데이터 설명",
                category: "문화 · 예술",
                price: 10000,
                address: "서울",
                bannerImageUrl: "/mock/banner.jpg",
                rating: 4.5,
                reviewCount: 10,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          }
        : undefined,
      ...options,
    },
  );
}

/** GET: 체험 상세 조회 */
export function useActivityDetail(
  activityId: number,
  isMock = false,
  options?: FetchQueryOptions<ActivityDetail>,
) {
  return useFetchQuery<ActivityDetail>(
    ["activityDetail", activityId],
    isMock ? undefined : () => getActivityDetail(activityId),
    {
      mockData: isMock
        ? {
            id: activityId,
            userId: 1,
            title: "Mock 체험 상세",
            description: "목데이터 상세 설명",
            category: "스포츠",
            price: 20000,
            address: "부산",
            bannerImageUrl: "/mock/detail.jpg",
            rating: 5,
            reviewCount: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            subImages: [{ id: 1, imageUrl: "/mock/sub.jpg" }],
            schedules: [{ id: 1, date: "2025-10-03", startTime: "10:00", endTime: "12:00" }],
          }
        : undefined,
      ...options,
    },
  );
}

/** POST: 체험 등록 */
export function useCreateActivity(
  isMock = false,
  options?: ApiMutationOptions<CreateActivityRes, CreateActivityReq>,
) {
  return useApiMutation<CreateActivityRes, CreateActivityReq>(
    isMock ? undefined : (data) => createActivity(data),
    {
      mockResponse: isMock
        ? {
            id: 999,
            userId: 1,
            title: "Mock 등록된 체험",
            description: "목데이터 등록 설명",
            category: "웰빙",
            price: 30000,
            address: "제주도",
            bannerImageUrl: "/mock/new.jpg",
            rating: 0,
            reviewCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            subImages: [],
            schedules: [],
          }
        : undefined,
      ...options,
    },
  );
}

/** GET: 예약 가능일 조회 */
export function useAvailableSchedule(
  activityId: number,
  year: string,
  month: string,
  isMock = false,
  options?: FetchQueryOptions<AvailableSchedule>,
) {
  return useFetchQuery<AvailableSchedule>(
    ["availableSchedule", activityId, year, month],
    isMock ? undefined : () => getAvailableSchedule(activityId, year, month),
    {
      mockData: isMock
        ? [{ date: "2025-10-03", times: [{ id: 1, startTime: "09:00", endTime: "11:00" }] }]
        : undefined,
      ...options,
    },
  );
}

/** GET: 체험 리뷰 조회 */
export function useActivityReviews(
  activityId: number,
  page = 1,
  size = 3,
  isMock = false,
  options?: FetchQueryOptions<GetReviewsRes>,
) {
  return useFetchQuery<GetReviewsRes>(
    ["activityReviews", activityId, page, size],
    isMock ? undefined : () => getActivityReviews(activityId, page, size),
    {
      mockData: isMock
        ? {
            averageRating: 4.2,
            totalCount: 1,
            reviews: [
              {
                id: 1,
                activityId,
                rating: 4,
                content: "Mock 리뷰 내용",
                user: { id: 1, nickname: "MockUser", profileImageUrl: "/mock/user.jpg" },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          }
        : undefined,
      ...options,
    },
  );
}

/** POST: 체험 예약 신청 */
export function useCreateReservation(
  activityId: number,
  isMock = false,
  options?: ApiMutationOptions<CreateReservationRes, CreateReservationReq>,
) {
  return useApiMutation<CreateReservationRes, CreateReservationReq>(
    isMock ? undefined : (data) => createReservation(activityId, data),
    {
      mockResponse: isMock
        ? {
            id: 123,
            teamId: "mockTeam",
            userId: 1,
            activityId,
            scheduleId: 1,
            status: "pending",
            reviewSubmitted: false,
            totalPrice: 20000,
            headCount: 2,
            date: "2025-10-03",
            startTime: "09:00",
            endTime: "11:00",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : undefined,
      ...options,
    },
  );
}

/** POST: 체험 이미지 업로드 */
export function useUploadActivityImage(
  isMock = false,
  options?: ApiMutationOptions<UploadImageRes, FormData>,
) {
  return useApiMutation<UploadImageRes, FormData>(
    isMock ? undefined : (formData) => uploadActivityImage(formData),
    {
      mockResponse: isMock ? { activityImageUrl: "/mock/uploaded.jpg" } : undefined,
      ...options,
    },
  );
}
