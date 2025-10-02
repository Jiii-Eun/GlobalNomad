// GET: 내 알림 리스트 조회 요청
export interface GetMyNotificationsRequest {
  teamId: string;
  cursorId?: number;
  size?: number; // 기본값 10
}

// GET: 내 알림 리스트 조회 응답
export interface Notification {
  id: number;
  teamId: string;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // 삭제된 경우에만 존재
}

export interface GetMyNotificationsResponse {
  cursorId: number;
  notifications: Notification[];
  totalCount: number;
}

// DELETE: 내 알림 삭제 요청
export interface DeleteMyNotificationRequest {
  teamId: string;
  notificationId: number;
}
