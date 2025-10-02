import { apiRequest } from "@/lib/apiRequest";
import { toQueryString } from "@/lib/utills/queryString";

import {
  GetMyNotificationsRequest,
  GetMyNotificationsResponse,
  DeleteMyNotificationRequest,
} from "./types";

// GET: 내 알림 리스트 조회
export function getMyNotifications(params: GetMyNotificationsRequest) {
  const query = toQueryString(params);
  return apiRequest<GetMyNotificationsResponse>(`/my-notifications?${query}`);
}

// DELETE: 내 알림 삭제
export function deleteMyNotification(data: DeleteMyNotificationRequest) {
  return apiRequest<null>(`/my-notifications/${data.notificationId}`, {
    method: "DELETE",
  });
}
