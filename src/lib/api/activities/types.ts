// GET: 체험 리스트 조회 요청
export type ActivityCategory = "문화 · 예술" | "식음료" | "스포츠" | "투어" | "관광" | "웰빙";
export type ActivitySort = "most_reviewed" | "price_asc" | "price_desc" | "latest";

export interface GetActivitiesRequest {
  method: "offset" | "cursor";
  cursorId?: number;
  category?: ActivityCategory;
  keyword?: string;
  sort?: ActivitySort;
  page?: number;
  size?: number;
}

// GET: 체험 리스트 조회
export interface Activity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetActivitiesResponse {
  cursorId: number;
  totalCount: number;
  activities: Activity[];
}

// POST: 체험 등록
export interface ScheduleTime {
  date: string;
  startTime: string;
  endTime: string;
}

export interface CreateActivityRequest {
  title: string;
  category: string;
  description: string;
  address: string;
  price: number;
  bannerImageUrl: string | File;
  subImageUrls: (string | File)[];
  schedules: ScheduleTime[];
}

// POST: 체험 등록 응답
export interface ScheduleSlot {
  id: number;
  startTime: string;
  endTime: string;
}
export interface ScheduleGroup {
  date: string;
  times: ScheduleSlot[];
}

export interface SubImage {
  id: number;
  imageUrl: string;
}

export interface CreateActivityResponse extends Activity {
  subImages: SubImage[];
  schedules: ScheduleGroup[];
}

// GET: 체험 상세 조회
export interface Schedule extends ScheduleTime {
  id: number;
}

export interface ActivityDetail extends Activity {
  subImages: SubImage[];
  schedules: Schedule[];
}

// GET: 체험 예약 가능일 조회
export type AvailableSchedule = ScheduleGroup[];

// GET: 체험 리뷰 조회 응답
export interface UserSummary {
  id: number;
  nickname: string;
  profileImageUrl: string;
}
export interface Review {
  id: number;
  user: UserSummary;
  activityId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetActivityReviewsResponse {
  averageRating: number;
  totalCount: number;
  reviews: Review[];
}

// POST: 체험 예약 신청
export interface CreateReservationRequest {
  scheduleId: number;
  headCount: number;
}

// POST: 체험 예약 신청 응답
export type ReservationStatus = "pending" | "confirmed" | "declined" | "canceled" | "completed";

export interface CreateReservationResponse {
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

// POST: 체험 이미지 업로드 요청
export interface UploadActivityImageRequest {
  image: File;
}

// POST: 체험 이미지 업로드 응답
export interface UploadActivityImageResponse {
  activityImageUrl: string;
}
